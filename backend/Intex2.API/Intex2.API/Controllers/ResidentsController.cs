using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class ResidentsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public ResidentsController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ResidentDto>>> GetAll(
        [FromQuery] int? safehouseId,
        [FromQuery] string? caseStatus,
        [FromQuery] string? riskLevel,
        [FromQuery] string? socialWorker)
    {
        var query = _context.Residents.Where(r => r.ResidentId != null && r.CaseControlNo != null).AsQueryable();

        if (safehouseId.HasValue)
            query = query.Where(r => r.SafehouseId == safehouseId.Value);

        if (!string.IsNullOrEmpty(caseStatus))
            query = query.Where(r => r.CaseStatus == caseStatus);

        if (!string.IsNullOrEmpty(riskLevel))
            query = query.Where(r => r.CurrentRiskLevel == riskLevel);

        if (!string.IsNullOrEmpty(socialWorker))
            query = query.Where(r => r.AssignedSocialWorker != null && r.AssignedSocialWorker.Contains(socialWorker));

        var results = await query
            .Select(r => new ResidentDto
            {
                ResidentId = r.ResidentId,
                CaseControlNo = r.CaseControlNo,
                InternalCode = r.InternalCode,
                SafehouseId = r.SafehouseId,
                CaseStatus = r.CaseStatus,
                Sex = r.Sex,
                DateOfBirth = r.DateOfBirth,
                BirthStatus = r.BirthStatus,
                PlaceOfBirth = r.PlaceOfBirth,
                Religion = r.Religion,
                CaseCategory = r.CaseCategory,
                SubCatOrphaned = r.SubCatOrphaned,
                SubCatTrafficked = r.SubCatTrafficked,
                SubCatChildLabor = r.SubCatChildLabor,
                SubCatPhysicalAbuse = r.SubCatPhysicalAbuse,
                SubCatSexualAbuse = r.SubCatSexualAbuse,
                SubCatOsaec = r.SubCatOsaec,
                SubCatCicl = r.SubCatCicl,
                SubCatAtRisk = r.SubCatAtRisk,
                SubCatStreetChild = r.SubCatStreetChild,
                SubCatChildWithHiv = r.SubCatChildWithHiv,
                IsPwd = r.IsPwd,
                PwdType = r.PwdType,
                HasSpecialNeeds = r.HasSpecialNeeds,
                SpecialNeedsDiagnosis = r.SpecialNeedsDiagnosis,
                FamilyIs4ps = r.FamilyIs4ps,
                FamilySoloParent = r.FamilySoloParent,
                FamilyIndigenous = r.FamilyIndigenous,
                FamilyParentPwd = r.FamilyParentPwd,
                FamilyInformalSettler = r.FamilyInformalSettler,
                DateOfAdmission = r.DateOfAdmission,
                AgeUponAdmission = r.AgeUponAdmission,
                PresentAge = r.PresentAge,
                LengthOfStay = r.LengthOfStay,
                ReferralSource = r.ReferralSource,
                ReferringAgencyPerson = r.ReferringAgencyPerson,
                DateColbRegistered = r.DateColbRegistered,
                DateColbObtained = r.DateColbObtained,
                AssignedSocialWorker = r.AssignedSocialWorker,
                InitialCaseAssessment = r.InitialCaseAssessment,
                DateCaseStudyPrepared = r.DateCaseStudyPrepared,
                ReintegrationType = r.ReintegrationType,
                ReintegrationStatus = r.ReintegrationStatus,
                InitialRiskLevel = r.InitialRiskLevel,
                CurrentRiskLevel = r.CurrentRiskLevel,
                DateEnrolled = r.DateEnrolled,
                DateClosed = r.DateClosed,
                CreatedAt = r.CreatedAt,
                NotesRestricted = r.NotesRestricted,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ResidentDto>> GetById(int id)
    {
        var r = await _context.Residents.FindAsync(id);
        if (r == null) return NotFound();

        return Ok(new ResidentDto
        {
            ResidentId = r.ResidentId,
            CaseControlNo = r.CaseControlNo,
            InternalCode = r.InternalCode,
            SafehouseId = r.SafehouseId,
            CaseStatus = r.CaseStatus,
            Sex = r.Sex,
            DateOfBirth = r.DateOfBirth,
            BirthStatus = r.BirthStatus,
            PlaceOfBirth = r.PlaceOfBirth,
            Religion = r.Religion,
            CaseCategory = r.CaseCategory,
            SubCatOrphaned = r.SubCatOrphaned,
            SubCatTrafficked = r.SubCatTrafficked,
            SubCatChildLabor = r.SubCatChildLabor,
            SubCatPhysicalAbuse = r.SubCatPhysicalAbuse,
            SubCatSexualAbuse = r.SubCatSexualAbuse,
            SubCatOsaec = r.SubCatOsaec,
            SubCatCicl = r.SubCatCicl,
            SubCatAtRisk = r.SubCatAtRisk,
            SubCatStreetChild = r.SubCatStreetChild,
            SubCatChildWithHiv = r.SubCatChildWithHiv,
            IsPwd = r.IsPwd,
            PwdType = r.PwdType,
            HasSpecialNeeds = r.HasSpecialNeeds,
            SpecialNeedsDiagnosis = r.SpecialNeedsDiagnosis,
            FamilyIs4ps = r.FamilyIs4ps,
            FamilySoloParent = r.FamilySoloParent,
            FamilyIndigenous = r.FamilyIndigenous,
            FamilyParentPwd = r.FamilyParentPwd,
            FamilyInformalSettler = r.FamilyInformalSettler,
            DateOfAdmission = r.DateOfAdmission,
            AgeUponAdmission = r.AgeUponAdmission,
            PresentAge = r.PresentAge,
            LengthOfStay = r.LengthOfStay,
            ReferralSource = r.ReferralSource,
            ReferringAgencyPerson = r.ReferringAgencyPerson,
            DateColbRegistered = r.DateColbRegistered,
            DateColbObtained = r.DateColbObtained,
            AssignedSocialWorker = r.AssignedSocialWorker,
            InitialCaseAssessment = r.InitialCaseAssessment,
            DateCaseStudyPrepared = r.DateCaseStudyPrepared,
            ReintegrationType = r.ReintegrationType,
            ReintegrationStatus = r.ReintegrationStatus,
            InitialRiskLevel = r.InitialRiskLevel,
            CurrentRiskLevel = r.CurrentRiskLevel,
            DateEnrolled = r.DateEnrolled,
            DateClosed = r.DateClosed,
            CreatedAt = r.CreatedAt,
            NotesRestricted = r.NotesRestricted,
        });
    }

    [HttpPost]
    public async Task<ActionResult<ResidentDto>> Create([FromBody] ResidentCreateDto dto)
    {
        var entity = new Resident
        {
            CaseControlNo = dto.CaseControlNo,
            InternalCode = dto.InternalCode,
            SafehouseId = dto.SafehouseId,
            CaseStatus = dto.CaseStatus,
            Sex = dto.Sex,
            DateOfBirth = dto.DateOfBirth,
            BirthStatus = dto.BirthStatus,
            PlaceOfBirth = dto.PlaceOfBirth,
            Religion = dto.Religion,
            CaseCategory = dto.CaseCategory,
            SubCatOrphaned = dto.SubCatOrphaned,
            SubCatTrafficked = dto.SubCatTrafficked,
            SubCatChildLabor = dto.SubCatChildLabor,
            SubCatPhysicalAbuse = dto.SubCatPhysicalAbuse,
            SubCatSexualAbuse = dto.SubCatSexualAbuse,
            SubCatOsaec = dto.SubCatOsaec,
            SubCatCicl = dto.SubCatCicl,
            SubCatAtRisk = dto.SubCatAtRisk,
            SubCatStreetChild = dto.SubCatStreetChild,
            SubCatChildWithHiv = dto.SubCatChildWithHiv,
            IsPwd = dto.IsPwd,
            PwdType = dto.PwdType,
            HasSpecialNeeds = dto.HasSpecialNeeds,
            SpecialNeedsDiagnosis = dto.SpecialNeedsDiagnosis,
            FamilyIs4ps = dto.FamilyIs4ps,
            FamilySoloParent = dto.FamilySoloParent,
            FamilyIndigenous = dto.FamilyIndigenous,
            FamilyParentPwd = dto.FamilyParentPwd,
            FamilyInformalSettler = dto.FamilyInformalSettler,
            DateOfAdmission = dto.DateOfAdmission,
            AgeUponAdmission = dto.AgeUponAdmission,
            ReferralSource = dto.ReferralSource,
            ReferringAgencyPerson = dto.ReferringAgencyPerson,
            AssignedSocialWorker = dto.AssignedSocialWorker,
            InitialCaseAssessment = dto.InitialCaseAssessment,
            ReintegrationType = dto.ReintegrationType,
            ReintegrationStatus = dto.ReintegrationStatus,
            InitialRiskLevel = dto.InitialRiskLevel,
            CurrentRiskLevel = dto.CurrentRiskLevel,
        };

        _context.Residents.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.ResidentId }, new ResidentDto
        {
            ResidentId = entity.ResidentId,
            CaseControlNo = entity.CaseControlNo,
            InternalCode = entity.InternalCode,
            SafehouseId = entity.SafehouseId,
            CaseStatus = entity.CaseStatus,
            AssignedSocialWorker = entity.AssignedSocialWorker,
            CurrentRiskLevel = entity.CurrentRiskLevel,
            DateOfAdmission = entity.DateOfAdmission,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ResidentCreateDto dto)
    {
        var entity = await _context.Residents.FindAsync(id);
        if (entity == null) return NotFound();

        entity.CaseControlNo = dto.CaseControlNo;
        entity.InternalCode = dto.InternalCode;
        entity.SafehouseId = dto.SafehouseId;
        entity.CaseStatus = dto.CaseStatus;
        entity.Sex = dto.Sex;
        entity.DateOfBirth = dto.DateOfBirth;
        entity.BirthStatus = dto.BirthStatus;
        entity.PlaceOfBirth = dto.PlaceOfBirth;
        entity.Religion = dto.Religion;
        entity.CaseCategory = dto.CaseCategory;
        entity.SubCatOrphaned = dto.SubCatOrphaned;
        entity.SubCatTrafficked = dto.SubCatTrafficked;
        entity.SubCatChildLabor = dto.SubCatChildLabor;
        entity.SubCatPhysicalAbuse = dto.SubCatPhysicalAbuse;
        entity.SubCatSexualAbuse = dto.SubCatSexualAbuse;
        entity.SubCatOsaec = dto.SubCatOsaec;
        entity.SubCatCicl = dto.SubCatCicl;
        entity.SubCatAtRisk = dto.SubCatAtRisk;
        entity.SubCatStreetChild = dto.SubCatStreetChild;
        entity.SubCatChildWithHiv = dto.SubCatChildWithHiv;
        entity.IsPwd = dto.IsPwd;
        entity.PwdType = dto.PwdType;
        entity.HasSpecialNeeds = dto.HasSpecialNeeds;
        entity.SpecialNeedsDiagnosis = dto.SpecialNeedsDiagnosis;
        entity.FamilyIs4ps = dto.FamilyIs4ps;
        entity.FamilySoloParent = dto.FamilySoloParent;
        entity.FamilyIndigenous = dto.FamilyIndigenous;
        entity.FamilyParentPwd = dto.FamilyParentPwd;
        entity.FamilyInformalSettler = dto.FamilyInformalSettler;
        entity.DateOfAdmission = dto.DateOfAdmission;
        entity.AgeUponAdmission = dto.AgeUponAdmission;
        entity.ReferralSource = dto.ReferralSource;
        entity.ReferringAgencyPerson = dto.ReferringAgencyPerson;
        entity.AssignedSocialWorker = dto.AssignedSocialWorker;
        entity.InitialCaseAssessment = dto.InitialCaseAssessment;
        entity.ReintegrationType = dto.ReintegrationType;
        entity.ReintegrationStatus = dto.ReintegrationStatus;
        entity.InitialRiskLevel = dto.InitialRiskLevel;
        entity.CurrentRiskLevel = dto.CurrentRiskLevel;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.Residents.FindAsync(id);
        if (entity == null) return NotFound();

        _context.Residents.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
