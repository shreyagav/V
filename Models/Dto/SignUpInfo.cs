using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class SignUpInfo
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordRepeat { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Zip { get; set; }
    }
}
