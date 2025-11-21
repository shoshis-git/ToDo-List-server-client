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
// builder.Services.AddDbContext<ToDoDbContext>(options =>
//     options.UseMySql(
//         builder.Configuration.GetConnectionString("ToDoDB"),
//         ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("ToDoDB"))
//     ));



// builder.Services.AddDbContext<ToDoDbContext>(options =>
//     options.UseMySql(
//         builder.Configuration.GetConnectionString("ToDoListDB"),
//         new MySqlServerVersion(new Version(8, 0, 44))
//     )
// );
var connectionString =
    builder.Configuration.GetConnectionString("ToDoListDB") ??
    Environment.GetEnvironmentVariable("ConnectionStrings__ToDoListDB");

builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(8, 0, 44)),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure()
    )
);



// ===================
// CORS
// ===================
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React app origin
              .AllowAnyHeader()
              .AllowAnyMethod();
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

// ===================
// Middleware
// ===================
app.UseCors();
// if (app.Environment.IsDevelopment())
// {
    app.UseSwagger();
    app.UseSwaggerUI();
// }

app.UseAuthentication();
app.UseAuthorization();

// ===================
// Auth Endpoints
// ===================

// Register
app.MapPost("/register", async (ToDoDbContext db, User user) =>
{
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Ok(new { user.Id, user.Username });
});

// Login
app.MapPost("/login", async (ToDoDbContext db, User login) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == login.Username && u.Password == login.Password);
    if (user == null) return Results.Unauthorized();

    var tokenHandler = new JwtSecurityTokenHandler();
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
        Expires = DateTime.UtcNow.AddHours(1),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };
    var token = tokenHandler.CreateToken(tokenDescriptor);
    var jwt = tokenHandler.WriteToken(token);

    return Results.Ok(new { token = jwt });
});

// ===================
// Todo CRUD Endpoints (JWT Protected)
// ===================

// GET all items
app.MapGet("/items", async (ToDoDbContext db) =>
    await db.Items.ToListAsync()
).RequireAuthorization();

// POST new item
app.MapPost("/items", async (ToDoDbContext db, Item item) =>
{
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/items/{item.Id}", item);
}).RequireAuthorization();

// PUT update item
app.MapPut("/items/{id}", async (ToDoDbContext db, int id, Item updatedItem) =>
{
    var item = await db.Items.FindAsync(id);
    if (item == null) return Results.NotFound();

    item.Name = updatedItem.Name;
    item.IsComplete = updatedItem.IsComplete;

    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

// DELETE item
app.MapDelete("/items/{id}", async (ToDoDbContext db, int id) =>
{
    var item = await db.Items.FindAsync(id);
    if (item == null) return Results.NotFound();

    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<ToDoDbContext>();
var users = await db.Users.ToListAsync();
Console.WriteLine($"Users count: {users.Count}");


app.MapGet("/", () => "Todo API is running...");
app.Run();
