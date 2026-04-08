using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MlDonorRiskController : ControllerBase
{
    private readonly Intex2104Context _context;

    public MlDonorRiskController(Intex2104Context context)
    {
        _context = context;
    }

    /// <summary>
    /// Returns current ML lapse-risk scores for all supporters.
    /// Optionally filtered by riskTier (High | Medium | Low).
    /// Includes displayName via join to supporters table.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MlDonorRiskDto>>> GetAll(
        [FromQuery] string? riskTier)
    {
        var query =
            from score in _context.MlDonorRiskScores
            join supporter in _context.Supporters on score.SupporterId equals (supporter.SupporterId ?? 0)
            where score.IsCurrent
            select new MlDonorRiskDto
            {
                SupporterId      = score.SupporterId,
                DisplayName      = supporter.DisplayName,
                LapseProbability = score.LapseProbability,
                RiskTier         = score.RiskTier,
                AsOfDate         = score.AsOfDate.ToString("yyyy-MM-dd"),
                ScoredAt         = score.ScoredAt,
                ModelVersion     = score.ModelVersion,
            };

        if (!string.IsNullOrEmpty(riskTier))
            query = query.Where(r => r.RiskTier == riskTier);

        var results = await query.OrderByDescending(r => r.LapseProbability).ToListAsync();
        return Ok(results);
    }
}
