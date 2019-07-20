using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Models
{
    public class OptionCategory
    {
        public int Id { get; set; }
        public int OldId { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Option> Options { get; set; }
    }
}
