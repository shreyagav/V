using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class Diagnosis
    {
        public Diagnosis()
        {
            UserDiagnoses = new HashSet<UserDiagnosis>();
        }

        public int Id { get; set; }
        public string Description { get; set; }
        public int OldId { get; set; }

        public virtual ICollection<UserDiagnosis> UserDiagnoses { get; set; }
    }
}
