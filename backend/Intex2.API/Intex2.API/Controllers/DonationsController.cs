using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonationsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public DonationsController(Intex2104Context context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DonationDto>>> GetAll(
        [FromQuery] int? supporterId,
        [FromQuery] string? donationType,
        [FromQuery] string? campaignName)
    {
        var query = _context.Donations.AsQueryable();

        if (!User.IsInRole(AuthRoles.Admin))
        {
            var email = User.Identity?.Name;
            var supporter = await _context.Supporters.FirstOrDefaultAsync(s => s.Email == email);
            if (supporter == null) return Ok(Array.Empty<DonationDto>());
            query = query.Where(d => d.SupporterId == supporter.SupporterId);
        }
        else if (supporterId.HasValue)
            query = query.Where(d => d.SupporterId == supporterId.Value);

        if (!string.IsNullOrEmpty(donationType))
            query = query.Where(d => d.DonationType == donationType);

        if (!string.IsNullOrEmpty(campaignName))
            query = query.Where(d => d.CampaignName != null && d.CampaignName.Contains(campaignName));

        var results = await query
            .Select(d => new DonationDto
            {
                DonationId = d.DonationId,
                SupporterId = d.SupporterId,
                DonationType = d.DonationType,
                DonationDate = d.DonationDate,
                IsRecurring = d.IsRecurring,
                CampaignName = d.CampaignName,
                ChannelSource = d.ChannelSource,
                CurrencyCode = d.CurrencyCode,
                Amount = d.Amount,
                EstimatedValue = d.EstimatedValue,
                ImpactUnit = d.ImpactUnit,
                Notes = d.Notes,
                ReferralPostId = d.ReferralPostId,
            })
            .ToListAsync();

        return Ok(results);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<DonationDto>> GetById(int id)
    {
        var d = await _context.Donations.FindAsync(id);
        if (d == null) return NotFound();

        if (!User.IsInRole(AuthRoles.Admin))
        {
            var email = User.Identity?.Name;
            var supporter = await _context.Supporters.FirstOrDefaultAsync(s => s.Email == email);
            if (supporter == null || d.SupporterId != supporter.SupporterId) return Forbid();
        }

        return Ok(new DonationDto
        {
            DonationId = d.DonationId,
            SupporterId = d.SupporterId,
            DonationType = d.DonationType,
            DonationDate = d.DonationDate,
            IsRecurring = d.IsRecurring,
            CampaignName = d.CampaignName,
            ChannelSource = d.ChannelSource,
            CurrencyCode = d.CurrencyCode,
            Amount = d.Amount,
            EstimatedValue = d.EstimatedValue,
            ImpactUnit = d.ImpactUnit,
            Notes = d.Notes,
            ReferralPostId = d.ReferralPostId,
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<DonationDto>> Create([FromBody] DonationCreateDto dto)
    {
        if (!User.IsInRole(AuthRoles.Admin))
        {
            var email = User.Identity?.Name;
            var supporter = await _context.Supporters.FirstOrDefaultAsync(s => s.Email == email);
            if (supporter == null || dto.SupporterId != supporter.SupporterId) return Forbid();
        }

        var entity = new Donation
        {
            SupporterId = dto.SupporterId,
            DonationType = dto.DonationType,
            DonationDate = dto.DonationDate,
            IsRecurring = dto.IsRecurring,
            CampaignName = dto.CampaignName,
            ChannelSource = dto.ChannelSource,
            CurrencyCode = dto.CurrencyCode,
            Amount = dto.Amount,
            EstimatedValue = dto.EstimatedValue,
            ImpactUnit = dto.ImpactUnit,
            Notes = dto.Notes,
            ReferralPostId = dto.ReferralPostId,
        };

        _context.Donations.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.DonationId }, new DonationDto
        {
            DonationId = entity.DonationId,
            SupporterId = entity.SupporterId,
            DonationType = entity.DonationType,
            DonationDate = entity.DonationDate,
            IsRecurring = entity.IsRecurring,
            CampaignName = entity.CampaignName,
            ChannelSource = entity.ChannelSource,
            CurrencyCode = entity.CurrencyCode,
            Amount = entity.Amount,
            EstimatedValue = entity.EstimatedValue,
            ImpactUnit = entity.ImpactUnit,
            Notes = entity.Notes,
            ReferralPostId = entity.ReferralPostId,
        });
    }

    [Authorize(Policy = AuthPolicies.AdminOnly)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] DonationCreateDto dto)
    {
        var entity = await _context.Donations.FindAsync(id);
        if (entity == null) return NotFound();

        entity.SupporterId = dto.SupporterId;
        entity.DonationType = dto.DonationType;
        entity.DonationDate = dto.DonationDate;
        entity.IsRecurring = dto.IsRecurring;
        entity.CampaignName = dto.CampaignName;
        entity.ChannelSource = dto.ChannelSource;
        entity.CurrencyCode = dto.CurrencyCode;
        entity.Amount = dto.Amount;
        entity.EstimatedValue = dto.EstimatedValue;
        entity.ImpactUnit = dto.ImpactUnit;
        entity.Notes = dto.Notes;
        entity.ReferralPostId = dto.ReferralPostId;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Policy = AuthPolicies.AdminOnly)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.Donations.FindAsync(id);
        if (entity == null) return NotFound();

        _context.Donations.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
