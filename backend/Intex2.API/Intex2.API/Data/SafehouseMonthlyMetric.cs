using System;
using System.Collections.Generic;

namespace Intex2.API.Data;

public partial class SafehouseMonthlyMetric
{
    public int? MetricId { get; set; }

    public int? SafehouseId { get; set; }

    public string? MonthStart { get; set; }

    public string? MonthEnd { get; set; }

    public int? ActiveResidents { get; set; }

    public string? AvgEducationProgress { get; set; }

    public string? AvgHealthScore { get; set; }

    public int? ProcessRecordingCount { get; set; }

    public int? HomeVisitationCount { get; set; }

    public int? IncidentCount { get; set; }

    public string? Notes { get; set; }
}
