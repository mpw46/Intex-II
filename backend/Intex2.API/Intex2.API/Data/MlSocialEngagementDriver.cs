namespace Intex2.API.Data;

public class MlSocialEngagementDriver
{
    public int DriverId { get; set; }
    public DateTime ScoredAt { get; set; }
    public string ModelType { get; set; } = string.Empty;   // OLS | DecisionTree
    public int Rank { get; set; }
    public string FeatureName { get; set; } = string.Empty;
    public double Importance { get; set; }
    public string? Direction { get; set; }                  // positive | negative (OLS only)
    public string ModelVersion { get; set; } = string.Empty;
    public bool IsCurrent { get; set; }
}
