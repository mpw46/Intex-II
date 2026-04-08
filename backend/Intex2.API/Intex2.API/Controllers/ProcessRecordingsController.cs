using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class ProcessRecordingsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public ProcessRecordingsController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProcessRecordingDto>>> GetAll(
        [FromQuery] int? residentId,
        [FromQuery] string? socialWorker,
        [FromQuery] string? sessionType)
    {
        var query = _context.ProcessRecordings.AsQueryable();

        if (residentId.HasValue)
            query = query.Where(p => p.ResidentId == residentId.Value);

        if (!string.IsNullOrEmpty(socialWorker))
            query = query.Where(p => p.SocialWorker != null && p.SocialWorker.Contains(socialWorker));

        if (!string.IsNullOrEmpty(sessionType))
            query = query.Where(p => p.SessionType == sessionType);

        var results = await query
            .OrderByDescending(p => p.SessionDate)
            .Select(p => new ProcessRecordingDto
            {
                RecordingId = p.RecordingId,
                ResidentId = p.ResidentId,
                SessionDate = p.SessionDate,
                SocialWorker = p.SocialWorker,
                SessionType = p.SessionType,
                SessionDurationMinutes = p.SessionDurationMinutes,
                EmotionalStateObserved = p.EmotionalStateObserved,
                EmotionalStateEnd = p.EmotionalStateEnd,
                SessionNarrative = p.SessionNarrative,
                InterventionsApplied = p.InterventionsApplied,
                FollowUpActions = p.FollowUpActions,
                ProgressNoted = p.ProgressNoted,
                ConcernsFlagged = p.ConcernsFlagged,
                ReferralMade = p.ReferralMade,
                NotesRestricted = p.NotesRestricted,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProcessRecordingDto>> GetById(int id)
    {
        var p = await _context.ProcessRecordings.FindAsync(id);
        if (p == null) return NotFound();

        return Ok(new ProcessRecordingDto
        {
            RecordingId = p.RecordingId,
            ResidentId = p.ResidentId,
            SessionDate = p.SessionDate,
            SocialWorker = p.SocialWorker,
            SessionType = p.SessionType,
            SessionDurationMinutes = p.SessionDurationMinutes,
            EmotionalStateObserved = p.EmotionalStateObserved,
            EmotionalStateEnd = p.EmotionalStateEnd,
            SessionNarrative = p.SessionNarrative,
            InterventionsApplied = p.InterventionsApplied,
            FollowUpActions = p.FollowUpActions,
            ProgressNoted = p.ProgressNoted,
            ConcernsFlagged = p.ConcernsFlagged,
            ReferralMade = p.ReferralMade,
            NotesRestricted = p.NotesRestricted,
        });
    }

    [HttpPost]
    public async Task<ActionResult<ProcessRecordingDto>> Create([FromBody] ProcessRecordingCreateDto dto)
    {
        var entity = new ProcessRecording
        {
            ResidentId = dto.ResidentId,
            SessionDate = dto.SessionDate,
            SocialWorker = dto.SocialWorker,
            SessionType = dto.SessionType,
            SessionDurationMinutes = dto.SessionDurationMinutes,
            EmotionalStateObserved = dto.EmotionalStateObserved,
            EmotionalStateEnd = dto.EmotionalStateEnd,
            SessionNarrative = dto.SessionNarrative,
            InterventionsApplied = dto.InterventionsApplied,
            FollowUpActions = dto.FollowUpActions,
            ProgressNoted = dto.ProgressNoted,
            ConcernsFlagged = dto.ConcernsFlagged,
            ReferralMade = dto.ReferralMade,
            NotesRestricted = dto.NotesRestricted,
        };

        _context.ProcessRecordings.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.RecordingId }, new ProcessRecordingDto
        {
            RecordingId = entity.RecordingId,
            ResidentId = entity.ResidentId,
            SessionDate = entity.SessionDate,
            SocialWorker = entity.SocialWorker,
            SessionType = entity.SessionType,
            SessionDurationMinutes = entity.SessionDurationMinutes,
            EmotionalStateObserved = entity.EmotionalStateObserved,
            EmotionalStateEnd = entity.EmotionalStateEnd,
            SessionNarrative = entity.SessionNarrative,
            InterventionsApplied = entity.InterventionsApplied,
            FollowUpActions = entity.FollowUpActions,
            ProgressNoted = entity.ProgressNoted,
            ConcernsFlagged = entity.ConcernsFlagged,
            ReferralMade = entity.ReferralMade,
            NotesRestricted = entity.NotesRestricted,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProcessRecordingCreateDto dto)
    {
        var entity = await _context.ProcessRecordings.FindAsync(id);
        if (entity == null) return NotFound();

        entity.ResidentId = dto.ResidentId;
        entity.SessionDate = dto.SessionDate;
        entity.SocialWorker = dto.SocialWorker;
        entity.SessionType = dto.SessionType;
        entity.SessionDurationMinutes = dto.SessionDurationMinutes;
        entity.EmotionalStateObserved = dto.EmotionalStateObserved;
        entity.EmotionalStateEnd = dto.EmotionalStateEnd;
        entity.SessionNarrative = dto.SessionNarrative;
        entity.InterventionsApplied = dto.InterventionsApplied;
        entity.FollowUpActions = dto.FollowUpActions;
        entity.ProgressNoted = dto.ProgressNoted;
        entity.ConcernsFlagged = dto.ConcernsFlagged;
        entity.ReferralMade = dto.ReferralMade;
        entity.NotesRestricted = dto.NotesRestricted;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.ProcessRecordings.FindAsync(id);
        if (entity == null) return NotFound();

        _context.ProcessRecordings.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
