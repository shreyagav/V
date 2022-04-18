using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Models.Old
{
    public class UserOption
    {
        public int OptionId { get; set; }
        public Option Option { get; set; }
        public string UserId { get; set; }
        public TRRUser User { get; set; }
        public string Description { get; set; }
    }
}
