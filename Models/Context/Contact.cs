using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class Contact
    {
        public Contact()
        {
            AspNetUsers = new HashSet<AspNetUser>();
            EventSiteCoordinators = new HashSet<EventSite>();
            EventSiteGovts = new HashSet<EventSite>();
            EventSiteMains = new HashSet<EventSite>();
            EventSiteNationals = new HashSet<EventSite>();
            EventSiteOutreaches = new HashSet<EventSite>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public virtual ICollection<AspNetUser> AspNetUsers { get; set; }
        public virtual ICollection<EventSite> EventSiteCoordinators { get; set; }
        public virtual ICollection<EventSite> EventSiteGovts { get; set; }
        public virtual ICollection<EventSite> EventSiteMains { get; set; }
        public virtual ICollection<EventSite> EventSiteNationals { get; set; }
        public virtual ICollection<EventSite> EventSiteOutreaches { get; set; }
    }
}
