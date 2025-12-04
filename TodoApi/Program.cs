using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables
builder.Configuration.AddEnvironmentVariables();

// Add services
builder.Services.AddControllers();

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy.WithOrigins("https://to-do-list-client-6e7i.onrender.com")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Database Connection
string? connectionString = Environment.GetEnvironmentVariable("tododb") ??
                               builder.Configuration.GetConnectionString("ToDoDb");

if (string.IsNullOrEmpty(connectionString))
{
    Console.WriteLine("ERROR: No database connection string found!");
    throw new Exception("Connection string not found!");
}

Console.WriteLine("Connecting to DB...");

builder.Services.AddDbContext<ToDoDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

var app = builder.Build();

// Use CORS **before** mapping controllers
app.UseCors("AllowClient");

// Removing HTTPS Redirection for Localhost (optional)
app.UseHttpsRedirection();

// Map controllers (this handles your routes)
app.MapControllers();

// Configure Port for Cloud Deployment or Localhost
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";  // Choose the port for local development
app.Urls.Add($"http://0.0.0.0:{port}");

app.Run();
