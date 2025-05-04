using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Serilog; // ✅ Import Serilog
using dotnetapp.Services;
using dotnetapp.Models;
using dotnetapp.Data;

var builder = WebApplication.CreateBuilder(args);

// ✅ **Configure Serilog**
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console() // Logs to Console
    .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day) // Logs to File (daily rotation)
    .CreateLogger();

builder.Host.UseSerilog(); // Use Serilog globally

// ✅ **Configuration Setup**
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

// ✅ **Add controllers**
builder.Services.AddControllers();

// ✅ **Register services**
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<InternshipService>();
builder.Services.AddScoped<InternshipApplicationService>();
builder.Services.AddScoped<FeedbackService>();

// ✅ **Configure database connection with retry handling**
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("myconnString"),
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure()
    ));

// ✅ **Configure Identity**
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// ✅ **Ensure roles exist during application startup**
async Task SeedRoles(IServiceProvider serviceProvider)
{
    using (var scope = serviceProvider.CreateScope())
    {
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        string[] roleNames = { "Admin", "User" };

        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }
    }
}

var serviceProvider = builder.Services.BuildServiceProvider();
await SeedRoles(serviceProvider);

// ✅ **Configure CORS**
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ✅ **Configure Authentication & JWT**
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,  
            ValidateAudience = true,  
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],  
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// ✅ **Add Swagger support**
builder.Services.AddEndpointsApiExplorer(); // ✅ Fixes Swagger dependency issue
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ **Configure middleware pipeline**
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors();
app.MapControllers();

// ✅ **Enable Serilog request logging**
app.UseSerilogRequestLogging();

app.Run();