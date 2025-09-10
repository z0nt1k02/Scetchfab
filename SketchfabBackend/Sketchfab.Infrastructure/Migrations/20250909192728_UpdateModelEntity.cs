using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sketchfab.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModelEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Models",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "ModelPath",
                table: "Models",
                newName: "ModelName");

            migrationBuilder.RenameColumn(
                name: "ModelImagePath",
                table: "Models",
                newName: "ImageName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Models",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "ModelName",
                table: "Models",
                newName: "ModelPath");

            migrationBuilder.RenameColumn(
                name: "ImageName",
                table: "Models",
                newName: "ModelImagePath");
        }
    }
}
