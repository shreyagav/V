using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Dto
{
    public class EventListRow
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Chapter { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public string Type { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public EventStatus Status { get; set; }
        public string Color { get; set; }
    }
}
