using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MlDonorImpactController : ControllerBase
{
    private readonly Intex2104Context _context;

    public MlDonorImpactController(Intex2104Context context)
    {
        _context = context;
    }

    /// <summary>
    /// Returns predicted program area allocations for the authenticated donor.
    /// Admins receive all donors' predictions; donors receive only their own.
    /// </summary>
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<MlDonorImpactDto>>> Get()
    {
        IQueryable<MlDonorImpactPrediction> query =
            _context.MlDonorImpactPredictions.Where(p => p.IsCurrent);

        if (!User.IsInRole(AuthRoles.Admin))
        {
            var email = User.Identity?.Name;
            var supporter = await _context.Supporters
                .FirstOrDefaultAsync(s => s.Email == email);
            if (supporter == null) return Ok(Array.Empty<MlDonorImpactDto>());
            query = query.Where(p => p.SupporterId == supporter.SupporterId);
        }

        var results = await query
            .OrderByDescending(p => p.PredictedPct)
            .Select(p => new MlDonorImpactDto
            {
                ProgramArea  = p.ProgramArea,
                PredictedPct = p.PredictedPct,
                ModelVersion = p.ModelVersion,
                ScoredAt     = p.ScoredAt,
            })
            .ToListAsync();

        return Ok(results);
    }
}
