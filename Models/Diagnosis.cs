using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class Diagnosis
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int OldId { get; set; }
        public virtual ICollection<UserDiagnosis> Users { get; set; }
    }
}
