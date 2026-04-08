using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class EducationRecordsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public EducationRecordsController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EducationRecordDto>>> GetAll([FromQuery] int? residentId)
    {
        var query = _context.EducationRecords.AsQueryable();

        if (residentId.HasValue)
            query = query.Where(e => e.ResidentId == residentId.Value);

        var results = await query
            .OrderByDescending(e => e.RecordDate)
            .Select(e => new EducationRecordDto
            {
                EducationRecordId = e.EducationRecordId,
                ResidentId = e.ResidentId,
                RecordDate = e.RecordDate,
                EducationLevel = e.EducationLevel,
                SchoolName = e.SchoolName,
                EnrollmentStatus = e.EnrollmentStatus,
                AttendanceRate = e.AttendanceRate,
                ProgressPercent = e.ProgressPercent,
                CompletionStatus = e.CompletionStatus,
                Notes = e.Notes,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EducationRecordDto>> GetById(int id)
    {
        var e = await _context.EducationRecords.FindAsync(id);
        if (e == null) return NotFound();

        return Ok(new EducationRecordDto
        {
            EducationRecordId = e.EducationRecordId,
            ResidentId = e.ResidentId,
            RecordDate = e.RecordDate,
            EducationLevel = e.EducationLevel,
            SchoolName = e.SchoolName,
            EnrollmentStatus = e.EnrollmentStatus,
            AttendanceRate = e.AttendanceRate,
            ProgressPercent = e.ProgressPercent,
            CompletionStatus = e.CompletionStatus,
            Notes = e.Notes,
        });
    }

    [HttpPost]
    public async Task<ActionResult<EducationRecordDto>> Create([FromBody] EducationRecordCreateDto dto)
    {
        var entity = new EducationRecord
        {
            ResidentId = dto.ResidentId,
            RecordDate = dto.RecordDate,
            EducationLevel = dto.EducationLevel,
            SchoolName = dto.SchoolName,
            EnrollmentStatus = dto.EnrollmentStatus,
            AttendanceRate = dto.AttendanceRate,
            ProgressPercent = dto.ProgressPercent,
            CompletionStatus = dto.CompletionStatus,
            Notes = dto.Notes,
        };

        _context.EducationRecords.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.EducationRecordId }, new EducationRecordDto
        {
            EducationRecordId = entity.EducationRecordId,
            ResidentId = entity.ResidentId,
            RecordDate = entity.RecordDate,
            EducationLevel = entity.EducationLevel,
            SchoolName = entity.SchoolName,
            EnrollmentStatus = entity.EnrollmentStatus,
            AttendanceRate = entity.AttendanceRate,
            ProgressPercent = entity.ProgressPercent,
            CompletionStatus = entity.CompletionStatus,
            Notes = entity.Notes,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] EducationRecordCreateDto dto)
    {
        var entity = await _context.EducationRecords.FindAsync(id);
        if (entity == null) return NotFound();

        entity.ResidentId = dto.ResidentId;
        entity.RecordDate = dto.RecordDate;
        entity.EducationLevel = dto.EducationLevel;
        entity.SchoolName = dto.SchoolName;
        entity.EnrollmentStatus = dto.EnrollmentStatus;
        entity.AttendanceRate = dto.AttendanceRate;
        entity.ProgressPercent = dto.ProgressPercent;
        entity.CompletionStatus = dto.CompletionStatus;
        entity.Notes = dto.Notes;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.EducationRecords.FindAsync(id);
        if (entity == null) return NotFound();

        _context.EducationRecords.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
