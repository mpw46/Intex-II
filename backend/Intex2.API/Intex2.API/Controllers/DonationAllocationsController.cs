using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonationAllocationsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public DonationAllocationsController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<DonationAllocationDto>>> GetAll(
        [FromQuery] int? donationId,
        [FromQuery] int? safehouseId,
        [FromQuery] string? programArea)
    {
        IQueryable<DonationAllocation> query = _context.DonationAllocations;

        if (!User.IsInRole(AuthRoles.Admin))
        {
            var email = User.Identity?.Name;
            var supporter = await _context.Supporters
                .FirstOrDefaultAsync(s => s.Email == email);
            if (supporter == null) return Ok(Array.Empty<DonationAllocationDto>());

            var donorDonationIds = _context.Donations
                .Where(d => d.SupporterId == supporter.SupporterId)
                .Select(d => d.DonationId);
            query = query.Where(a => donorDonationIds.Contains(a.DonationId));
        }
        else
        {
            if (donationId.HasValue)
                query = query.Where(a => a.DonationId == donationId.Value);
            if (safehouseId.HasValue)
                query = query.Where(a => a.SafehouseId == safehouseId.Value);
            if (!string.IsNullOrEmpty(programArea))
                query = query.Where(a => a.ProgramArea == programArea);
        }

        var results = await query
            .Select(a => new DonationAllocationDto
            {
                AllocationId = a.AllocationId,
                DonationId = a.DonationId,
                SafehouseId = a.SafehouseId,
                ProgramArea = a.ProgramArea,
                AmountAllocated = a.AmountAllocated,
                AllocationDate = a.AllocationDate,
                AllocationNotes = a.AllocationNotes,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DonationAllocationDto>> GetById(int id)
    {
        var a = await _context.DonationAllocations.FindAsync(id);
        if (a == null) return NotFound();

        return Ok(new DonationAllocationDto
        {
            AllocationId = a.AllocationId,
            DonationId = a.DonationId,
            SafehouseId = a.SafehouseId,
            ProgramArea = a.ProgramArea,
            AmountAllocated = a.AmountAllocated,
            AllocationDate = a.AllocationDate,
            AllocationNotes = a.AllocationNotes,
        });
    }

    [HttpPost]
    public async Task<ActionResult<DonationAllocationDto>> Create([FromBody] DonationAllocationCreateDto dto)
    {
        var entity = new DonationAllocation
        {
            DonationId = dto.DonationId,
            SafehouseId = dto.SafehouseId,
            ProgramArea = dto.ProgramArea,
            AmountAllocated = dto.AmountAllocated,
            AllocationDate = dto.AllocationDate,
            AllocationNotes = dto.AllocationNotes,
        };

        _context.DonationAllocations.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.AllocationId }, new DonationAllocationDto
        {
            AllocationId = entity.AllocationId,
            DonationId = entity.DonationId,
            SafehouseId = entity.SafehouseId,
            ProgramArea = entity.ProgramArea,
            AmountAllocated = entity.AmountAllocated,
            AllocationDate = entity.AllocationDate,
            AllocationNotes = entity.AllocationNotes,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] DonationAllocationCreateDto dto)
    {
        var entity = await _context.DonationAllocations.FindAsync(id);
        if (entity == null) return NotFound();

        entity.DonationId = dto.DonationId;
        entity.SafehouseId = dto.SafehouseId;
        entity.ProgramArea = dto.ProgramArea;
        entity.AmountAllocated = dto.AmountAllocated;
        entity.AllocationDate = dto.AllocationDate;
        entity.AllocationNotes = dto.AllocationNotes;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.DonationAllocations.FindAsync(id);
        if (entity == null) return NotFound();

        _context.DonationAllocations.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
