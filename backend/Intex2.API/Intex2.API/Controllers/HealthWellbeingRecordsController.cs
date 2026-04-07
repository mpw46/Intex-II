using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthWellbeingRecordsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public HealthWellbeingRecordsController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HealthWellbeingRecordDto>>> GetAll([FromQuery] int? residentId)
    {
        var query = _context.HealthWellbeingRecords.AsQueryable();

        if (residentId.HasValue)
            query = query.Where(h => h.ResidentId == residentId.Value);

        var results = await query
            .OrderByDescending(h => h.RecordDate)
            .Select(h => new HealthWellbeingRecordDto
            {
                HealthRecordId = h.HealthRecordId,
                ResidentId = h.ResidentId,
                RecordDate = h.RecordDate,
                GeneralHealthScore = h.GeneralHealthScore,
                NutritionScore = h.NutritionScore,
                SleepQualityScore = h.SleepQualityScore,
                EnergyLevelScore = h.EnergyLevelScore,
                HeightCm = h.HeightCm,
                WeightKg = h.WeightKg,
                Bmi = h.Bmi,
                MedicalCheckupDone = h.MedicalCheckupDone,
                DentalCheckupDone = h.DentalCheckupDone,
                PsychologicalCheckupDone = h.PsychologicalCheckupDone,
                Notes = h.Notes,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HealthWellbeingRecordDto>> GetById(int id)
    {
        var h = await _context.HealthWellbeingRecords.FindAsync(id);
        if (h == null) return NotFound();

        return Ok(new HealthWellbeingRecordDto
        {
            HealthRecordId = h.HealthRecordId,
            ResidentId = h.ResidentId,
            RecordDate = h.RecordDate,
            GeneralHealthScore = h.GeneralHealthScore,
            NutritionScore = h.NutritionScore,
            SleepQualityScore = h.SleepQualityScore,
            EnergyLevelScore = h.EnergyLevelScore,
            HeightCm = h.HeightCm,
            WeightKg = h.WeightKg,
            Bmi = h.Bmi,
            MedicalCheckupDone = h.MedicalCheckupDone,
            DentalCheckupDone = h.DentalCheckupDone,
            PsychologicalCheckupDone = h.PsychologicalCheckupDone,
            Notes = h.Notes,
        });
    }

    [HttpPost]
    public async Task<ActionResult<HealthWellbeingRecordDto>> Create([FromBody] HealthWellbeingRecordCreateDto dto)
    {
        var entity = new HealthWellbeingRecord
        {
            ResidentId = dto.ResidentId,
            RecordDate = dto.RecordDate,
            GeneralHealthScore = dto.GeneralHealthScore,
            NutritionScore = dto.NutritionScore,
            SleepQualityScore = dto.SleepQualityScore,
            EnergyLevelScore = dto.EnergyLevelScore,
            HeightCm = dto.HeightCm,
            WeightKg = dto.WeightKg,
            Bmi = dto.Bmi,
            MedicalCheckupDone = dto.MedicalCheckupDone,
            DentalCheckupDone = dto.DentalCheckupDone,
            PsychologicalCheckupDone = dto.PsychologicalCheckupDone,
            Notes = dto.Notes,
        };

        _context.HealthWellbeingRecords.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.HealthRecordId }, new HealthWellbeingRecordDto
        {
            HealthRecordId = entity.HealthRecordId,
            ResidentId = entity.ResidentId,
            RecordDate = entity.RecordDate,
            GeneralHealthScore = entity.GeneralHealthScore,
            NutritionScore = entity.NutritionScore,
            SleepQualityScore = entity.SleepQualityScore,
            EnergyLevelScore = entity.EnergyLevelScore,
            HeightCm = entity.HeightCm,
            WeightKg = entity.WeightKg,
            Bmi = entity.Bmi,
            MedicalCheckupDone = entity.MedicalCheckupDone,
            DentalCheckupDone = entity.DentalCheckupDone,
            PsychologicalCheckupDone = entity.PsychologicalCheckupDone,
            Notes = entity.Notes,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] HealthWellbeingRecordCreateDto dto)
    {
        var entity = await _context.HealthWellbeingRecords.FindAsync(id);
        if (entity == null) return NotFound();

        entity.ResidentId = dto.ResidentId;
        entity.RecordDate = dto.RecordDate;
        entity.GeneralHealthScore = dto.GeneralHealthScore;
        entity.NutritionScore = dto.NutritionScore;
        entity.SleepQualityScore = dto.SleepQualityScore;
        entity.EnergyLevelScore = dto.EnergyLevelScore;
        entity.HeightCm = dto.HeightCm;
        entity.WeightKg = dto.WeightKg;
        entity.Bmi = dto.Bmi;
        entity.MedicalCheckupDone = dto.MedicalCheckupDone;
        entity.DentalCheckupDone = dto.DentalCheckupDone;
        entity.PsychologicalCheckupDone = dto.PsychologicalCheckupDone;
        entity.Notes = dto.Notes;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.HealthWellbeingRecords.FindAsync(id);
        if (entity == null) return NotFound();

        _context.HealthWellbeingRecords.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
