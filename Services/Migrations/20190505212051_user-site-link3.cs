using Microsoft.EntityFrameworkCore.Migrations;

namespace Services.Migrations
{
    public partial class usersitelink3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_SiteId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "SiteId",
                table: "AspNetUsers",
                nullable: true,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "SiteId",
                table: "AspNetUsers",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_SiteId",
                table: "AspNetUsers",
                column: "SiteId");
        }
    }
}
