using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class UserDiagnosis
    {
        public int DiagnosisId { get; set; }
        public string UserId { get; set; }
        public string Note { get; set; }

        public virtual Diagnosis Diagnosis { get; set; }
        public virtual AspNetUser User { get; set; }
    }
}
