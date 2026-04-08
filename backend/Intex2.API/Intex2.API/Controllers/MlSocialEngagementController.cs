using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class MlSocialEngagementController : ControllerBase
{
    private readonly Intex2104Context _context;

    public MlSocialEngagementController(Intex2104Context context)
    {
        _context = context;
    }

    /// <summary>
    /// Returns top engagement drivers from the latest ML run.
    /// Optional modelType filter: OLS | DecisionTree (default: OLS).
    /// Returns top 10 drivers ordered by rank.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MlSocialEngagementDriverDto>>> GetAll(
        [FromQuery] string modelType = "OLS")
    {
        var results = await _context.MlSocialEngagementDrivers
            .Where(d => d.IsCurrent && d.ModelType == modelType)
            .OrderBy(d => d.Rank)
            .Take(10)
            .Select(d => new MlSocialEngagementDriverDto
            {
                Rank         = d.Rank,
                FeatureName  = d.FeatureName,
                Importance   = d.Importance,
                Direction    = d.Direction,
                ModelType    = d.ModelType,
                ScoredAt     = d.ScoredAt,
                ModelVersion = d.ModelVersion,
            })
            .ToListAsync();

        return Ok(results);
    }
}
