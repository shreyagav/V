using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class UserOption
    {
        public int OptionId { get; set; }
        public string UserId { get; set; }
        public string Description { get; set; }

        public virtual Option Option { get; set; }
        public virtual AspNetUser User { get; set; }
    }
}
