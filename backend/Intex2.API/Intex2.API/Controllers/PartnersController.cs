using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class PartnersController : ControllerBase
{
    private readonly Intex2104Context _context;

    public PartnersController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PartnerDto>>> GetAll(
        [FromQuery] string? partnerType,
        [FromQuery] string? status)
    {
        var query = _context.Partners.AsQueryable();

        if (!string.IsNullOrEmpty(partnerType))
            query = query.Where(p => p.PartnerType == partnerType);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(p => p.Status == status);

        var results = await query
            .Select(p => new PartnerDto
            {
                PartnerId = p.PartnerId,
                PartnerName = p.PartnerName,
                PartnerType = p.PartnerType,
                RoleType = p.RoleType,
                ContactName = p.ContactName,
                Email = p.Email,
                Phone = p.Phone,
                Region = p.Region,
                Status = p.Status,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Notes = p.Notes,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PartnerDto>> GetById(int id)
    {
        var p = await _context.Partners.FindAsync(id);
        if (p == null) return NotFound();

        return Ok(new PartnerDto
        {
            PartnerId = p.PartnerId,
            PartnerName = p.PartnerName,
            PartnerType = p.PartnerType,
            RoleType = p.RoleType,
            ContactName = p.ContactName,
            Email = p.Email,
            Phone = p.Phone,
            Region = p.Region,
            Status = p.Status,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            Notes = p.Notes,
        });
    }

    [HttpPost]
    public async Task<ActionResult<PartnerDto>> Create([FromBody] PartnerCreateDto dto)
    {
        var entity = new Partner
        {
            PartnerName = dto.PartnerName,
            PartnerType = dto.PartnerType,
            RoleType = dto.RoleType,
            ContactName = dto.ContactName,
            Email = dto.Email,
            Phone = dto.Phone,
            Region = dto.Region,
            Status = dto.Status,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Notes = dto.Notes,
        };

        _context.Partners.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.PartnerId }, new PartnerDto
        {
            PartnerId = entity.PartnerId,
            PartnerName = entity.PartnerName,
            PartnerType = entity.PartnerType,
            RoleType = entity.RoleType,
            ContactName = entity.ContactName,
            Email = entity.Email,
            Phone = entity.Phone,
            Region = entity.Region,
            Status = entity.Status,
            StartDate = entity.StartDate,
            EndDate = entity.EndDate,
            Notes = entity.Notes,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PartnerCreateDto dto)
    {
        var entity = await _context.Partners.FindAsync(id);
        if (entity == null) return NotFound();

        entity.PartnerName = dto.PartnerName;
        entity.PartnerType = dto.PartnerType;
        entity.RoleType = dto.RoleType;
        entity.ContactName = dto.ContactName;
        entity.Email = dto.Email;
        entity.Phone = dto.Phone;
        entity.Region = dto.Region;
        entity.Status = dto.Status;
        entity.StartDate = dto.StartDate;
        entity.EndDate = dto.EndDate;
        entity.Notes = dto.Notes;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.Partners.FindAsync(id);
        if (entity == null) return NotFound();

        _context.Partners.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
