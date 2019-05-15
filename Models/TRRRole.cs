using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class TRRRole : IdentityRole
    {
        public string Description { get; set; }
    }
}
