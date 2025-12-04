using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TodoApi.Data;

var builder = WebApplication.CreateBuilder(args);

// ======================================
// Load environment variables (Render)
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
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                      ?? builder.Configuration["DefaultConnection"]
                      ?? throw new Exception("Connection string not found!");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
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
