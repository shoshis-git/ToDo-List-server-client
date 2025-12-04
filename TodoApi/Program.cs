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
            "https://to-do-list-client-6e7i.onrender.com"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// ======================================
// Database Connection
// ======================================
string? connectionString = Environment.GetEnvironmentVariable("tododb")
                              ?? builder.Configuration.GetConnectionString("ToDoDb");

if (string.IsNullOrEmpty(connectionString))
{
    Console.WriteLine("ERROR: No database connection string found!");
    throw new Exception("Connection string not found!");
}

Console.WriteLine("Connecting to DB...");

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
