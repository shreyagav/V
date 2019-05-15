using Microsoft.EntityFrameworkCore.Migrations;

namespace Services.Migrations
{
    public partial class usersitelink4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_SiteId",
                table: "AspNetUsers",
                column: "SiteId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_EventSites_SiteId",
                table: "AspNetUsers",
                column: "SiteId",
                principalTable: "EventSites",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_EventSites_SiteId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_SiteId",
                table: "AspNetUsers");
        }
    }
}
