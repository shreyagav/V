using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Services.Migrations
{
    public partial class @event : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Updated",
                table: "CalendarEvents");

            migrationBuilder.AddColumn<string>(
                name: "CreatedById",
                table: "CalendarEvents",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Modified",
                table: "CalendarEvents",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ModifiedById",
                table: "CalendarEvents",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OldEventCount",
                table: "CalendarEvents",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OldEventMultiOrder",
                table: "CalendarEvents",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OldEventRepeat",
                table: "CalendarEvents",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "CalendarEvents",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEvents_CreatedById",
                table: "CalendarEvents",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEvents_ModifiedById",
                table: "CalendarEvents",
                column: "ModifiedById");

            migrationBuilder.AddForeignKey(
                name: "FK_CalendarEvents_AspNetUsers_CreatedById",
                table: "CalendarEvents",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CalendarEvents_AspNetUsers_ModifiedById",
                table: "CalendarEvents",
                column: "ModifiedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CalendarEvents_AspNetUsers_CreatedById",
                table: "CalendarEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_CalendarEvents_AspNetUsers_ModifiedById",
                table: "CalendarEvents");

            migrationBuilder.DropIndex(
                name: "IX_CalendarEvents_CreatedById",
                table: "CalendarEvents");

            migrationBuilder.DropIndex(
                name: "IX_CalendarEvents_ModifiedById",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "Modified",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "ModifiedById",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "OldEventCount",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "OldEventMultiOrder",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "OldEventRepeat",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "CalendarEvents");

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                table: "CalendarEvents",
                nullable: true);
        }
    }
}
