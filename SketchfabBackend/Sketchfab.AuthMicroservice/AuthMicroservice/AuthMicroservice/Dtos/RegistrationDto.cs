using System.ComponentModel.DataAnnotations;

namespace AuthMicroservice.Dtos
{
    public record RegistrationDto
   ([Required(ErrorMessage = "Почта обязателен")]
    [StringLength(50,MinimumLength =4,ErrorMessage ="Длина строки от 3 до 50 символов")]
    [EmailAddress]
    string email,


    [Required(ErrorMessage = "Пароль обязателен")]
    [StringLength(50,MinimumLength =4,ErrorMessage ="Длина строки от 3 до 50 символов")]
    [RegularExpression(@"^(?=.*[!@#$%^&*]).+$",
        ErrorMessage = "Пароль должен содеражать минимум 1 спец.символ (!@#$%^&*)")]
    string password,

    [Required(ErrorMessage = "Никнейм обязателен")]
    [StringLength(50,MinimumLength =4,ErrorMessage ="Длина строки от 3 до 50 символов")]
    string nickname);

}
