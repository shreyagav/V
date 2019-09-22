using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer("Data Source=912-4801\\sql2016std;Initial Catalog=test-teamriverrunner;User ID=sql_dmytrod;Password=Pa$$w0rd;MultipleActiveResultSets=False;Connection Timeout=30;");

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }

    public class ApplicationDbContext : IdentityDbContext<TRRUser>
    {
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<UserEvent> UserEvents { get; set; }
        public DbSet<CalendarEvent> CalendarEvents { get; set; }
        public DbSet<CalendarEventType> CalendarEventTypes { get; set; }
        public DbSet<EventSite> EventSites { get; set; }
        public DbSet<Option> Options { get; set; }
        public DbSet<OptionCategory> OptionCategories { get; set; }
        public DbSet<UserOption> UserOptions { get; set; }
        public DbSet<Diagnosis> Diagnoses { get; set; }
        public DbSet<UserDiagnosis> UserDiagnoses { get; set; }
        public DbSet<SystemCode> SystemCodes { get; set; }
        public DbSet<BudgetLine> EventBudgets { get; set; }
        public DbSet<Photo> Photos { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<UserEvent>()
                .HasOne<TRRUser>(e => e.User)
                .WithMany(u => u.Events)
                .HasForeignKey(e => e.UserId);
            modelBuilder.Entity<UserEvent>()
                .HasKey(ue => new { ue.UserId, ue.EventId });
            modelBuilder.Entity<UserOption>()
                            .HasOne(e => e.User)
                            .WithMany(u => u.Options)
                            .HasForeignKey(e => e.UserId);
            modelBuilder.Entity<UserOption>()
                            .HasOne(e => e.Option)
                            .WithMany(a=>a.UserOptions)
                            .HasForeignKey(e => e.OptionId);
            modelBuilder.Entity<UserOption>().HasKey(o => new { o.OptionId, o.UserId });
            modelBuilder.Entity<UserDiagnosis>().HasKey(o => new { o.DiagnosisId, o.UserId });
            modelBuilder.Entity<UserDiagnosis>()
                .HasOne(e => e.User)
                .WithMany(u => u.Diagnoses)
                .HasForeignKey(e => e.UserId);
            modelBuilder.Entity<UserDiagnosis>()
                            .HasOne(e => e.Diagnosis)
                            .WithMany(a => a.Users)
                            .HasForeignKey(e => e.DiagnosisId);
            modelBuilder.Entity<TRRUser>()
                .HasIndex(a => a.OldId)
                .IsUnique();
            modelBuilder.Entity<TRRUser>(entity =>
            {
                entity.Property(p => p.Deleted).HasDefaultValue(false);
                entity.Property(p => p.OldType).HasDefaultValue(TRRUserType.Civilian);
            });
            modelBuilder.Entity<EventSite>(entity =>
            {
                entity.Property(p => p.AllowEverybody).HasDefaultValue(false);
            });
            modelBuilder.Entity<CalendarEventType>().HasIndex(e => e.Order);
        }
    }
}
