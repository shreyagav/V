using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Models.Old
{
    public class Option
    {
        public int Id { get; set; }
        public int OptionCategoryId { get; set; }
        public OptionCategory Category { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int OldId { get; set; }
        public virtual ICollection<UserOption> UserOptions { get; set; }
    }
}
