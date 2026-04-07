using System;
using System.Collections.Generic;

namespace Intex2.API.Data;

public partial class HealthWellbeingRecord
{
    public int? HealthRecordId { get; set; }

    public int? ResidentId { get; set; }

    public string? RecordDate { get; set; }

    public double? GeneralHealthScore { get; set; }

    public double? NutritionScore { get; set; }

    public double? SleepQualityScore { get; set; }

    public double? EnergyLevelScore { get; set; }

    public double? HeightCm { get; set; }

    public double? WeightKg { get; set; }

    public double? Bmi { get; set; }

    public string? MedicalCheckupDone { get; set; }

    public string? DentalCheckupDone { get; set; }

    public string? PsychologicalCheckupDone { get; set; }

    public string? Notes { get; set; }
}
