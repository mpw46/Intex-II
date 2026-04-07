namespace Intex2.API.DTOs;

public class InterventionPlanDto
{
    public int? PlanId { get; set; }
    public int? ResidentId { get; set; }
    public string? PlanCategory { get; set; }
    public string? PlanDescription { get; set; }
    public string? ServicesProvided { get; set; }
    public double? TargetValue { get; set; }
    public string? TargetDate { get; set; }
    public string? Status { get; set; }
    public string? CaseConferenceDate { get; set; }
    public string? CreatedAt { get; set; }
    public string? UpdatedAt { get; set; }
}

public class InterventionPlanCreateDto
{
    public int? ResidentId { get; set; }
    public string? PlanCategory { get; set; }
    public string? PlanDescription { get; set; }
    public string? ServicesProvided { get; set; }
    public double? TargetValue { get; set; }
    public string? TargetDate { get; set; }
    public string? Status { get; set; }
    public string? CaseConferenceDate { get; set; }
}
