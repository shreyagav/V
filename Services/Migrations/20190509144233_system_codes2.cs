using Microsoft.EntityFrameworkCore.Migrations;

namespace Services.Migrations
{
    public partial class system_codes2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OldId",
                table: "SystemCodes",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OldId",
                table: "SystemCodes");
        }
    }
}
