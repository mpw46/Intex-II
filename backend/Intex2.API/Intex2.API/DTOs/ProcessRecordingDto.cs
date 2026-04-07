namespace Intex2.API.DTOs;

public class ProcessRecordingDto
{
    public int? RecordingId { get; set; }
    public int? ResidentId { get; set; }
    public string? SessionDate { get; set; }
    public string? SocialWorker { get; set; }
    public string? SessionType { get; set; }
    public int? SessionDurationMinutes { get; set; }
    public string? EmotionalStateObserved { get; set; }
    public string? EmotionalStateEnd { get; set; }
    public string? SessionNarrative { get; set; }
    public string? InterventionsApplied { get; set; }
    public string? FollowUpActions { get; set; }
    public string? ProgressNoted { get; set; }
    public string? ConcernsFlagged { get; set; }
    public string? ReferralMade { get; set; }
    public string? NotesRestricted { get; set; }
}

public class ProcessRecordingCreateDto
{
    public int? ResidentId { get; set; }
    public string? SessionDate { get; set; }
    public string? SocialWorker { get; set; }
    public string? SessionType { get; set; }
    public int? SessionDurationMinutes { get; set; }
    public string? EmotionalStateObserved { get; set; }
    public string? EmotionalStateEnd { get; set; }
    public string? SessionNarrative { get; set; }
    public string? InterventionsApplied { get; set; }
    public string? FollowUpActions { get; set; }
    public string? ProgressNoted { get; set; }
    public string? ConcernsFlagged { get; set; }
    public string? ReferralMade { get; set; }
    public string? NotesRestricted { get; set; }
}
