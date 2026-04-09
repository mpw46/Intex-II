using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;

namespace Intex2.API.Controllers;

public record RegisterRequest(string Email, string Password);

[ApiController]
[Route("api/auth")]
public class AuthController(
    UserManager<DonorUser> userManager,
    SignInManager<DonorUser> signInManager,
    IConfiguration configuration,
    Intex2104Context db) : ControllerBase
{
    private const string DefaultFrontendUrl = "http://localhost:5173";
    private const string DefaultExternalReturnPath = "/impact";

    [HttpGet("providers")]
    public IActionResult GetExternalProviders()
    {
        var providers = new List<object>();

        if (IsGoogleConfigured())
        {
            providers.Add(new
            {
                name = GoogleDefaults.AuthenticationScheme,
                displayName = "Google"
            });
        }

        return Ok(providers);
    }

    [HttpGet("external-login")]
    public IActionResult ExternalLogin(
        [FromQuery] string provider,
        [FromQuery] string? returnPath = null)
    {
        if (!string.Equals(provider, GoogleDefaults.AuthenticationScheme, StringComparison.OrdinalIgnoreCase) ||
            !IsGoogleConfigured())
        {
            return BadRequest(new { message = "The requested external login provider is not available." });
        }

        var callbackUrl = Url.Action(nameof(ExternalLoginCallback), new
        {
            returnPath = NormalizeReturnPath(returnPath)
        });

        if (string.IsNullOrWhiteSpace(callbackUrl))
        {
            return Problem("Unable to create the external login callback URL.");
        }

        var properties = signInManager.ConfigureExternalAuthenticationProperties(
            GoogleDefaults.AuthenticationScheme,
            callbackUrl);

        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("external-callback")]
    public async Task<IActionResult> ExternalLoginCallback(
        [FromQuery] string? returnPath = null,
        [FromQuery] string? remoteError = null)
    {
        if (!string.IsNullOrWhiteSpace(remoteError))
        {
            return Redirect(BuildFrontendErrorUrl("External login failed."));
        }

        var info = await signInManager.GetExternalLoginInfoAsync();

        if (info is null)
        {
            return Redirect(BuildFrontendErrorUrl("External login information was unavailable."));
        }

        var signInResult = await signInManager.ExternalLoginSignInAsync(
            info.LoginProvider,
            info.ProviderKey,
            isPersistent: false,
            bypassTwoFactor: true);

        if (signInResult.Succeeded)
        {
            return Redirect(BuildFrontendSuccessUrl(returnPath));
        }

        var email = info.Principal.FindFirstValue(ClaimTypes.Email) ??
            info.Principal.FindFirstValue("email");

        if (string.IsNullOrWhiteSpace(email))
        {
            return Redirect(BuildFrontendErrorUrl("The external provider did not return an email address."));
        }

        var user = await userManager.FindByEmailAsync(email);

        if (user is null)
        {
            user = new DonorUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };

            var createUserResult = await userManager.CreateAsync(user);

            if (!createUserResult.Succeeded)
            {
                return Redirect(BuildFrontendErrorUrl("Unable to create a local account for the external login."));
            }

            await userManager.AddToRoleAsync(user, AuthRoles.Donor);
        }

        var addLoginResult = await userManager.AddLoginAsync(user, info);

        if (!addLoginResult.Succeeded && !addLoginResult.Errors.All(e => e.Code == "LoginAlreadyAssociated"))
        {
            return Redirect(BuildFrontendErrorUrl("Unable to associate the external login with the local account."));
        }

        await signInManager.SignInAsync(user, isPersistent: false, info.LoginProvider);
        return Redirect(BuildFrontendSuccessUrl(returnPath));
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = new DonorUser
        {
            UserName = request.Email,
            Email = request.Email,
            EmailConfirmed = true,
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var detail = string.Join("; ", result.Errors.Select(e => e.Description));
            return BadRequest(new { detail });
        }

        await userManager.AddToRoleAsync(user, AuthRoles.Donor);
        return Ok();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentSession()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            return Ok(new
            {
                isAuthenticated = false,
                userId = (string?)null,
                userName = (string?)null,
                email = (string?)null,
                roles = Array.Empty<string>()
            });
        }

        var user = await userManager.GetUserAsync(User);
        var roles = User.Claims
            .Where(claim => claim.Type == ClaimTypes.Role)
            .Select(claim => claim.Value)
            .Distinct()
            .OrderBy(role => role)
            .ToArray();

        return Ok(new
        {
            isAuthenticated = true,
            userId = user?.Id,
            userName = user?.UserName ?? User.Identity?.Name,
            email = user?.Email,
            roles
        });
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var email = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(email))
            return Unauthorized();

        var supporter = await db.Supporters
            .FirstOrDefaultAsync(s => s.Email == email);

        if (supporter is null)
        {
            return Ok(new DonorProfileDto { Email = email });
        }

        return Ok(new DonorProfileDto
        {
            Email = supporter.Email,
            FirstName = supporter.FirstName,
            LastName = supporter.LastName,
            DisplayName = supporter.DisplayName,
            OrganizationName = supporter.OrganizationName,
            SupporterType = supporter.SupporterType,
            RelationshipType = supporter.RelationshipType,
            Phone = supporter.Phone,
            Country = supporter.Country,
            Region = supporter.Region,
        });
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] DonorProfileDto dto)
    {
        var email = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(email))
            return Unauthorized();

        var supporter = await db.Supporters
            .FirstOrDefaultAsync(s => s.Email == email);

        if (supporter is null)
        {
            supporter = new Supporter
            {
                Email = email,
                CreatedAt = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                Status = "Active",
            };
            db.Supporters.Add(supporter);
        }

        supporter.FirstName = dto.FirstName;
        supporter.LastName = dto.LastName;
        supporter.DisplayName = dto.DisplayName;
        supporter.OrganizationName = dto.OrganizationName;
        supporter.SupporterType = dto.SupporterType ?? supporter.SupporterType ?? "MonetaryDonor";
        supporter.RelationshipType = dto.RelationshipType;
        supporter.Phone = dto.Phone;
        supporter.Country = dto.Country;
        supporter.Region = dto.Region;

        await db.SaveChangesAsync();

        return Ok(new DonorProfileDto
        {
            Email = supporter.Email,
            FirstName = supporter.FirstName,
            LastName = supporter.LastName,
            DisplayName = supporter.DisplayName,
            OrganizationName = supporter.OrganizationName,
            SupporterType = supporter.SupporterType,
            RelationshipType = supporter.RelationshipType,
            Phone = supporter.Phone,
            Country = supporter.Country,
            Region = supporter.Region,
        });
    }

    private bool IsGoogleConfigured()
    {
        return !string.IsNullOrWhiteSpace(configuration["Authentication:Google:ClientId"]) &&
            !string.IsNullOrWhiteSpace(configuration["Authentication:Google:ClientSecret"]);
    }

    private static string NormalizeReturnPath(string? returnPath)
    {
        if (string.IsNullOrWhiteSpace(returnPath) || !returnPath.StartsWith('/'))
        {
            return DefaultExternalReturnPath;
        }

        return returnPath;
    }

    private string BuildFrontendSuccessUrl(string? returnPath)
    {
        var frontendUrl = configuration["FrontendUrl"] ?? DefaultFrontendUrl;
        return $"{frontendUrl.TrimEnd('/')}{NormalizeReturnPath(returnPath)}";
    }

    private string BuildFrontendErrorUrl(string errorMessage)
    {
        var frontendUrl = configuration["FrontendUrl"] ?? DefaultFrontendUrl;
        var loginUrl = $"{frontendUrl.TrimEnd('/')}/login";
        return QueryHelpers.AddQueryString(loginUrl, "externalError", errorMessage);
    }
}