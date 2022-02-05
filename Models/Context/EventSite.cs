using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class EventSite
    {
        public EventSite()
        {
            AspNetUsers = new HashSet<AspNetUser>();
            CalendarEvents = new HashSet<CalendarEvent>();
            Notifications = new HashSet<Notification>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }
        public int? MainId { get; set; }
        public int? Govtid { get; set; }
        public int? CoordinatorId { get; set; }
        public int? NationalId { get; set; }
        public int? OutreachId { get; set; }
        public DateTime? Originated { get; set; }
        public string SecurityClearance { get; set; }
        public bool PoolRental { get; set; }
        public int TypeId { get; set; }
        public int StaffTypeId { get; set; }
        public int SiteGroupId { get; set; }
        public int SiteStatusId { get; set; }
        public int OldId { get; set; }
        public bool AllowEverybody { get; set; }
        public bool Deleted { get; set; }
        public int? RegionId { get; set; }

        public virtual Contact Coordinator { get; set; }
        public virtual Contact Govt { get; set; }
        public virtual Contact Main { get; set; }
        public virtual Contact National { get; set; }
        public virtual Contact Outreach { get; set; }
        public virtual Region Region { get; set; }
        public virtual ICollection<AspNetUser> AspNetUsers { get; set; }
        public virtual ICollection<CalendarEvent> CalendarEvents { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
