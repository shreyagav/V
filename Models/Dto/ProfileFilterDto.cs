using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class ProfileFilterDto
    {
        public string Name { get; set; }
        public TRRUserType? Role { get; set; }
        public int[] Chapters { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string Zip { get; set; }
        public bool Active { get; set; }
    }
}
