using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class OptionCategoryDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public OptionDto[] Options { get; set; }
    }

    public class OptionDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class UserOptionDto
    {
        public int CategoryId { get; set; }
        public int OptionId { get; set; }
        public string Description { get; set; }
    }
}
