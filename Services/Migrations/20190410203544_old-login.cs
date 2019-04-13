using Microsoft.EntityFrameworkCore.Migrations;

namespace Services.Migrations
{
    public partial class oldlogin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OldLogin",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OldLogin",
                table: "AspNetUsers");
        }
    }
}
