using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models
{
    public class TRRUser : IdentityUser
    {
        public int OldId { get; set; }
        public string OldPassword { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AltPhone { get; set; }
        public string Address { get; set; }
        [Column(TypeName = "Date")]
        public DateTime? DateOfBirth { get; set; }
        public int OldSiteId { get; set; }
        public int OldType { get; set; }
        public char Gender { get; set; }
        public string TravelTime { get; set; }
        [Column(TypeName = "Date")]
        public DateTime? JoinDate { get; set; }
        public int SponsoredBy { get; set; }
        public int OldAuthLevel { get; set; }
        public bool Active { get; set; }
        public string DeactiveCause { get; set; }
        public int BranchId { get; set; }
        public int OldStatus { get; set; }
        public int Medical { get; set; }
        [Column(TypeName = "Date")]
        public DateTime? DateInjured { get; set; }
        public bool ReleaseSigned { get; set; }
        public bool LiabilitySigned { get; set; }
        public string Comments { get; set; }
    }
}
