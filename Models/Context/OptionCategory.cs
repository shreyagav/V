using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class OptionCategory
    {
        public OptionCategory()
        {
            Options = new HashSet<Option>();
        }

        public int Id { get; set; }
        public int OldId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Option> Options { get; set; }
    }
}
