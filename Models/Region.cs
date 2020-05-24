using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class Region
    {
        public int RegionId { get; set; }
        public string RegionName { get; set; }
        public string ShortName { get; set; }
        public bool Deleted { get; set; }
        public virtual ICollection<EventSite> EventSites { get; set; }
    }
}
