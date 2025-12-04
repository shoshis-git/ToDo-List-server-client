using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ======================================
// Load environment variables
// ======================================
builder.Configuration.AddEnvironmentVariables();

// ======================================
// Add services
// ======================================
builder.Services.AddControllers();

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy.WithOrigins(
            "https://to-do-list-client-6e7i.onrender.com",
            "http://localhost:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// ======================================
// Database Connection
// ======================================
// Clever Cloud sets environment variable for DB connection string
var connectionString = Environment.GetEnvironmentVariable("tododb")
                      ?? throw new Exception("Connection string not found!");

// MySQL with Pomelo
builder.Services.AddDbContext<ToDoDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
    
});

// ======================================
// Build app
// ======================================
var app = builder.Build();

// ======================================
// Middleware
// ======================================
app.UseCors("AllowClient");
app.UseHttpsRedirection();

app.MapControllers();

// ======================================
// Run
// ======================================
app.Run();
