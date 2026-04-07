using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SafehouseMonthlyMetricsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public SafehouseMonthlyMetricsController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SafehouseMonthlyMetricDto>>> GetAll(
        [FromQuery] int? safehouseId,
        [FromQuery] string? monthStart)
    {
        var query = _context.SafehouseMonthlyMetrics.AsQueryable();

        if (safehouseId.HasValue)
            query = query.Where(m => m.SafehouseId == safehouseId.Value);

        if (!string.IsNullOrEmpty(monthStart))
            query = query.Where(m => m.MonthStart == monthStart);

        var results = await query
            .OrderByDescending(m => m.MonthStart)
            .Select(m => new SafehouseMonthlyMetricDto
            {
                MetricId = m.MetricId,
                SafehouseId = m.SafehouseId,
                MonthStart = m.MonthStart,
                MonthEnd = m.MonthEnd,
                ActiveResidents = m.ActiveResidents,
                AvgEducationProgress = m.AvgEducationProgress,
                AvgHealthScore = m.AvgHealthScore,
                ProcessRecordingCount = m.ProcessRecordingCount,
                HomeVisitationCount = m.HomeVisitationCount,
                IncidentCount = m.IncidentCount,
                Notes = m.Notes,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SafehouseMonthlyMetricDto>> GetById(int id)
    {
        var m = await _context.SafehouseMonthlyMetrics.FindAsync(id);
        if (m == null) return NotFound();

        return Ok(new SafehouseMonthlyMetricDto
        {
            MetricId = m.MetricId,
            SafehouseId = m.SafehouseId,
            MonthStart = m.MonthStart,
            MonthEnd = m.MonthEnd,
            ActiveResidents = m.ActiveResidents,
            AvgEducationProgress = m.AvgEducationProgress,
            AvgHealthScore = m.AvgHealthScore,
            ProcessRecordingCount = m.ProcessRecordingCount,
            HomeVisitationCount = m.HomeVisitationCount,
            IncidentCount = m.IncidentCount,
            Notes = m.Notes,
        });
    }
}
