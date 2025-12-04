using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("tasks")]
public class TasksController : ControllerBase
{
    private readonly ToDoDbContext _context;

    public TasksController(ToDoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        var tasks = await _context.Items.ToListAsync();
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] Item task)
    {
        _context.Items.Add(task);
        await _context.SaveChangesAsync();
        return Ok(task);
    }
}
