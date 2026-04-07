using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicImpactSnapshotsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public PublicImpactSnapshotsController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PublicImpactSnapshotDto>>> GetAll([FromQuery] bool? publishedOnly)
    {
        var query = _context.PublicImpactSnapshots.AsQueryable();

        if (publishedOnly == true)
            query = query.Where(s => s.IsPublished == "True" || s.IsPublished == "true" || s.IsPublished == "1");

        var results = await query
            .OrderByDescending(s => s.SnapshotDate)
            .Select(s => new PublicImpactSnapshotDto
            {
                SnapshotId = s.SnapshotId,
                SnapshotDate = s.SnapshotDate,
                Headline = s.Headline,
                SummaryText = s.SummaryText,
                MetricPayloadJson = s.MetricPayloadJson,
                IsPublished = s.IsPublished,
                PublishedAt = s.PublishedAt,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PublicImpactSnapshotDto>> GetById(int id)
    {
        var s = await _context.PublicImpactSnapshots.FindAsync(id);
        if (s == null) return NotFound();

        return Ok(new PublicImpactSnapshotDto
        {
            SnapshotId = s.SnapshotId,
            SnapshotDate = s.SnapshotDate,
            Headline = s.Headline,
            SummaryText = s.SummaryText,
            MetricPayloadJson = s.MetricPayloadJson,
            IsPublished = s.IsPublished,
            PublishedAt = s.PublishedAt,
        });
    }
}
