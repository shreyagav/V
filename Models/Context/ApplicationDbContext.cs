using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Models.Context
{
    public partial class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext()
        {
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
        public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; }
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }
        public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; }
        public virtual DbSet<CalendarEvent> CalendarEvents { get; set; }
        public virtual DbSet<CalendarEventType> CalendarEventTypes { get; set; }
        public virtual DbSet<Contact> Contacts { get; set; }
        public virtual DbSet<Diagnosis> Diagnoses { get; set; }
        public virtual DbSet<EventBudget> EventBudgets { get; set; }
        public virtual DbSet<EventSite> EventSites { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<NotificationAttachment> NotificationAttachments { get; set; }
        public virtual DbSet<NotificationRecepient> NotificationRecepients { get; set; }
        public virtual DbSet<Option> Options { get; set; }
        public virtual DbSet<OptionCategory> OptionCategories { get; set; }
        public virtual DbSet<Photo> Photos { get; set; }
        public virtual DbSet<Region> Regions { get; set; }
        public virtual DbSet<SystemCode> SystemCodes { get; set; }
        public virtual DbSet<UserDiagnosis> UserDiagnoses { get; set; }
        public virtual DbSet<UserEvent> UserEvents { get; set; }
        public virtual DbSet<UserEventsTemp> UserEventsTemps { get; set; }
        public virtual DbSet<UserOption> UserOptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AspNetRole>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetRoleClaim>(entity =>
            {
                entity.Property(e => e.RoleId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetRoleClaims)
                    .HasForeignKey(d => d.RoleId);
            });

            modelBuilder.Entity<AspNetUser>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("date");

                entity.Property(e => e.DateInjured).HasColumnType("date");

                entity.Property(e => e.DateOfBirth).HasColumnType("date");

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.Gender)
                    .IsRequired()
                    .HasMaxLength(1);

                entity.Property(e => e.JoinDate).HasColumnType("date");

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.OldType).HasDefaultValueSql("((54))");

                entity.Property(e => e.OtherBackgroundCheckComment).IsUnicode(false);

                entity.Property(e => e.SponsoredById).HasMaxLength(450);

                entity.Property(e => e.TrrbackgroundCheck).HasColumnName("TRRBackgroundCheck");

                entity.Property(e => e.UserName).HasMaxLength(256);

                entity.HasOne(d => d.EmergencyContact)
                    .WithMany(p => p.AspNetUsers)
                    .HasForeignKey(d => d.EmergencyContactId);

                entity.HasOne(d => d.Site)
                    .WithMany(p => p.AspNetUsers)
                    .HasForeignKey(d => d.SiteId);

                entity.HasOne(d => d.SponsoredBy)
                    .WithMany(p => p.InverseSponsoredBy)
                    .HasForeignKey(d => d.SponsoredById);

                entity.HasMany(d => d.Roles)
                    .WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "AspNetUserRole",
                        l => l.HasOne<AspNetRole>().WithMany().HasForeignKey("RoleId"),
                        r => r.HasOne<AspNetUser>().WithMany().HasForeignKey("UserId"),
                        j =>
                        {
                            j.HasKey("UserId", "RoleId");

                            j.ToTable("AspNetUserRoles");
                        });
            });

            modelBuilder.Entity<AspNetUserClaim>(entity =>
            {
                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserClaims)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserLogin>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserLogins)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserToken>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserTokens)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<CalendarEvent>(entity =>
            {
                entity.Property(e => e.CreatedById).HasMaxLength(450);

                entity.Property(e => e.Fee).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ModifiedById).HasMaxLength(450);

                entity.Property(e => e.OldEventVisibility).HasMaxLength(1);

                entity.Property(e => e.ProjectedCost).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.CalendarEventCreatedBies)
                    .HasForeignKey(d => d.CreatedById);

                entity.HasOne(d => d.EventType)
                    .WithMany(p => p.CalendarEvents)
                    .HasForeignKey(d => d.EventTypeId);

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.CalendarEventModifiedBies)
                    .HasForeignKey(d => d.ModifiedById);

                entity.HasOne(d => d.Site)
                    .WithMany(p => p.CalendarEvents)
                    .HasForeignKey(d => d.SiteId);
            });

            modelBuilder.Entity<EventBudget>(entity =>
            {
                entity.Property(e => e.Cost).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Quantity).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.EventBudgets)
                    .HasForeignKey(d => d.EventId);
            });

            modelBuilder.Entity<EventSite>(entity =>
            {
                entity.Property(e => e.Govtid).HasColumnName("GOVTId");

                entity.Property(e => e.Originated).HasColumnType("date");

                entity.HasOne(d => d.Coordinator)
                    .WithMany(p => p.EventSiteCoordinators)
                    .HasForeignKey(d => d.CoordinatorId);

                entity.HasOne(d => d.Govt)
                    .WithMany(p => p.EventSiteGovts)
                    .HasForeignKey(d => d.Govtid);

                entity.HasOne(d => d.Main)
                    .WithMany(p => p.EventSiteMains)
                    .HasForeignKey(d => d.MainId);

                entity.HasOne(d => d.National)
                    .WithMany(p => p.EventSiteNationals)
                    .HasForeignKey(d => d.NationalId);

                entity.HasOne(d => d.Outreach)
                    .WithMany(p => p.EventSiteOutreaches)
                    .HasForeignKey(d => d.OutreachId);

                entity.HasOne(d => d.Region)
                    .WithMany(p => p.EventSites)
                    .HasForeignKey(d => d.RegionId)
                    .HasConstraintName("FK_EventSites_Regions");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(e => e.NotificationId).ValueGeneratedNever();

                entity.Property(e => e.Body)
                    .IsRequired()
                    .IsUnicode(false);

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.CreatedById).HasMaxLength(450);

                entity.Property(e => e.Subject)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.CreatedById)
                    .HasConstraintName("FK_Notifications_AspNetUsers");

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.EventId)
                    .HasConstraintName("FK_Notifications_CalendarEvents");

                entity.HasOne(d => d.EventSite)
                    .WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.EventSiteId)
                    .HasConstraintName("FK_Notifications_EventSites");
            });

            modelBuilder.Entity<NotificationAttachment>(entity =>
            {
                entity.Property(e => e.NotificationAttachmentId).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Uploaded).HasColumnType("datetime");

                entity.HasOne(d => d.Notification)
                    .WithMany(p => p.NotificationAttachments)
                    .HasForeignKey(d => d.NotificationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_NotificationAttachments_Notifications");
            });

            modelBuilder.Entity<NotificationRecepient>(entity =>
            {
                entity.Property(e => e.NotificationRecepientId).ValueGeneratedNever();

                entity.Property(e => e.Sent).HasColumnType("datetime");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.Notification)
                    .WithMany(p => p.NotificationRecepients)
                    .HasForeignKey(d => d.NotificationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_NotificationRecepients_Notifications");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.NotificationRecepients)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_NotificationRecepients_AspNetUsers");
            });

            modelBuilder.Entity<Option>(entity =>
            {
                entity.HasOne(d => d.OptionCategory)
                    .WithMany(p => p.Options)
                    .HasForeignKey(d => d.OptionCategoryId);
            });

            modelBuilder.Entity<Photo>(entity =>
            {
                entity.HasOne(d => d.Event)
                    .WithMany(p => p.Photos)
                    .HasForeignKey(d => d.EventId);
            });

            modelBuilder.Entity<Region>(entity =>
            {
                entity.Property(e => e.RegionName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.ShortName).HasMaxLength(10);
            });

            modelBuilder.Entity<SystemCode>(entity =>
            {
                entity.Property(e => e.CodeType).HasMaxLength(2);

                entity.Property(e => e.Description).HasMaxLength(50);
            });

            modelBuilder.Entity<UserDiagnosis>(entity =>
            {
                entity.HasKey(e => new { e.DiagnosisId, e.UserId });

                entity.HasOne(d => d.Diagnosis)
                    .WithMany(p => p.UserDiagnoses)
                    .HasForeignKey(d => d.DiagnosisId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserDiagnoses)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<UserEvent>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.EventId });

                entity.Property(e => e.CreatedById).HasMaxLength(450);

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.UserEventCreatedBies)
                    .HasForeignKey(d => d.CreatedById);

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.UserEvents)
                    .HasForeignKey(d => d.EventId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserEventUsers)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<UserEventsTemp>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.EventId });

                entity.ToTable("UserEvents_temp");

                entity.Property(e => e.CreatedById).HasMaxLength(450);
            });

            modelBuilder.Entity<UserOption>(entity =>
            {
                entity.HasKey(e => new { e.OptionId, e.UserId });

                entity.HasOne(d => d.Option)
                    .WithMany(p => p.UserOptions)
                    .HasForeignKey(d => d.OptionId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserOptions)
                    .HasForeignKey(d => d.UserId);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
