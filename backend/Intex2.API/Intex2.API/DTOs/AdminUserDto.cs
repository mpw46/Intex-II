namespace Intex2.API.DTOs;

public record AdminUserListItemDto(
    string Id,
    string? UserName,
    string? Email,
    IReadOnlyList<string> Roles,
    bool HasPassword);
