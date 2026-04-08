using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class MlResidentRiskController : ControllerBase
{
    private readonly Intex2104Context _context;

    public MlResidentRiskController(Intex2104Context context)
    {
        _context = context;
    }

    /// <summary>
    /// Returns current ML risk scores for all active residents.
    /// Optionally filtered by riskLevel (High | Medium | Low).
    /// Includes caseControlNo and safehouse name via join.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MlResidentRiskDto>>> GetAll(
        [FromQuery] string? riskLevel)
    {
        var query =
            from score in _context.MlResidentRiskScores
            join resident in _context.Residents on score.ResidentId equals (resident.ResidentId ?? 0)
            join safehouse in _context.Safehouses on resident.SafehouseId equals safehouse.SafehouseId into shJoin
            from sh in shJoin.DefaultIfEmpty()
            where score.IsCurrent
            select new MlResidentRiskDto
            {
                ResidentId       = score.ResidentId,
                CaseControlNo    = resident.CaseControlNo,
                SafehouseName    = sh.Name,
                RiskProbability  = score.RiskProbability,
                RiskLevel        = score.RiskLevel,
                AsOfDate         = score.AsOfDate.ToString("yyyy-MM-dd"),
                ScoredAt         = score.ScoredAt,
                ModelVersion     = score.ModelVersion,
            };

        if (!string.IsNullOrEmpty(riskLevel))
            query = query.Where(r => r.RiskLevel == riskLevel);

        var results = await query.OrderByDescending(r => r.RiskProbability).ToListAsync();
        return Ok(results);
    }
}
