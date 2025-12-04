using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models
{
   

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public partial class ToDoDbContext : DbContext
    {
        public ToDoDbContext() { }

        public ToDoDbContext(DbContextOptions<ToDoDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Item> Items { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // מיפוי ל-User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("users");
                entity.Property(e => e.Username)
                      .IsRequired()
                      .HasMaxLength(100);
                entity.Property(e => e.Password)
                      .IsRequired()
                      .HasMaxLength(255); // מספיק לכל hash של סיסמה
            });

            // מיפוי ל-Item - שים לב שהשדה עכשיו נקרא Name במקום Username
            modelBuilder.Entity<Item>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("items");
                entity.Property(e => e.Name)  // המאפיין של שם המשימה
                      .IsRequired()
                      .HasMaxLength(100);  // אורך מקסימלי
                entity.Property(e => e.IsComplete)
                      .IsRequired();
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
