using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

[ApiController]
[Route("items")] // מתאים ל־frontend
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

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] Item task)
    {
        var existing = await _context.Items.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = task.Name;
        existing.IsComplete = task.IsComplete;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Items.FindAsync(id);
        if (task == null) return NotFound();

        _context.Items.Remove(task);
        await _context.SaveChangesAsync();
        return Ok(task);
    }
}
