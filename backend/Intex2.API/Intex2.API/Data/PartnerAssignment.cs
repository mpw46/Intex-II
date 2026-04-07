using System;
using System.Collections.Generic;

namespace Intex2.API.Data;

public partial class PartnerAssignment
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
