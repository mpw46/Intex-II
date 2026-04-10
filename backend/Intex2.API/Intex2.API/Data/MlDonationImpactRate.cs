namespace Intex2.API.Data;

public class MlDonationImpactRate
{
    public int RateId { get; set; }
    public string ImpactCategory { get; set; } = string.Empty;
    public double CostPerUnit { get; set; }
    public string UnitLabel { get; set; } = string.Empty;
    public double TotalAllocated { get; set; }
    public double TotalUnits { get; set; }
    public DateTime ScoredAt { get; set; }
    public string ModelVersion { get; set; } = string.Empty;
    public bool IsCurrent { get; set; }
}
