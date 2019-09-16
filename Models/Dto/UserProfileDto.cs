using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{


    public class UserProfileDto
    {
        public UserProfileDto() {

        }
        public UserProfileDto(TRRUser user)
        {
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            SiteId = user.SiteId;
            Phone = user.PhoneNumber;
            Email = user.Email;
            DateOfBirth = user.DateOfBirth;
            Gender = user.Gender;
            StreetAddress = user.Address;
            City = user.City;
            State = user.State;
            Zip = user.Zip;
            Medical = user.Medical;
            InjuryDate = user.DateInjured;

            ReleaseSigned = user.ReleaseSigned;
            LiabilitySigned = user.LiabilitySigned;
            ActiveMember = user.Active;
            DeactiveCause = user.DeactiveCause;
            JoinDate = user.JoinDate;
            TravelTime = user.TravelTime;
            UserType = (int)user.OldType;
            Comments = user.Comments;
            Status = user.OldStatus;
            SponsoredById = user.SponsoredById;
            if (user.Site != null)
            {
                SiteName = user.Site.Name;
                StateName = user.Site.GroupName;
            }
        }

        public void Map(TRRUser user)
        {
            user.Id = Id;
            user.FirstName = FirstName;
            user.LastName = LastName;
            user.SiteId = SiteId;
            user.PhoneNumber = Phone;
            user.Email = Email;
            user.DateOfBirth = DateOfBirth;
            user.Gender = Gender;
            user.Address = StreetAddress;
            user.City = City;
            user.State = State;
            user.Zip = Zip;
            user.Medical = Medical;
            user.DateInjured = InjuryDate;

            user.ReleaseSigned = ReleaseSigned;
            user.LiabilitySigned = LiabilitySigned;
            user.Active = ActiveMember;
            user.DeactiveCause = DeactiveCause;
            user.JoinDate = JoinDate;
            user.TravelTime = TravelTime;
            user.OldType = (TRRUserType)UserType;
            user.Comments = Comments;
            user.OldStatus = Status;
            user.SponsoredById = SponsoredById;
        }

        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? SiteId { get; set; }
        public string SiteName { get; set; }
        public string StateName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public Char Gender { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public Medical Medical { get; set; }
        public DateTime? InjuryDate { get; set; }
        public IEnumerable<EventListRow> Events { get; set; }

        public bool ReleaseSigned { get; set; }
        public bool LiabilitySigned { get; set; }
        public bool ActiveMember { get; set; }
        public string DeactiveCause { get; set; }
        public DateTime? JoinDate { get; set; }
        public string TravelTime { get; set; }
        public string[] Roles { get; set; }
        public int UserType { get; set; }
        public string Comments { get; set; }
        public int Status { get; set; }
        public string SponsoredById { get; set; }
    }
}
