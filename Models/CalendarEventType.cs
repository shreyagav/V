namespace Models
{
    public class CalendarEventType
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int OldId { get; set; }
        public string Color { get; set; }
        public byte Order { get; set; }
    }
}
