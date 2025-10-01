namespace AuthMicroservice.Interfaces
{
    public interface IPasswordHasher
    {
        string GenerateHash(string password);
        bool VerifyHash(string password, string hashedPassword);
    }
}
