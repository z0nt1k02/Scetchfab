using AuthMicroservice.Interfaces;


namespace AuthMicroservice.Services
{
    public class PasswordHasher : IPasswordHasher
    {
        public string GenerateHash(string password)
        {
            return BCrypt.Net.BCrypt.EnhancedHashPassword(password);
        }

        public bool VerifyHash(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.EnhancedVerify(password, hashedPassword);
        }
    }
}
