using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class Region
    {
        public Region()
        {
            EventSites = new HashSet<EventSite>();
        }

        public int RegionId { get; set; }
        public string RegionName { get; set; }
        public string ShortName { get; set; }
        public bool Deleted { get; set; }

        public virtual ICollection<EventSite> EventSites { get; set; }
    }
}
