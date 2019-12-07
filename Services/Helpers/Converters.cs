using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Helpers
{
    public class Converters
    {
        public static string IntTimeToStr(int val)
        {
            string am = val < 1200 ? "AM" : "PM";
            string hours = (val < 1200 ? val / 100 : (val / 100) - 12).ToString().PadLeft(2, '0');
            if (hours == "00" && val >= 1200 && val<1300)
            {
                hours = "12";
                am = "PM";
            }
            string minutes = (val % 100).ToString().PadLeft(2, '0');
            return $"{hours}:{minutes} {am}";
        }
    }
}
