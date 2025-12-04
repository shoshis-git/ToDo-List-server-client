using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

[ApiController]
[Route("items")] // הקפד שה־Route תואם ל־URL שה־frontend קורא
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
        var tasks = await _context.Items
            .Select(i => new { i.Id, name = i.Name, i.IsComplete }) // מיפוי נכון לשדות
            .ToListAsync();
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] Item task)
    {
        if (string.IsNullOrWhiteSpace(task.Name))
            return BadRequest("Task name is required.");

        _context.Items.Add(task);
        await _context.SaveChangesAsync();

        return Ok(new { task.Id, name = task.Name, task.IsComplete });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] Item updatedTask)
    {
        var task = await _context.Items.FindAsync(id);
        if (task == null) return NotFound();

        task.Name = updatedTask.Name;
        task.IsComplete = updatedTask.IsComplete;

        await _context.SaveChangesAsync();
        return Ok(new { task.Id, name = task.Name, task.IsComplete });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Items.FindAsync(id);
        if (task == null) return NotFound();

        _context.Items.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
