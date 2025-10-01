namespace AuthMicroservice.Interfaces
{
    public interface IAuthService
    {
        Task Registration(string login, string password);
        Task<string> Login(string login, string password);
    }
}
