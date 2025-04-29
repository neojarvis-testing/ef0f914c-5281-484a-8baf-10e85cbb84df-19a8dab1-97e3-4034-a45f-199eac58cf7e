using dotnetapp.Models;
using dotnetapp.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using dotnetapp.Data;
using Microsoft.IdentityModel.Tokens;
 
 namespace dotnetapp.Services{

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> userManager;
    private readonly RoleManager<IdentityRole> roleManager;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, ApplicationDbContext context)
    {
        this.userManager = userManager;
        this.roleManager = roleManager;
        _configuration = configuration;
        _context = context;
    }

    public async Task<(int, string)> Registration(User model, string role)
    {
        var existingUser = await userManager.FindByEmailAsync(model.Email);
        if (existingUser != null)
        {
            return (0, "User already exists");
        }

        var user = new ApplicationUser 
        { 
            UserName = model.Email, 
            Email = model.Email, 
            Name = model.Username 
        };

        var result = await userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
        {
            return (0, "User creation failed! Please check user details and try again");
        }

        // Ensure role exists before assigning
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }

        await userManager.AddToRoleAsync(user, role);

        // Save user details in the database (Users table)
        _context.Users.Add(model);
        await _context.SaveChangesAsync();

        return (1, "User created successfully!");
    }

    public async Task<(int, string)> Login(LoginModel model)
    {
        var user = await userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return (0, "Invalid email");
        }

        var isPasswordCorrect = await userManager.CheckPasswordAsync(user, model.Password);
        if (!isPasswordCorrect)
        {
            return (0, "Invalid password");
        }

        // Get user roles and include them in JWT claims
        var userRoles = await userManager.GetRolesAsync(user);
        var token = GenerateToken(user, userRoles);

        return (1, token);
    }

    private string GenerateToken(ApplicationUser user, IEnumerable<string> roles)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email)
        };

        // Add user roles to claims
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = creds,
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}

}