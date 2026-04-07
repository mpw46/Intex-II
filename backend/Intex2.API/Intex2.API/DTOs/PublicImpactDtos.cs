namespace Intex2.API.DTOs;

public class ImpactSnapshotDto
{
    public int TotalGirlsServed { get; set; }
    public int ActiveResidents { get; set; }
    public int ReintegrationSuccessRate { get; set; }
    public int YearsOfOperation { get; set; }
    public int ActiveSafehouses { get; set; }
    public int PhilippineRegionsCovered { get; set; }
    public string ReportingPeriod { get; set; } = "";
}

public class SafehouseCardDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Region { get; set; } = "";
    public string City { get; set; } = "";
    public string Province { get; set; } = "";
    public string Status { get; set; } = "";
    public int CapacityGirls { get; set; }
    public int CurrentOccupancy { get; set; }
    public int ReintegrationRatePercent { get; set; }
    public int AvgProgressPercent { get; set; }
}

public class DonationAllocationSummaryDto
{
    public string ProgramArea { get; set; } = "";
    public int PercentOfFunds { get; set; }
    public string Description { get; set; } = "";
}

public class YearlyOutcomeDto
{
    public int Year { get; set; }
    public int GirlsAdmitted { get; set; }
    public int GirlsReintegrated { get; set; }
}

public class ProgramOutcomeMetricDto
{
    public string Label { get; set; } = "";
    public int CompletionRate { get; set; }
    public string Description { get; set; } = "";
}
