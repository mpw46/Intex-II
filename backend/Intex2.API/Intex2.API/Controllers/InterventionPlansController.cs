using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class InterventionPlansController : ControllerBase
{
    private readonly Intex2104Context _context;

    public InterventionPlansController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InterventionPlanDto>>> GetAll(
        [FromQuery] int? residentId,
        [FromQuery] string? status)
    {
        var query = _context.InterventionPlans.AsQueryable();

        if (residentId.HasValue)
            query = query.Where(p => p.ResidentId == residentId.Value);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(p => p.Status == status);

        var results = await query
            .Select(p => new InterventionPlanDto
            {
                PlanId = p.PlanId,
                ResidentId = p.ResidentId,
                PlanCategory = p.PlanCategory,
                PlanDescription = p.PlanDescription,
                ServicesProvided = p.ServicesProvided,
                TargetValue = p.TargetValue,
                TargetDate = p.TargetDate,
                Status = p.Status,
                CaseConferenceDate = p.CaseConferenceDate,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InterventionPlanDto>> GetById(int id)
    {
        var p = await _context.InterventionPlans.FindAsync(id);
        if (p == null) return NotFound();

        return Ok(new InterventionPlanDto
        {
            PlanId = p.PlanId,
            ResidentId = p.ResidentId,
            PlanCategory = p.PlanCategory,
            PlanDescription = p.PlanDescription,
            ServicesProvided = p.ServicesProvided,
            TargetValue = p.TargetValue,
            TargetDate = p.TargetDate,
            Status = p.Status,
            CaseConferenceDate = p.CaseConferenceDate,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt,
        });
    }

    [HttpPost]
    public async Task<ActionResult<InterventionPlanDto>> Create([FromBody] InterventionPlanCreateDto dto)
    {
        var entity = new InterventionPlan
        {
            ResidentId = dto.ResidentId,
            PlanCategory = dto.PlanCategory,
            PlanDescription = dto.PlanDescription,
            ServicesProvided = dto.ServicesProvided,
            TargetValue = dto.TargetValue,
            TargetDate = dto.TargetDate,
            Status = dto.Status,
            CaseConferenceDate = dto.CaseConferenceDate,
        };

        _context.InterventionPlans.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.PlanId }, new InterventionPlanDto
        {
            PlanId = entity.PlanId,
            ResidentId = entity.ResidentId,
            PlanCategory = entity.PlanCategory,
            PlanDescription = entity.PlanDescription,
            ServicesProvided = entity.ServicesProvided,
            TargetValue = entity.TargetValue,
            TargetDate = entity.TargetDate,
            Status = entity.Status,
            CaseConferenceDate = entity.CaseConferenceDate,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] InterventionPlanCreateDto dto)
    {
        var entity = await _context.InterventionPlans.FindAsync(id);
        if (entity == null) return NotFound();

        entity.ResidentId = dto.ResidentId;
        entity.PlanCategory = dto.PlanCategory;
        entity.PlanDescription = dto.PlanDescription;
        entity.ServicesProvided = dto.ServicesProvided;
        entity.TargetValue = dto.TargetValue;
        entity.TargetDate = dto.TargetDate;
        entity.Status = dto.Status;
        entity.CaseConferenceDate = dto.CaseConferenceDate;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.InterventionPlans.FindAsync(id);
        if (entity == null) return NotFound();

        _context.InterventionPlans.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
