namespace Intex2.API.DTOs;

public class MlResidentRiskDto
{
    public int ResidentId { get; set; }
    public string? CaseControlNo { get; set; }
    public string? SafehouseName { get; set; }
    public double RiskProbability { get; set; }
    public string RiskLevel { get; set; } = string.Empty;
    public string AsOfDate { get; set; } = string.Empty;
    public DateTime ScoredAt { get; set; }
    public string ModelVersion { get; set; } = string.Empty;
}

public class MlDonorRiskDto
{
    public int SupporterId { get; set; }
    public string? DisplayName { get; set; }
    public double LapseProbability { get; set; }
    public string RiskTier { get; set; } = string.Empty;
    public string AsOfDate { get; set; } = string.Empty;
    public DateTime ScoredAt { get; set; }
    public string ModelVersion { get; set; } = string.Empty;
}

public class MlSocialEngagementDriverDto
{
    public int Rank { get; set; }
    public string FeatureName { get; set; } = string.Empty;
    public double Importance { get; set; }
    public string? Direction { get; set; }
    public string ModelType { get; set; } = string.Empty;
    public DateTime ScoredAt { get; set; }
    public string ModelVersion { get; set; } = string.Empty;
}
