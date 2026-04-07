namespace Intex2.API.DTOs;

public class EducationRecordDto
{
    public int? EducationRecordId { get; set; }
    public int? ResidentId { get; set; }
    public string? RecordDate { get; set; }
    public string? EducationLevel { get; set; }
    public string? SchoolName { get; set; }
    public string? EnrollmentStatus { get; set; }
    public double? AttendanceRate { get; set; }
    public double? ProgressPercent { get; set; }
    public string? CompletionStatus { get; set; }
    public string? Notes { get; set; }
}

public class EducationRecordCreateDto
{
    public int? ResidentId { get; set; }
    public string? RecordDate { get; set; }
    public string? EducationLevel { get; set; }
    public string? SchoolName { get; set; }
    public string? EnrollmentStatus { get; set; }
    public double? AttendanceRate { get; set; }
    public double? ProgressPercent { get; set; }
    public string? CompletionStatus { get; set; }
    public string? Notes { get; set; }
}
