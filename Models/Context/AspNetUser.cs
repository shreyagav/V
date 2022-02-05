using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class AspNetUser
    {
        public AspNetUser()
        {
            AspNetUserClaims = new HashSet<AspNetUserClaim>();
            AspNetUserLogins = new HashSet<AspNetUserLogin>();
            AspNetUserTokens = new HashSet<AspNetUserToken>();
            CalendarEventCreatedBies = new HashSet<CalendarEvent>();
            CalendarEventModifiedBies = new HashSet<CalendarEvent>();
            InverseSponsoredBy = new HashSet<AspNetUser>();
            NotificationRecepients = new HashSet<NotificationRecepient>();
            Notifications = new HashSet<Notification>();
            UserDiagnoses = new HashSet<UserDiagnosis>();
            UserEventCreatedBies = new HashSet<UserEvent>();
            UserEventUsers = new HashSet<UserEvent>();
            UserOptions = new HashSet<UserOption>();
            Roles = new HashSet<AspNetRole>();
        }

        public string Id { get; set; }
        public string UserName { get; set; }
        public string NormalizedUserName { get; set; }
        public string Email { get; set; }
        public string NormalizedEmail { get; set; }
        public bool EmailConfirmed { get; set; }
        public string PasswordHash { get; set; }
        public string SecurityStamp { get; set; }
        public string ConcurrencyStamp { get; set; }
        public string PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public bool LockoutEnabled { get; set; }
        public int AccessFailedCount { get; set; }
        public int OldId { get; set; }
        public string OldLogin { get; set; }
        public string OldPassword { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AltPhone { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int OldSiteId { get; set; }
        public int OldType { get; set; }
        public string Gender { get; set; }
        public string TravelTime { get; set; }
        public DateTime? JoinDate { get; set; }
        public int OldSponsoredById { get; set; }
        public string SponsoredById { get; set; }
        public int OldAuthLevel { get; set; }
        public bool Active { get; set; }
        public string DeactiveCause { get; set; }
        public int BranchId { get; set; }
        public int OldStatus { get; set; }
        public int Medical { get; set; }
        public DateTime? DateInjured { get; set; }
        public bool ReleaseSigned { get; set; }
        public bool LiabilitySigned { get; set; }
        public string Comments { get; set; }
        public int? SiteId { get; set; }
        public DateTime Created { get; set; }
        public bool Deleted { get; set; }
        public int? EmergencyContactId { get; set; }
        public bool TrrbackgroundCheck { get; set; }
        public bool OtherBackgroundCheck { get; set; }
        public string OtherBackgroundCheckComment { get; set; }
        public bool CodeOfConductTraining { get; set; }

        public virtual Contact EmergencyContact { get; set; }
        public virtual EventSite Site { get; set; }
        public virtual AspNetUser SponsoredBy { get; set; }
        public virtual ICollection<AspNetUserClaim> AspNetUserClaims { get; set; }
        public virtual ICollection<AspNetUserLogin> AspNetUserLogins { get; set; }
        public virtual ICollection<AspNetUserToken> AspNetUserTokens { get; set; }
        public virtual ICollection<CalendarEvent> CalendarEventCreatedBies { get; set; }
        public virtual ICollection<CalendarEvent> CalendarEventModifiedBies { get; set; }
        public virtual ICollection<AspNetUser> InverseSponsoredBy { get; set; }
        public virtual ICollection<NotificationRecepient> NotificationRecepients { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
        public virtual ICollection<UserDiagnosis> UserDiagnoses { get; set; }
        public virtual ICollection<UserEvent> UserEventCreatedBies { get; set; }
        public virtual ICollection<UserEvent> UserEventUsers { get; set; }
        public virtual ICollection<UserOption> UserOptions { get; set; }

        public virtual ICollection<AspNetRole> Roles { get; set; }
    }
}
