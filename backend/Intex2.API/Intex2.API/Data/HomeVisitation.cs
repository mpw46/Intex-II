using System;
using System.Collections.Generic;

namespace Intex2.API.Data;

public partial class HomeVisitation
{
    public int? VisitationId { get; set; }

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
