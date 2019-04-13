using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class SignInResponse
    {
        public string Error { get; set; }
        public string UserName { get; set; }
        public string UserRole { get; set; }
    }
}
