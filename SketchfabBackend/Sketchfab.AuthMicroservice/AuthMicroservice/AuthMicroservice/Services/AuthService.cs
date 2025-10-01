using AuthMicroservice.Database;
using AuthMicroservice.Entities;
using AuthMicroservice.Enums;
using AuthMicroservice.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Authentication;

namespace AuthMicroservice.Services
{
    public class AuthService : IAuthService
    {
        private readonly AuthDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ITokenProvider _tokenProvider;

        public AuthService(AuthDbContext context, IPasswordHasher passwordHasher, ITokenProvider tokenProvider)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _tokenProvider = tokenProvider;
        }
        public async Task Registration(string email, string password)
        {
            bool loginIsUnique = await FindEmail(email);
            if (loginIsUnique)
            {
                throw new Exception("Данный email уже зарегистрирован");
            }
            var users = await _context.Users.CountAsync();
            var hashedPassword = _passwordHasher.GenerateHash(password);
            UserEntity newUser = UserEntity.Create(Guid.NewGuid(), email, hashedPassword);
            if (users == 0)
                newUser.Role = Role.Admin;
            else
                newUser.Role = Role.User;

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();
        }

        public async Task<string> Login(string email, string password)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Email == email);
            if (user == null)
                throw new AuthenticationException("Invalid login or password");
            var result = _passwordHasher.VerifyHash(password, user.HashedPassword);
            if (!result)
                throw new AuthenticationException("Invalid login or password");
            var token = _tokenProvider.GenerateToken(user);
            return token;

        }

        public async Task<bool> FindEmail(string email)
        {
            bool findLogin = await _context.Users.AnyAsync(x => x.Email == email);
            return findLogin;
        }
    }
}
