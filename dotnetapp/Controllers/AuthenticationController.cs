using dotnetapp.Models;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Services;
using System.Threading.Tasks;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            if (!ModelState.IsValid) 
                return BadRequest("Invalid request payload");

            var (status, result) = await _authService.Registration(model, model.UserRole);
            if (status == 0) 
                return BadRequest(result);

            return Ok(new { Message = result });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid) 
                return BadRequest("Invalid request payload");

            var (status, result) = await _authService.Login(model);
            if (status == 0) 
                return BadRequest(result);

            return Ok(new { Token = result });
        }
    }
}
