using AuthMicroservice.Entities;
using AuthMicroservice.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthMicroservice.Services
{
    public class TokenProvider : ITokenProvider
    {
        private readonly IConfiguration _configuration;

        public TokenProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(UserEntity user)
        {
            var jwtOptions = _configuration.GetSection("JwtOptions");
            string secretKey = jwtOptions["Key"]!;
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new ArgumentException("Secret key is missing");
            }
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            ]),

                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtOptions["TokenValidityMins"])),
                SigningCredentials = credentials,
                Issuer = jwtOptions["Issuer"],
                Audience = jwtOptions["Audience"],

            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
