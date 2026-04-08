using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class PartnerAssignmentsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public PartnerAssignmentsController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PartnerAssignmentDto>>> GetAll(
        [FromQuery] int? partnerId,
        [FromQuery] string? safehouseId)
    {
        var query = _context.PartnerAssignments.AsQueryable();

        if (partnerId.HasValue)
            query = query.Where(a => a.PartnerId == partnerId.Value);

        if (!string.IsNullOrEmpty(safehouseId))
            query = query.Where(a => a.SafehouseId == safehouseId);

        var results = await query
            .Select(a => new PartnerAssignmentDto
            {
                AssignmentId = a.AssignmentId,
                PartnerId = a.PartnerId,
                SafehouseId = a.SafehouseId,
                ProgramArea = a.ProgramArea,
                AssignmentStart = a.AssignmentStart,
                AssignmentEnd = a.AssignmentEnd,
                ResponsibilityNotes = a.ResponsibilityNotes,
                IsPrimary = a.IsPrimary,
                Status = a.Status,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PartnerAssignmentDto>> GetById(int id)
    {
        var a = await _context.PartnerAssignments.FindAsync(id);
        if (a == null) return NotFound();

        return Ok(new PartnerAssignmentDto
        {
            AssignmentId = a.AssignmentId,
            PartnerId = a.PartnerId,
            SafehouseId = a.SafehouseId,
            ProgramArea = a.ProgramArea,
            AssignmentStart = a.AssignmentStart,
            AssignmentEnd = a.AssignmentEnd,
            ResponsibilityNotes = a.ResponsibilityNotes,
            IsPrimary = a.IsPrimary,
            Status = a.Status,
        });
    }

    [HttpPost]
    public async Task<ActionResult<PartnerAssignmentDto>> Create([FromBody] PartnerAssignmentCreateDto dto)
    {
        var entity = new PartnerAssignment
        {
            PartnerId = dto.PartnerId,
            SafehouseId = dto.SafehouseId,
            ProgramArea = dto.ProgramArea,
            AssignmentStart = dto.AssignmentStart,
            AssignmentEnd = dto.AssignmentEnd,
            ResponsibilityNotes = dto.ResponsibilityNotes,
            IsPrimary = dto.IsPrimary,
            Status = dto.Status,
        };

        _context.PartnerAssignments.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.AssignmentId }, new PartnerAssignmentDto
        {
            AssignmentId = entity.AssignmentId,
            PartnerId = entity.PartnerId,
            SafehouseId = entity.SafehouseId,
            ProgramArea = entity.ProgramArea,
            AssignmentStart = entity.AssignmentStart,
            AssignmentEnd = entity.AssignmentEnd,
            ResponsibilityNotes = entity.ResponsibilityNotes,
            IsPrimary = entity.IsPrimary,
            Status = entity.Status,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PartnerAssignmentCreateDto dto)
    {
        var entity = await _context.PartnerAssignments.FindAsync(id);
        if (entity == null) return NotFound();

        entity.PartnerId = dto.PartnerId;
        entity.SafehouseId = dto.SafehouseId;
        entity.ProgramArea = dto.ProgramArea;
        entity.AssignmentStart = dto.AssignmentStart;
        entity.AssignmentEnd = dto.AssignmentEnd;
        entity.ResponsibilityNotes = dto.ResponsibilityNotes;
        entity.IsPrimary = dto.IsPrimary;
        entity.Status = dto.Status;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.PartnerAssignments.FindAsync(id);
        if (entity == null) return NotFound();

        _context.PartnerAssignments.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
