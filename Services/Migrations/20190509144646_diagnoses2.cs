using Microsoft.EntityFrameworkCore.Migrations;

namespace Services.Migrations
{
    public partial class diagnoses2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OldId",
                table: "Diagnoses",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OldId",
                table: "Diagnoses");
        }
    }
}
