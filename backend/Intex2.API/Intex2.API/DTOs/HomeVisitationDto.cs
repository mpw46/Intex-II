using System.ComponentModel.DataAnnotations;

namespace Intex2.API.DTOs;

public class HomeVisitationDto
{
    public int VisitationId { get; set; }
    public int? ResidentId { get; set; }
    public string? VisitDate { get; set; }
    public string? SocialWorker { get; set; }
    public string? VisitType { get; set; }
    public string? LocationVisited { get; set; }
    public string? FamilyMembersPresent { get; set; }
    public string? Purpose { get; set; }
    public string? Observations { get; set; }
    public string? FamilyCooperationLevel { get; set; }
    public string? SafetyConcernsNoted { get; set; }
    public string? FollowUpNeeded { get; set; }
    public string? FollowUpNotes { get; set; }
    public string? VisitOutcome { get; set; }
}

public class HomeVisitationCreateDto
{
    [Required]
    public int? ResidentId { get; set; }

    [Required]
    public string VisitDate { get; set; } = string.Empty;

    [Required]
    public string SocialWorker { get; set; } = string.Empty;

    [Required]
    public string VisitType { get; set; } = string.Empty;

    public string? LocationVisited { get; set; }
    public string? FamilyMembersPresent { get; set; }
    public string? Purpose { get; set; }
    public string? Observations { get; set; }
    public string? FamilyCooperationLevel { get; set; }
    public string? SafetyConcernsNoted { get; set; }
    public string? FollowUpNeeded { get; set; }
    public string? FollowUpNotes { get; set; }
    public string? VisitOutcome { get; set; }
}
