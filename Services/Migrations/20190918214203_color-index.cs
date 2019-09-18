using Microsoft.EntityFrameworkCore.Migrations;

namespace Services.Migrations
{
    public partial class colorindex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte>(
                name: "Order",
                table: "CalendarEventTypes",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEventTypes_Order",
                table: "CalendarEventTypes",
                column: "Order");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CalendarEventTypes_Order",
                table: "CalendarEventTypes");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "CalendarEventTypes");
        }
    }
}
