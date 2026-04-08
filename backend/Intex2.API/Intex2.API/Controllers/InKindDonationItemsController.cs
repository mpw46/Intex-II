using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class InKindDonationItemsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public InKindDonationItemsController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InKindDonationItemDto>>> GetAll(
        [FromQuery] int? donationId,
        [FromQuery] string? itemCategory)
    {
        var query = _context.InKindDonationItems.AsQueryable();

        if (donationId.HasValue)
            query = query.Where(i => i.DonationId == donationId.Value);

        if (!string.IsNullOrEmpty(itemCategory))
            query = query.Where(i => i.ItemCategory == itemCategory);

        var results = await query
            .Select(i => new InKindDonationItemDto
            {
                ItemId = i.ItemId,
                DonationId = i.DonationId,
                ItemName = i.ItemName,
                ItemCategory = i.ItemCategory,
                Quantity = i.Quantity,
                UnitOfMeasure = i.UnitOfMeasure,
                EstimatedUnitValue = i.EstimatedUnitValue,
                IntendedUse = i.IntendedUse,
                ReceivedCondition = i.ReceivedCondition,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InKindDonationItemDto>> GetById(int id)
    {
        var i = await _context.InKindDonationItems.FindAsync(id);
        if (i == null) return NotFound();

        return Ok(new InKindDonationItemDto
        {
            ItemId = i.ItemId,
            DonationId = i.DonationId,
            ItemName = i.ItemName,
            ItemCategory = i.ItemCategory,
            Quantity = i.Quantity,
            UnitOfMeasure = i.UnitOfMeasure,
            EstimatedUnitValue = i.EstimatedUnitValue,
            IntendedUse = i.IntendedUse,
            ReceivedCondition = i.ReceivedCondition,
        });
    }

    [HttpPost]
    public async Task<ActionResult<InKindDonationItemDto>> Create([FromBody] InKindDonationItemCreateDto dto)
    {
        var entity = new InKindDonationItem
        {
            DonationId = dto.DonationId,
            ItemName = dto.ItemName,
            ItemCategory = dto.ItemCategory,
            Quantity = dto.Quantity,
            UnitOfMeasure = dto.UnitOfMeasure,
            EstimatedUnitValue = dto.EstimatedUnitValue,
            IntendedUse = dto.IntendedUse,
            ReceivedCondition = dto.ReceivedCondition,
        };

        _context.InKindDonationItems.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.ItemId }, new InKindDonationItemDto
        {
            ItemId = entity.ItemId,
            DonationId = entity.DonationId,
            ItemName = entity.ItemName,
            ItemCategory = entity.ItemCategory,
            Quantity = entity.Quantity,
            UnitOfMeasure = entity.UnitOfMeasure,
            EstimatedUnitValue = entity.EstimatedUnitValue,
            IntendedUse = entity.IntendedUse,
            ReceivedCondition = entity.ReceivedCondition,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] InKindDonationItemCreateDto dto)
    {
        var entity = await _context.InKindDonationItems.FindAsync(id);
        if (entity == null) return NotFound();

        entity.DonationId = dto.DonationId;
        entity.ItemName = dto.ItemName;
        entity.ItemCategory = dto.ItemCategory;
        entity.Quantity = dto.Quantity;
        entity.UnitOfMeasure = dto.UnitOfMeasure;
        entity.EstimatedUnitValue = dto.EstimatedUnitValue;
        entity.IntendedUse = dto.IntendedUse;
        entity.ReceivedCondition = dto.ReceivedCondition;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.InKindDonationItems.FindAsync(id);
        if (entity == null) return NotFound();

        _context.InKindDonationItems.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
