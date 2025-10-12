using AuthMicroservice.Enums;
using System.Data;

namespace AuthMicroservice.Entities
{
    public class UserEntity
    {
        private UserEntity(Guid id, string email, string hashedPassword, string nickname)
        {
            Id = id;
            Email = email;
            HashedPassword = hashedPassword;
            Nickname = nickname;
        }

        public Guid Id { get; private set; }
        public string HashedPassword { get; set; }
        public string Email { get; private set; }
        public string Nickname { get; set; }
        public Role Role { get; set; }

       

        public static UserEntity Create(Guid id, string email, string hashedPassword,string nickname)
        {
            return new UserEntity(id, email, hashedPassword,nickname);
        }
    }
}
