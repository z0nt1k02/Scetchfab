using AuthMicroservice.Dtos;
using AuthMicroservice.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Authentication;

namespace AuthMicroservice.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost]
        public async Task<IActionResult> Registration(RegistrationDto registrationDto)
        {
            try
            {
                await _authenticationService.Registration(registrationDto.login, registrationDto.password,registrationDto.nickname);
                
                return Ok("Registration successful");
            }
            catch (AuthenticationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            HttpContext context = HttpContext;
            try
            {
                var token = await _authenticationService.Login(loginDto.login, loginDto.password);
                context.Response.Cookies.Append("token", token);
                return Ok("Login successful");
            }
            catch (AuthenticationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
