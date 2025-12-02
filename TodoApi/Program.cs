using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

// ===================
// DB Context
// ===================
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("tododb"),
        new MySqlServerVersion(new Version(8, 0, 44))
    )
);

// ===================
// CORS
// ===================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://todo-list-client.onrender.com"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// ===================
// Swagger
// ===================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===================
// JWT Authentication
// ===================
var key = Encoding.ASCII.GetBytes("ThisIsAStrongJwtSecretKey_ChangeMe123456");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// ===========================
// MUST COME BEFORE ANYTHING!
// Handles Preflight correctly
// ===========================
// app.MapMethods("{*path}", new[] { "OPTIONS" }, () => Results.Ok())
//    .AllowAnonymous();

// ===================
// Middleware order
// ===================
app.UseRouting();
app.UseCors("AllowClient");   
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
// ===================
// Auth Endpoints
// ===================
app.MapPost("/register", async (ToDoDbContext db, User user) =>
{
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Ok(new { user.Id, user.Username });
});

app.MapPost("/login", async (ToDoDbContext db, User login) =>
{
    var user = await db.Users.FirstOrDefaultAsync(
        u => u.Username == login.Username && u.Password == login.Password
    );

    if (user == null)
        return Results.Unauthorized();

    var tokenHandler = new JwtSecurityTokenHandler();
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
        Expires = DateTime.UtcNow.AddHours(1),
        SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature
        )
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    var jwt = tokenHandler.WriteToken(token);

    return Results.Ok(new { token = jwt });
});

// ===================
// Items (Protected)
// ===================
app.MapGet("/items", async (ToDoDbContext db) =>
    await db.Items.ToListAsync()
).RequireAuthorization();

app.MapPost("/items", async (ToDoDbContext db, Item item) =>
{
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/items/{item.Id}", item);
}).RequireAuthorization();

app.MapPut("/items/{id}", async (ToDoDbContext db, int id, Item updatedItem) =>
{
    var item = await db.Items.FindAsync(id);
    if (item == null) return Results.NotFound();

    item.Name = updatedItem.Name;
    item.IsComplete = updatedItem.IsComplete;

    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.MapDelete("/items/{id}", async (ToDoDbContext db, int id) =>
{
    var item = await db.Items.FindAsync(id);
    if (item == null) return Results.NotFound();

    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.MapGet("/", () => "Todo API is running...");

app.Run();
