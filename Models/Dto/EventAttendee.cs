using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class EventAttendeeDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int MemberTypeId { get; set; }
        public bool Active { get; set; }
        public bool Attended { get; set; }
    }
}
