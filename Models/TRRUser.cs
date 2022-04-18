using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models.Old
{

    public class TRRUser : IdentityUser
    {
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
        [Column(TypeName = "Date")]
        public DateTime? DateOfBirth { get; set; }
        public int OldSiteId { get; set; }
        public TRRUserType OldType { get; set; }
        public char Gender { get; set; }
        public string TravelTime { get; set; }
        [Column(TypeName = "Date")]
        public DateTime? JoinDate { get; set; }
        public int OldSponsoredById { get; set; }
        public TRRUser SponsoredBy { get; set; }
        public string SponsoredById { get; set; }
        public int OldAuthLevel { get; set; }
        public bool Active { get; set; }
        public string DeactiveCause { get; set; }
        public int BranchId { get; set; }
        public int OldStatus { get; set; }
        public Medical Medical { get; set; }
        [Column(TypeName = "Date")]
        public DateTime? DateInjured { get; set; }
        public bool ReleaseSigned { get; set; }
        public bool LiabilitySigned { get; set; }
        public string Comments { get; set; }
        public int? SiteId { get; set; }
        public EventSite Site { get; set; }
        public virtual ICollection<UserEvent> Events { get; set; }
        public virtual ICollection<UserOption> Options { get; set; }
        public virtual ICollection<UserDiagnosis> Diagnoses { get; set; }
        [Column(TypeName = "Date")]
        public DateTime Created { get; set; }
        public bool Deleted { get; set; }
        public Contact EmergencyContact { get; set; }
        public int? EmergencyContactId { get; set; }
        public bool TRRBackgroundCheck { get; set; }
        public bool OtherBackgroundCheck { get; set; }
        public bool CodeOfConductTraining { get; set; }
        public string OtherBackgroundCheckComment { get; set; }
        public ICollection<NotificationRecepient> NotificationRecepients { get; set; } 
    }
}
