using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class SignInResponse
    {
        public string Error { get; set; }
        public string UserName { get; set; }
        public IList<string> UserRoles { get; set; }
        public string UserType { get; set; }
        public string AuthType { get; set; }
    }
}
