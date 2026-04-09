using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class AdminUsersController(UserManager<DonorUser> userManager) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminUserListItemDto>>> GetUsers(CancellationToken cancellationToken)
    {
        var users = await userManager.Users
            .OrderBy(u => u.Email)
            .ThenBy(u => u.UserName)
            .ToListAsync(cancellationToken);

        var items = new List<AdminUserListItemDto>(users.Count);
        foreach (var u in users)
        {
            var roles = await userManager.GetRolesAsync(u);
            var hasPassword = await userManager.HasPasswordAsync(u);
            items.Add(new AdminUserListItemDto(
                u.Id,
                u.UserName,
                u.Email,
                roles.OrderBy(r => r).ToList(),
                hasPassword));
        }

        return Ok(items);
    }

    public record UpdateAdminUserRoleBody(string Role);

    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(string id, [FromBody] UpdateAdminUserRoleBody body)
    {
        if (body.Role != AuthRoles.Admin && body.Role != AuthRoles.Donor)
            return BadRequest(new { detail = "Role must be Admin or Donor." });

        var user = await userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound();

        var currentRoles = await userManager.GetRolesAsync(user);
        if (currentRoles.Contains(AuthRoles.Admin) && body.Role == AuthRoles.Donor)
        {
            var admins = await userManager.GetUsersInRoleAsync(AuthRoles.Admin);
            if (admins.Count == 1 && admins[0].Id == id)
                return BadRequest(new { detail = "Cannot remove the last admin account." });
        }

        var removeResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded)
            return BadRequest(new { detail = string.Join("; ", removeResult.Errors.Select(e => e.Description)) });

        var addResult = await userManager.AddToRoleAsync(user, body.Role);
        if (!addResult.Succeeded)
            return BadRequest(new { detail = string.Join("; ", addResult.Errors.Select(e => e.Description)) });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (id == currentUserId)
            return BadRequest(new { detail = "You cannot delete your own account." });

        var user = await userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound();

        var roles = await userManager.GetRolesAsync(user);
        if (roles.Contains(AuthRoles.Admin))
        {
            var admins = await userManager.GetUsersInRoleAsync(AuthRoles.Admin);
            if (admins.Count == 1)
                return BadRequest(new { detail = "Cannot delete the last admin account." });
        }

        var result = await userManager.DeleteAsync(user);
        if (!result.Succeeded)
            return BadRequest(new { detail = string.Join("; ", result.Errors.Select(e => e.Description)) });

        return NoContent();
    }
}
