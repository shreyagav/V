using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Models
{
    public class SystemCode
    {
        public int Id { get; set; }
        [MaxLength(2)]
        public string CodeType { get; set; }
        [MaxLength(50)]
        public string Description { get; set; }
        public int OldId { get; set; }
    }
}
