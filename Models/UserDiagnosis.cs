using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    public class UserDiagnosis
    {
        public int DiagnosisId { get; set; }
        public Diagnosis Diagnosis { get; set; }
        public TRRUser User { get; set; }
        public string UserId { get; set; }
        public string Note { get; set; }
    }
}
