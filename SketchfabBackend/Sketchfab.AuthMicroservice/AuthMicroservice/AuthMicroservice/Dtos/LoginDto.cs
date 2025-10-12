using System.ComponentModel.DataAnnotations;

namespace AuthMicroservice.Dtos
{
    public record LoginDto([Required(ErrorMessage = "Login is required")]
    string login,

    [Required(ErrorMessage = "Password is required")]
    string password);
    
}
