using Microsoft.EntityFrameworkCore.Migrations;

namespace Services.Migrations
{
    public partial class usersitelink : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CalendarEvents_CalendarEventTypes_EventTypeId",
                table: "CalendarEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_CalendarEvents_EventSites_SiteId",
                table: "CalendarEvents");

            migrationBuilder.AlterColumn<int>(
                name: "SiteId",
                table: "CalendarEvents",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "EventTypeId",
                table: "CalendarEvents",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SiteId",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_SiteId",
                table: "AspNetUsers",
                column: "SiteId");

            migrationBuilder.AddForeignKey(
                name: "FK_CalendarEvents_CalendarEventTypes_EventTypeId",
                table: "CalendarEvents",
                column: "EventTypeId",
                principalTable: "CalendarEventTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_CalendarEvents_EventSites_SiteId",
                table: "CalendarEvents",
                column: "SiteId",
                principalTable: "EventSites",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CalendarEvents_CalendarEventTypes_EventTypeId",
                table: "CalendarEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_CalendarEvents_EventSites_SiteId",
                table: "CalendarEvents");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_SiteId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SiteId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "SiteId",
                table: "CalendarEvents",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "EventTypeId",
                table: "CalendarEvents",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_CalendarEvents_CalendarEventTypes_EventTypeId",
                table: "CalendarEvents",
                column: "EventTypeId",
                principalTable: "CalendarEventTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CalendarEvents_EventSites_SiteId",
                table: "CalendarEvents",
                column: "SiteId",
                principalTable: "EventSites",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
