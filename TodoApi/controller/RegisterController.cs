using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("register")]
    public class RegisterController : ControllerBase
    {
        private readonly ToDoDbContext _context;

        public RegisterController(ToDoDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Register(User user)
        {
            if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
                return BadRequest("Username and password are required.");

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == user.Username);

            if (existingUser != null)
                return Conflict("User already exists.");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // אם תרצה, אפשר להוסיף JWT כאן בעתיד
            return Ok(new { user.Id, user.Username });
        }
    }
}
