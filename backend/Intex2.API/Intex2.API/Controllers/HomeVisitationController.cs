using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;

namespace Intex2.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeVisitationController : ControllerBase
    {
        private readonly Intex2104Context _context;

        public HomeVisitationController(Intex2104Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HomeVisitationDto>>> GetAll(
            [FromQuery] string? visitType,
            [FromQuery] int? residentId,
            [FromQuery] string? socialWorker)
        {
            var query = _context.HomeVisitations.AsQueryable();

            if (!string.IsNullOrEmpty(visitType))
                query = query.Where(h => h.VisitType == visitType);

            if (residentId.HasValue)
                query = query.Where(h => h.ResidentId == residentId.Value);

            if (!string.IsNullOrEmpty(socialWorker))
                query = query.Where(h => h.SocialWorker != null && h.SocialWorker.Contains(socialWorker));

            var results = await query
                .OrderByDescending(h => h.VisitDate)
                .Select(h => new HomeVisitationDto
                {
                    VisitationId = h.VisitationId,
                    ResidentId = h.ResidentId,
                    VisitDate = h.VisitDate,
                    SocialWorker = h.SocialWorker,
                    VisitType = h.VisitType,
                    LocationVisited = h.LocationVisited,
                    FamilyMembersPresent = h.FamilyMembersPresent,
                    Purpose = h.Purpose,
                    Observations = h.Observations,
                    FamilyCooperationLevel = h.FamilyCooperationLevel,
                    SafetyConcernsNoted = h.SafetyConcernsNoted,
                    FollowUpNeeded = h.FollowUpNeeded,
                    FollowUpNotes = h.FollowUpNotes,
                    VisitOutcome = h.VisitOutcome,
                })
                .ToListAsync();

            return Ok(results);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HomeVisitationDto>> GetById(int id)
        {
            var h = await _context.HomeVisitations.FindAsync(id);
            if (h == null)
                return NotFound();

            return Ok(new HomeVisitationDto
            {
                VisitationId = h.VisitationId,
                ResidentId = h.ResidentId,
                VisitDate = h.VisitDate,
                SocialWorker = h.SocialWorker,
                VisitType = h.VisitType,
                LocationVisited = h.LocationVisited,
                FamilyMembersPresent = h.FamilyMembersPresent,
                Purpose = h.Purpose,
                Observations = h.Observations,
                FamilyCooperationLevel = h.FamilyCooperationLevel,
                SafetyConcernsNoted = h.SafetyConcernsNoted,
                FollowUpNeeded = h.FollowUpNeeded,
                FollowUpNotes = h.FollowUpNotes,
                VisitOutcome = h.VisitOutcome,
            });
        }

        [HttpPost]
        public async Task<ActionResult<HomeVisitationDto>> Create([FromBody] HomeVisitationCreateDto dto)
        {
            var entity = new HomeVisitation
            {
                ResidentId = dto.ResidentId,
                VisitDate = dto.VisitDate,
                SocialWorker = dto.SocialWorker,
                VisitType = dto.VisitType,
                LocationVisited = dto.LocationVisited,
                FamilyMembersPresent = dto.FamilyMembersPresent,
                Purpose = dto.Purpose,
                Observations = dto.Observations,
                FamilyCooperationLevel = dto.FamilyCooperationLevel,
                SafetyConcernsNoted = dto.SafetyConcernsNoted,
                FollowUpNeeded = dto.FollowUpNeeded,
                FollowUpNotes = dto.FollowUpNotes,
                VisitOutcome = dto.VisitOutcome,
            };

            _context.HomeVisitations.Add(entity);
            await _context.SaveChangesAsync();

            var result = new HomeVisitationDto
            {
                VisitationId = entity.VisitationId,
                ResidentId = entity.ResidentId,
                VisitDate = entity.VisitDate,
                SocialWorker = entity.SocialWorker,
                VisitType = entity.VisitType,
                LocationVisited = entity.LocationVisited,
                FamilyMembersPresent = entity.FamilyMembersPresent,
                Purpose = entity.Purpose,
                Observations = entity.Observations,
                FamilyCooperationLevel = entity.FamilyCooperationLevel,
                SafetyConcernsNoted = entity.SafetyConcernsNoted,
                FollowUpNeeded = entity.FollowUpNeeded,
                FollowUpNotes = entity.FollowUpNotes,
                VisitOutcome = entity.VisitOutcome,
            };

            return CreatedAtAction(nameof(GetById), new { id = entity.VisitationId }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] HomeVisitationCreateDto dto)
        {
            var entity = await _context.HomeVisitations.FindAsync(id);
            if (entity == null)
                return NotFound();

            entity.ResidentId = dto.ResidentId;
            entity.VisitDate = dto.VisitDate;
            entity.SocialWorker = dto.SocialWorker;
            entity.VisitType = dto.VisitType;
            entity.LocationVisited = dto.LocationVisited;
            entity.FamilyMembersPresent = dto.FamilyMembersPresent;
            entity.Purpose = dto.Purpose;
            entity.Observations = dto.Observations;
            entity.FamilyCooperationLevel = dto.FamilyCooperationLevel;
            entity.SafetyConcernsNoted = dto.SafetyConcernsNoted;
            entity.FollowUpNeeded = dto.FollowUpNeeded;
            entity.FollowUpNotes = dto.FollowUpNotes;
            entity.VisitOutcome = dto.VisitOutcome;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.HomeVisitations.FindAsync(id);
            if (entity == null)
                return NotFound();

            _context.HomeVisitations.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
