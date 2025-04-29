using dotnetapp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Data;
using dotnetapp.Services;
namespace dotnetapp.Controllers
{
    
[ApiController]
[Route("api/auth")]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthenticationController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid) return BadRequest("Invalid request payload");

        var (status, result) = await _authService.Login(model);
        if (status == 0) return BadRequest(result);

        return Ok(new { Token = result });
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User model)
    {
        if (!ModelState.IsValid) return BadRequest("Invalid request payload");

        var (status, result) = await _authService.Registration(model, model.UserRole);
        if (status == 0) return BadRequest(result);

        return Ok(new { Message = result });
    }
}
}