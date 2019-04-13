using Microsoft.EntityFrameworkCore.Migrations;

namespace Services.Migrations
{
    public partial class event2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OldEventVisibility",
                table: "CalendarEvents",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OldEventVisibility",
                table: "CalendarEvents");
        }
    }
}
