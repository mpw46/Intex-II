using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicImpactController : ControllerBase
{
    private readonly Intex2104Context _context;

    public PublicImpactController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet("snapshot")]
    public async Task<ActionResult<ImpactSnapshotDto>> GetSnapshot()
    {
        var totalGirls = await _context.Residents.CountAsync();
        var activeResidents = await _context.Residents
            .CountAsync(r => r.CaseStatus == "Active");

        var reintegrated = await _context.Residents
            .CountAsync(r => r.ReintegrationStatus == "Completed" || r.ReintegrationStatus == "In Progress");
        var reintegrationRate = totalGirls > 0
            ? (int)Math.Round((double)reintegrated / totalGirls * 100)
            : 0;

        var activeSafehouses = await _context.Safehouses
            .CountAsync(s => s.Status == "Active");

        var regionsCovered = await _context.Safehouses
            .Where(s => s.Region != null)
            .Select(s => s.Region)
            .Distinct()
            .CountAsync();

        var earliestAdmission = await _context.Residents
            .Where(r => r.DateOfAdmission != null)
            .Select(r => r.DateOfAdmission)
            .MinAsync();

        int yearsOfOperation = 1;
        if (earliestAdmission != null && DateTime.TryParse(earliestAdmission, out var earliest))
        {
            yearsOfOperation = Math.Max(1, DateTime.Now.Year - earliest.Year);
        }

        return Ok(new ImpactSnapshotDto
        {
            TotalGirlsServed = totalGirls,
            ActiveResidents = activeResidents,
            ReintegrationSuccessRate = reintegrationRate,
            YearsOfOperation = yearsOfOperation,
            ActiveSafehouses = activeSafehouses,
            PhilippineRegionsCovered = regionsCovered,
            ReportingPeriod = DateTime.Now.Year.ToString(),
        });
    }

    [HttpGet("safehouses")]
    public async Task<ActionResult<IEnumerable<SafehouseCardDto>>> GetSafehouses()
    {
        var safehouses = await _context.Safehouses.ToListAsync();
        var residents = await _context.Residents.ToListAsync();
        var educationRecords = await _context.EducationRecords.ToListAsync();

        var result = safehouses.Select(s =>
        {
            var shResidents = residents
                .Where(r => r.SafehouseId == s.SafehouseId)
                .ToList();

            var totalCount = shResidents.Count;
            var reintegratedCount = shResidents.Count(r => r.ReintegrationStatus == "Completed" || r.ReintegrationStatus == "In Progress");
            var reintegrationRate = totalCount > 0
                ? (int)Math.Round((double)reintegratedCount / totalCount * 100)
                : 0;

            var residentIds = shResidents.Select(r => r.ResidentId).ToHashSet();
            var avgProgress = educationRecords
                .Where(e => e.ResidentId.HasValue && residentIds.Contains(e.ResidentId.Value)
                            && e.ProgressPercent.HasValue)
                .Select(e => e.ProgressPercent!.Value)
                .DefaultIfEmpty(0)
                .Average();

            return new SafehouseCardDto
            {
                Id = s.SafehouseId ?? 0,
                Name = s.Name ?? "",
                Region = s.Region ?? "",
                City = s.City ?? "",
                Province = s.Province ?? "",
                Status = s.Status ?? "Active",
                CapacityGirls = s.CapacityGirls ?? 0,
                CurrentOccupancy = s.CurrentOccupancy ?? 0,
                ReintegrationRatePercent = reintegrationRate,
                AvgProgressPercent = (int)Math.Round(avgProgress),
            };
        }).ToList();

        return Ok(result);
    }

    [HttpGet("yearly-outcomes")]
    public async Task<ActionResult<IEnumerable<YearlyOutcomeDto>>> GetYearlyOutcomes()
    {
        var residents = await _context.Residents.ToListAsync();

        var admissionsByYear = residents
            .Where(r => r.DateOfAdmission != null && DateTime.TryParse(r.DateOfAdmission, out _))
            .GroupBy(r => DateTime.Parse(r.DateOfAdmission!).Year)
            .ToDictionary(g => g.Key, g => g.Count());

        var reintegrationsByYear = residents
            .Where(r => (r.ReintegrationStatus == "Completed" || r.ReintegrationStatus == "In Progress")
                        && r.DateClosed != null
                        && DateTime.TryParse(r.DateClosed, out _))
            .GroupBy(r => DateTime.Parse(r.DateClosed!).Year)
            .ToDictionary(g => g.Key, g => g.Count());

        var allYears = admissionsByYear.Keys
            .Union(reintegrationsByYear.Keys)
            .OrderBy(y => y)
            .ToList();

        var result = allYears.Select(year => new YearlyOutcomeDto
        {
            Year = year,
            GirlsAdmitted = admissionsByYear.GetValueOrDefault(year, 0),
            GirlsReintegrated = reintegrationsByYear.GetValueOrDefault(year, 0),
        }).ToList();

        return Ok(result);
    }

    [HttpGet("allocations")]
    public async Task<ActionResult<IEnumerable<DonationAllocationSummaryDto>>> GetAllocations()
    {
        var allocations = await _context.DonationAllocations
            .Where(a => a.AmountAllocated.HasValue && a.ProgramArea != null)
            .ToListAsync();

        var totalAmount = allocations.Sum(a => a.AmountAllocated ?? 0);

        if (totalAmount == 0)
        {
            return Ok(Array.Empty<DonationAllocationSummaryDto>());
        }

        var programDescriptions = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["Direct Services"] = "Shelter, food, clothing, hygiene supplies, and medical care for residents.",
            ["Counseling"] = "Licensed social workers, psychologists, and trauma-informed therapy sessions.",
            ["Education"] = "School enrollment, tutoring, skills training, and livelihood programs.",
            ["Operations"] = "Safehouse maintenance, staff coordination, reporting, and compliance.",
        };

        var result = allocations
            .GroupBy(a => a.ProgramArea!)
            .Select(g =>
            {
                var groupTotal = g.Sum(a => a.AmountAllocated ?? 0);
                var pct = (int)Math.Round(groupTotal / totalAmount * 100);
                return new DonationAllocationSummaryDto
                {
                    ProgramArea = g.Key,
                    PercentOfFunds = pct,
                    Description = programDescriptions.GetValueOrDefault(g.Key, $"Funds allocated to {g.Key}."),
                };
            })
            .OrderByDescending(a => a.PercentOfFunds)
            .ToList();

        return Ok(result);
    }

    [HttpGet("donation-rates")]
    public async Task<ActionResult> GetDonationRates()
    {
        var rates = await _context.MlDonationImpactRates
            .Where(r => r.IsCurrent)
            .Select(r => new
            {
                r.ImpactCategory,
                r.CostPerUnit,
                r.UnitLabel,
            })
            .ToListAsync();

        return Ok(rates);
    }

    [HttpGet("program-outcomes")]
    public async Task<ActionResult<IEnumerable<ProgramOutcomeMetricDto>>> GetProgramOutcomes()
    {
        var educationRecords = await _context.EducationRecords.ToListAsync();
        var completedEducation = educationRecords
            .Count(e => e.CompletionStatus != null &&
                        e.CompletionStatus.Equals("Completed", StringComparison.OrdinalIgnoreCase));
        var totalEducation = educationRecords.Count(e => e.CompletionStatus != null);
        var educationRate = totalEducation > 0
            ? (int)Math.Round((double)completedEducation / totalEducation * 100)
            : 0;

        var recordings = await _context.ProcessRecordings.CountAsync();
        var completedRecordings = await _context.ProcessRecordings
            .CountAsync(p => p.ProgressNoted != null && p.ProgressNoted != "");
        var counselingRate = recordings > 0
            ? (int)Math.Round((double)completedRecordings / recordings * 100)
            : 0;

        var healthRecords = await _context.HealthWellbeingRecords.ToListAsync();
        var improvedHealth = healthRecords
            .Count(h => h.GeneralHealthScore.HasValue && h.GeneralHealthScore >= 7);
        var totalHealth = healthRecords.Count(h => h.GeneralHealthScore.HasValue);
        var healthRate = totalHealth > 0
            ? (int)Math.Round((double)improvedHealth / totalHealth * 100)
            : 0;

        var residents = await _context.Residents.ToListAsync();
        var totalResidents = residents.Count;
        var reintegrated = residents.Count(r => r.ReintegrationStatus == "Completed" || r.ReintegrationStatus == "In Progress");
        var reintegrationRate = totalResidents > 0
            ? (int)Math.Round((double)reintegrated / totalResidents * 100)
            : 0;

        var result = new List<ProgramOutcomeMetricDto>
        {
            new()
            {
                Label = "Education Completion",
                CompletionRate = educationRate,
                Description = "Residents who completed their enrolled academic program or school year",
            },
            new()
            {
                Label = "Counseling Engagement",
                CompletionRate = counselingRate,
                Description = "Residents who completed their full counseling intervention plan",
            },
            new()
            {
                Label = "Health Improvement",
                CompletionRate = healthRate,
                Description = "Residents showing sustained improvement in nutrition and wellbeing scores",
            },
            new()
            {
                Label = "Successful Reintegration",
                CompletionRate = reintegrationRate,
                Description = "Closed cases where the resident was safely reintegrated with family or placement",
            },
        };

        return Ok(result);
    }
}
