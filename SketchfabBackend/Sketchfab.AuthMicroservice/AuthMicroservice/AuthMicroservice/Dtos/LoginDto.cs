using System.ComponentModel.DataAnnotations;

namespace AuthMicroservice.Dtos
{
    public record LoginDto(
        [Required(ErrorMessage = "Логин обязателен")]
    string email,

    [Required(ErrorMessage = "Пароль обязателен")]
    [MinLength(6,ErrorMessage ="Минимальная длина пароля 6 символов")]
    string password);
    
}
