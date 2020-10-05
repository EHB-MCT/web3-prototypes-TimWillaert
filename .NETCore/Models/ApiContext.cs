using Microsoft.EntityFrameworkCore;

namespace _NETCore.Models
{
    public class TodoContext : DbContext
    {
        public TodoContext(DbContextOptions<TodoContext> options)
            : base(options)
        {
        }
    }
}