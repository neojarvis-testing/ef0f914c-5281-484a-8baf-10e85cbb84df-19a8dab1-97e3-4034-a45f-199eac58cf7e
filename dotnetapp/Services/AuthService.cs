using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;

        public AuthService(IConfiguration configuration, ApplicationDbContext dbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
        }

        public async Task<(int, string)> Registration(User model, string role)
        {
            // Check if user already exists
            var existingUser = _dbContext.Users.FirstOrDefault(u => u.Email == model.Email);
            if (existingUser != null)
            {
                return (0, "User already exists");
            }

            // Save user details directly using DbContext
            model.UserRole = role; // Assign the role to the user
            _dbContext.Users.Add(model);
            await _dbContext.SaveChangesAsync();

            return (1, "User created successfully!");
        }

        public async Task<(int, string)> Login(LoginModel model)
        {
            // Validate user email
            var user = _dbContext.Users.FirstOrDefault(u => u.Email == model.Email);
            if (user == null)
            {
                return (0, "Invalid email");
            }

            // Validate password
            if (user.Password != model.Password)
            {
                return (0, "Invalid password");
            }

            // Generate token including roles in claims
            var token = GenerateToken(user, user.UserRole);
            return (1, token);
        }

        private string GenerateToken(User user, string role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), // Use UserId here
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role) // Include the user role in claims
            };

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
