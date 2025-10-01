using AuthMicroservice.Entities;

namespace AuthMicroservice.Interfaces
{
    public interface ITokenProvider
    {
        string GenerateToken(UserEntity user);
    }
}
