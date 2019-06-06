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
            OldType = user.OldType;
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
        public TRRUserType OldType { get; set; }
        public Medical Medical { get; set; }
        public DateTime? InjuryDate { get; set; }
        public IEnumerable<EventListRow> Events { get; set; }

    }
}
