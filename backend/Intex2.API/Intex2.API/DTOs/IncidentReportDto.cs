namespace Intex2.API.DTOs;

public class IncidentReportDto
{
    public int? IncidentId { get; set; }
    public int? ResidentId { get; set; }
    public int? SafehouseId { get; set; }
    public string? IncidentDate { get; set; }
    public string? IncidentType { get; set; }
    public string? Severity { get; set; }
    public string? Description { get; set; }
    public string? ResponseTaken { get; set; }
    public string? Resolved { get; set; }
    public string? ResolutionDate { get; set; }
    public string? ReportedBy { get; set; }
    public string? FollowUpRequired { get; set; }
}

public class IncidentReportCreateDto
{
    public int? ResidentId { get; set; }
    public int? SafehouseId { get; set; }
    public string? IncidentDate { get; set; }
    public string? IncidentType { get; set; }
    public string? Severity { get; set; }
    public string? Description { get; set; }
    public string? ResponseTaken { get; set; }
    public string? Resolved { get; set; }
    public string? ResolutionDate { get; set; }
    public string? ReportedBy { get; set; }
    public string? FollowUpRequired { get; set; }
}
