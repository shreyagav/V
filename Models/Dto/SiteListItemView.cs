using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public enum SiteListItemType {Group,Site }
    public class SiteItem
    {
        public string Name { get; set; }
        public bool Checked => false;
        public int Id { get; set; }
        public SiteListItemType Type { get; set; }
    }

    public class SiteListItemView
    {
        public SiteItem State { get; set; }
        public SiteItem[] Chapters { get; set; }
    }
}
