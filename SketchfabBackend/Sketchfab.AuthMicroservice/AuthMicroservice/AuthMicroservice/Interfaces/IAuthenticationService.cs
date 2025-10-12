namespace AuthMicroservice.Interfaces
{
    public interface IAuthenticationService
    {
        Task Registration(string login, string password, string nickname);
        Task<string> Login(string login, string password);
    }
}
