using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SupportersController : ControllerBase
{
    private readonly Intex2104Context _context;

    public SupportersController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SupporterDto>>> GetAll(
        [FromQuery] string? supporterType,
        [FromQuery] string? status,
        [FromQuery] string? search)
    {
        var query = _context.Supporters.AsQueryable();

        if (!string.IsNullOrEmpty(supporterType))
            query = query.Where(s => s.SupporterType == supporterType);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(s => s.Status == status);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(s =>
                (s.DisplayName != null && s.DisplayName.Contains(search)) ||
                (s.Email != null && s.Email.Contains(search)) ||
                (s.FirstName != null && s.FirstName.Contains(search)) ||
                (s.LastName != null && s.LastName.Contains(search)));

        var results = await query
            .Select(s => new SupporterDto
            {
                SupporterId = s.SupporterId,
                SupporterType = s.SupporterType,
                DisplayName = s.DisplayName,
                OrganizationName = s.OrganizationName,
                FirstName = s.FirstName,
                LastName = s.LastName,
                RelationshipType = s.RelationshipType,
                Region = s.Region,
                Country = s.Country,
                Email = s.Email,
                Phone = s.Phone,
                Status = s.Status,
                CreatedAt = s.CreatedAt,
                FirstDonationDate = s.FirstDonationDate,
                AcquisitionChannel = s.AcquisitionChannel,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SupporterDto>> GetById(int id)
    {
        var s = await _context.Supporters.FindAsync(id);
        if (s == null) return NotFound();

        return Ok(new SupporterDto
        {
            SupporterId = s.SupporterId,
            SupporterType = s.SupporterType,
            DisplayName = s.DisplayName,
            OrganizationName = s.OrganizationName,
            FirstName = s.FirstName,
            LastName = s.LastName,
            RelationshipType = s.RelationshipType,
            Region = s.Region,
            Country = s.Country,
            Email = s.Email,
            Phone = s.Phone,
            Status = s.Status,
            CreatedAt = s.CreatedAt,
            FirstDonationDate = s.FirstDonationDate,
            AcquisitionChannel = s.AcquisitionChannel,
        });
    }

    [HttpPost]
    public async Task<ActionResult<SupporterDto>> Create([FromBody] SupporterCreateDto dto)
    {
        var entity = new Supporter
        {
            SupporterType = dto.SupporterType,
            DisplayName = dto.DisplayName,
            OrganizationName = dto.OrganizationName,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            RelationshipType = dto.RelationshipType,
            Region = dto.Region,
            Country = dto.Country,
            Email = dto.Email,
            Phone = dto.Phone,
            Status = dto.Status,
            AcquisitionChannel = dto.AcquisitionChannel,
        };

        _context.Supporters.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.SupporterId }, new SupporterDto
        {
            SupporterId = entity.SupporterId,
            SupporterType = entity.SupporterType,
            DisplayName = entity.DisplayName,
            OrganizationName = entity.OrganizationName,
            FirstName = entity.FirstName,
            LastName = entity.LastName,
            RelationshipType = entity.RelationshipType,
            Region = entity.Region,
            Country = entity.Country,
            Email = entity.Email,
            Phone = entity.Phone,
            Status = entity.Status,
            CreatedAt = entity.CreatedAt,
            FirstDonationDate = entity.FirstDonationDate,
            AcquisitionChannel = entity.AcquisitionChannel,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] SupporterCreateDto dto)
    {
        var entity = await _context.Supporters.FindAsync(id);
        if (entity == null) return NotFound();

        entity.SupporterType = dto.SupporterType;
        entity.DisplayName = dto.DisplayName;
        entity.OrganizationName = dto.OrganizationName;
        entity.FirstName = dto.FirstName;
        entity.LastName = dto.LastName;
        entity.RelationshipType = dto.RelationshipType;
        entity.Region = dto.Region;
        entity.Country = dto.Country;
        entity.Email = dto.Email;
        entity.Phone = dto.Phone;
        entity.Status = dto.Status;
        entity.AcquisitionChannel = dto.AcquisitionChannel;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.Supporters.FindAsync(id);
        if (entity == null) return NotFound();

        _context.Supporters.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
