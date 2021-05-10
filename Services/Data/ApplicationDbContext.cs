using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Logging;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Services.Data
{

    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer("Server=tcp:mcdean-dev.database.windows.net,1433;Initial Catalog=test-teamriverrunner;Persist Security Info=False;User ID=sql_dmytrod;Password=Pa$$w0rd;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

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
        public DbSet<Region> Regions { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationAttachment> NotificationAttachments { get; set; }
        public DbSet<NotificationRecepient> NotificationRecepients { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public static readonly ILoggerFactory factory
            = LoggerFactory.Create(builder => { 
                builder.AddConsole(); 
            });
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLoggerFactory(factory).EnableSensitiveDataLogging(); ;
        }
        public IQueryable<TRRUser> Veterans()
        {
            return this.Users.Where(a => a.OldType == TRRUserType.Veteran || a.Options.Any(b => b.OptionId == 37));
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
            modelBuilder.Entity<EventSite>().HasOne(e => e.Region).WithMany(r => r.EventSites).HasForeignKey(a => a.RegionId);
            modelBuilder.Entity<CalendarEventType>().HasIndex(e => e.Order);
            modelBuilder.Entity<NotificationRecepient>().HasKey(a => new { a.NotificationId, a.UserId });
            modelBuilder.Entity<NotificationRecepient>().HasOne(a => a.User).WithMany(a=>a.NotificationRecepients).HasForeignKey(a=>a.UserId);
            modelBuilder.Entity<NotificationRecepient>().HasOne(a => a.Notification).WithMany(a => a.Recepients).HasForeignKey(a=>a.NotificationId);
            modelBuilder.Entity<NotificationAttachment>().HasOne(a => a.Notification).WithMany(a => a.NotificationAttachments).HasForeignKey(a => a.NotificationId);
            modelBuilder.Entity<NotificationAttachment>().Ignore(a => a.AttachmentData);
            modelBuilder.Entity<NotificationAttachment>().Ignore(a => a.AttachmentDataStr);
            modelBuilder.Entity<Notification>().HasOne(a => a.EventSite).WithMany(a => a.Notifications).HasForeignKey(a => a.EventSiteId).IsRequired(false);
            modelBuilder.Entity<Notification>().HasOne(a => a.Event).WithMany(a => a.Notifications).HasForeignKey(a => a.EventId).IsRequired(false);
        }
    }
}
