using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class DuplicateCheckerDto
    {
        public string LastName { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
