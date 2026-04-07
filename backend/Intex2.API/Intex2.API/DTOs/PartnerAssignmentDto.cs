namespace Intex2.API.DTOs;

public class PartnerAssignmentDto
{
    public int? AssignmentId { get; set; }
    public int? PartnerId { get; set; }
    public string? SafehouseId { get; set; }
    public string? ProgramArea { get; set; }
    public string? AssignmentStart { get; set; }
    public string? AssignmentEnd { get; set; }
    public string? ResponsibilityNotes { get; set; }
    public string? IsPrimary { get; set; }
    public string? Status { get; set; }
}

public class PartnerAssignmentCreateDto
{
    public int? PartnerId { get; set; }
    public string? SafehouseId { get; set; }
    public string? ProgramArea { get; set; }
    public string? AssignmentStart { get; set; }
    public string? AssignmentEnd { get; set; }
    public string? ResponsibilityNotes { get; set; }
    public string? IsPrimary { get; set; }
    public string? Status { get; set; }
}
