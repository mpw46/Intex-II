using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SafehousesController : ControllerBase
{
    private readonly Intex2104Context _context;

    public SafehousesController(Intex2104Context context)
    {
        _context = context;
    }

    [Authorize(Policy = AuthPolicies.AdminOnly)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SafehouseDto>>> GetAll([FromQuery] string? status, [FromQuery] string? region)
    {
        var query = _context.Safehouses.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(s => s.Status == status);

        if (!string.IsNullOrEmpty(region))
            query = query.Where(s => s.Region == region);

        var results = await query
            .Select(s => new SafehouseDto
            {
                SafehouseId = s.SafehouseId,
                SafehouseCode = s.SafehouseCode,
                Name = s.Name,
                Region = s.Region,
                City = s.City,
                Province = s.Province,
                Country = s.Country,
                OpenDate = s.OpenDate,
                Status = s.Status,
                CapacityGirls = s.CapacityGirls,
                CapacityStaff = s.CapacityStaff,
                CurrentOccupancy = s.CurrentOccupancy,
                Notes = s.Notes,
            })
            .ToListAsync();

        return Ok(results);
    }

    [Authorize(Policy = AuthPolicies.AdminOnly)]
    [HttpGet("{id}")]
    public async Task<ActionResult<SafehouseDto>> GetById(int id)
    {
        var s = await _context.Safehouses.FindAsync(id);
        if (s == null) return NotFound();

        return Ok(new SafehouseDto
        {
            SafehouseId = s.SafehouseId,
            SafehouseCode = s.SafehouseCode,
            Name = s.Name,
            Region = s.Region,
            City = s.City,
            Province = s.Province,
            Country = s.Country,
            OpenDate = s.OpenDate,
            Status = s.Status,
            CapacityGirls = s.CapacityGirls,
            CapacityStaff = s.CapacityStaff,
            CurrentOccupancy = s.CurrentOccupancy,
            Notes = s.Notes,
        });
    }

    [Authorize(Policy = AuthPolicies.AdminOnly)]
    [HttpPost]
    public async Task<ActionResult<SafehouseDto>> Create([FromBody] SafehouseCreateDto dto)
    {
        var entity = new Safehouse
        {
            SafehouseCode = dto.SafehouseCode,
            Name = dto.Name,
            Region = dto.Region,
            City = dto.City,
            Province = dto.Province,
            Country = dto.Country,
            OpenDate = dto.OpenDate,
            Status = dto.Status,
            CapacityGirls = dto.CapacityGirls,
            CapacityStaff = dto.CapacityStaff,
            CurrentOccupancy = dto.CurrentOccupancy,
            Notes = dto.Notes,
        };

        _context.Safehouses.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.SafehouseId }, new SafehouseDto
        {
            SafehouseId = entity.SafehouseId,
            SafehouseCode = entity.SafehouseCode,
            Name = entity.Name,
            Region = entity.Region,
            City = entity.City,
            Province = entity.Province,
            Country = entity.Country,
            OpenDate = entity.OpenDate,
            Status = entity.Status,
            CapacityGirls = entity.CapacityGirls,
            CapacityStaff = entity.CapacityStaff,
            CurrentOccupancy = entity.CurrentOccupancy,
            Notes = entity.Notes,
        });
    }

    [Authorize(Policy = AuthPolicies.AdminOnly)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] SafehouseCreateDto dto)
    {
        var entity = await _context.Safehouses.FindAsync(id);
        if (entity == null) return NotFound();

        entity.SafehouseCode = dto.SafehouseCode;
        entity.Name = dto.Name;
        entity.Region = dto.Region;
        entity.City = dto.City;
        entity.Province = dto.Province;
        entity.Country = dto.Country;
        entity.OpenDate = dto.OpenDate;
        entity.Status = dto.Status;
        entity.CapacityGirls = dto.CapacityGirls;
        entity.CapacityStaff = dto.CapacityStaff;
        entity.CurrentOccupancy = dto.CurrentOccupancy;
        entity.Notes = dto.Notes;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Policy = AuthPolicies.AdminOnly)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.Safehouses.FindAsync(id);
        if (entity == null) return NotFound();

        _context.Safehouses.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
