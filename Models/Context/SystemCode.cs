using System;
using System.Collections.Generic;

namespace Models.Context
{
    public partial class SystemCode
    {
        public int Id { get; set; }
        public string CodeType { get; set; }
        public string Description { get; set; }
        public int OldId { get; set; }
    }
}
