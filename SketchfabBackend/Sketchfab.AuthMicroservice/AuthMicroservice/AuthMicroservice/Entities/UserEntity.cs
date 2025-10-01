using AuthMicroservice.Enums;
using System.Data;

namespace AuthMicroservice.Entities
{
    public class UserEntity
    {
        private UserEntity(Guid id, string email, string hashedPassword)
        {
            Id = id;
            Email = email;
            HashedPassword = hashedPassword;
            
        }

        public Guid Id { get; private set; }
        public string HashedPassword { get; set; }
        public string Email { get; private set; }
        public Role Role { get; set; }

       

        public static UserEntity Create(Guid id, string email, string hashedPassword)
        {
            return new UserEntity(id, email, hashedPassword);
        }
    }
}
