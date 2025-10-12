using System.ComponentModel.DataAnnotations;

namespace AuthMicroservice.Dtos
{
    public record RegistrationDto
   ([Required(ErrorMessage = "Login is required")]
    [MinLength(4, ErrorMessage = "Login must be at least 4 characters long")]
    string login,


    [Required(ErrorMessage = "Password is required")]
    [MinLength(5, ErrorMessage = "Password must be at least 5 characters long")]
    [RegularExpression(@"^(?=.*[!@#$%^&*]).+$",
        ErrorMessage = "Password must contain a special character (!@#$%^&*)")]
    string password,

    [Required(ErrorMessage = "Nickname is required")]
    [MinLength(5, ErrorMessage = "Nickname must be at least 5 characters long")]
    string nickname);

}
