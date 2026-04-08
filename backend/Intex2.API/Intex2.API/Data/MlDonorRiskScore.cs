namespace Intex2.API.Data;

public class MlDonorRiskScore
{
    public int ScoreId { get; set; }
    public int SupporterId { get; set; }
    public DateTime ScoredAt { get; set; }
    public DateOnly AsOfDate { get; set; }
    public double LapseProbability { get; set; }
    public string RiskTier { get; set; } = string.Empty;    // High | Medium | Low
    public string ModelVersion { get; set; } = string.Empty;
    public bool IsCurrent { get; set; }
}
