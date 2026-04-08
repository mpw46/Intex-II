namespace Intex2.API.Data;

public class MlResidentRiskScore
{
    public int ScoreId { get; set; }
    public int ResidentId { get; set; }
    public DateTime ScoredAt { get; set; }
    public DateOnly AsOfDate { get; set; }
    public double RiskProbability { get; set; }
    public string RiskLevel { get; set; } = string.Empty;   // High | Medium | Low
    public string ModelVersion { get; set; } = string.Empty;
    public bool IsCurrent { get; set; }
}
