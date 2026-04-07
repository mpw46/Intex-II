namespace Intex2.API.DTOs;

public class PublicImpactSnapshotDto
{
    public int? SnapshotId { get; set; }
    public string? SnapshotDate { get; set; }
    public string? Headline { get; set; }
    public string? SummaryText { get; set; }
    public string? MetricPayloadJson { get; set; }
    public string? IsPublished { get; set; }
    public string? PublishedAt { get; set; }
}
