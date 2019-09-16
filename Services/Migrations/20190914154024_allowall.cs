using Microsoft.EntityFrameworkCore.Migrations;

namespace Services.Migrations
{
    public partial class allowall : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AllowEverybody",
                table: "EventSites",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowEverybody",
                table: "EventSites");
        }
    }
}
