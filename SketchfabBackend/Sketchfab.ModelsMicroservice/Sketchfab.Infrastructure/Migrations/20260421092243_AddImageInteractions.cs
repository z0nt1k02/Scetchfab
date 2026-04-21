using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sketchfab.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddImageInteractions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ImageComments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Nickname = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageComments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ImageLikes",
                columns: table => new
                {
                    ImageId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageLikes", x => new { x.ImageId, x.UserId });
                });

            migrationBuilder.CreateIndex(
                name: "IX_ImageComments_ImageId",
                table: "ImageComments",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_ImageLikes_ImageId",
                table: "ImageLikes",
                column: "ImageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ImageComments");

            migrationBuilder.DropTable(
                name: "ImageLikes");
        }
    }
}
