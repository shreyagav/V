﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    public class EventSite
    {
        public int Id { get; set; }
        public String Name { get; set; }
        public int GroupId { get; set; }
        public String GroupName { get; set; }
        public String Description { get; set; }
        public Contact Main { get; set; }
        public Contact GOVT { get; set; }
        public Contact Coordinator { get; set; }
        public Contact National { get; set; }
        public Contact Outreach { get; set; }
        [Column(TypeName = "Date")]
        public DateTime? Originated { get; set; }
        public string SecurityClearance { get; set; }
        public bool PoolRental { get; set; }

        public int TypeId { get; set; }
        public int StaffTypeId { get; set; }
        public int SiteGroupId { get; set; }
        public int SiteStatusId { get; set; }
        public int OldId { get; set; }
    }
}