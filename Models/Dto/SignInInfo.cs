using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class SignInInfo
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool IsPersistant { get; set; }
    }
}
