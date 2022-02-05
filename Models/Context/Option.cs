using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class Option
    {
        public Option()
        {
            UserOptions = new HashSet<UserOption>();
        }

        public int Id { get; set; }
        public int OptionCategoryId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int OldId { get; set; }

        public virtual OptionCategory OptionCategory { get; set; }
        public virtual ICollection<UserOption> UserOptions { get; set; }
    }
}
