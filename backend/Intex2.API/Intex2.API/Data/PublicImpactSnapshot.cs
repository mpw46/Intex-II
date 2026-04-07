using System;
using System.Collections.Generic;

namespace Intex2.API.Data;

public partial class PublicImpactSnapshot
{
    public int? SnapshotId { get; set; }

    public string? SnapshotDate { get; set; }

    public string? Headline { get; set; }

    public string? SummaryText { get; set; }

    public string? MetricPayloadJson { get; set; }

    public string? IsPublished { get; set; }

    public string? PublishedAt { get; set; }
}
