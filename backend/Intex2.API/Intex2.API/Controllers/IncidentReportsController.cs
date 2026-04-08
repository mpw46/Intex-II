using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class IncidentReportsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public IncidentReportsController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<IncidentReportDto>>> GetAll(
        [FromQuery] int? residentId,
        [FromQuery] int? safehouseId,
        [FromQuery] string? severity)
    {
        var query = _context.IncidentReports.AsQueryable();

        if (residentId.HasValue)
            query = query.Where(i => i.ResidentId == residentId.Value);

        if (safehouseId.HasValue)
            query = query.Where(i => i.SafehouseId == safehouseId.Value);

        if (!string.IsNullOrEmpty(severity))
            query = query.Where(i => i.Severity == severity);

        var results = await query
            .OrderByDescending(i => i.IncidentDate)
            .Select(i => new IncidentReportDto
            {
                IncidentId = i.IncidentId,
                ResidentId = i.ResidentId,
                SafehouseId = i.SafehouseId,
                IncidentDate = i.IncidentDate,
                IncidentType = i.IncidentType,
                Severity = i.Severity,
                Description = i.Description,
                ResponseTaken = i.ResponseTaken,
                Resolved = i.Resolved,
                ResolutionDate = i.ResolutionDate,
                ReportedBy = i.ReportedBy,
                FollowUpRequired = i.FollowUpRequired,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IncidentReportDto>> GetById(int id)
    {
        var i = await _context.IncidentReports.FindAsync(id);
        if (i == null) return NotFound();

        return Ok(new IncidentReportDto
        {
            IncidentId = i.IncidentId,
            ResidentId = i.ResidentId,
            SafehouseId = i.SafehouseId,
            IncidentDate = i.IncidentDate,
            IncidentType = i.IncidentType,
            Severity = i.Severity,
            Description = i.Description,
            ResponseTaken = i.ResponseTaken,
            Resolved = i.Resolved,
            ResolutionDate = i.ResolutionDate,
            ReportedBy = i.ReportedBy,
            FollowUpRequired = i.FollowUpRequired,
        });
    }

    [HttpPost]
    public async Task<ActionResult<IncidentReportDto>> Create([FromBody] IncidentReportCreateDto dto)
    {
        var entity = new IncidentReport
        {
            ResidentId = dto.ResidentId,
            SafehouseId = dto.SafehouseId,
            IncidentDate = dto.IncidentDate,
            IncidentType = dto.IncidentType,
            Severity = dto.Severity,
            Description = dto.Description,
            ResponseTaken = dto.ResponseTaken,
            Resolved = dto.Resolved,
            ResolutionDate = dto.ResolutionDate,
            ReportedBy = dto.ReportedBy,
            FollowUpRequired = dto.FollowUpRequired,
        };

        _context.IncidentReports.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.IncidentId }, new IncidentReportDto
        {
            IncidentId = entity.IncidentId,
            ResidentId = entity.ResidentId,
            SafehouseId = entity.SafehouseId,
            IncidentDate = entity.IncidentDate,
            IncidentType = entity.IncidentType,
            Severity = entity.Severity,
            Description = entity.Description,
            ResponseTaken = entity.ResponseTaken,
            Resolved = entity.Resolved,
            ResolutionDate = entity.ResolutionDate,
            ReportedBy = entity.ReportedBy,
            FollowUpRequired = entity.FollowUpRequired,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] IncidentReportCreateDto dto)
    {
        var entity = await _context.IncidentReports.FindAsync(id);
        if (entity == null) return NotFound();

        entity.ResidentId = dto.ResidentId;
        entity.SafehouseId = dto.SafehouseId;
        entity.IncidentDate = dto.IncidentDate;
        entity.IncidentType = dto.IncidentType;
        entity.Severity = dto.Severity;
        entity.Description = dto.Description;
        entity.ResponseTaken = dto.ResponseTaken;
        entity.Resolved = dto.Resolved;
        entity.ResolutionDate = dto.ResolutionDate;
        entity.ReportedBy = dto.ReportedBy;
        entity.FollowUpRequired = dto.FollowUpRequired;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.IncidentReports.FindAsync(id);
        if (entity == null) return NotFound();

        _context.IncidentReports.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
