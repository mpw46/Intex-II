namespace Intex2.API.Data;

public class MlDonorImpactPrediction
{
    public int PredictionId { get; set; }
    public int SupporterId { get; set; }
    public string ProgramArea { get; set; } = string.Empty;
    public double PredictedPct { get; set; }
    public DateTime ScoredAt { get; set; }
    public string ModelVersion { get; set; } = string.Empty;
    public bool IsCurrent { get; set; }
}
