namespace Intex2.API.DTOs;

public class DonationAllocationDto
{
    public int? AllocationId { get; set; }
    public int? DonationId { get; set; }
    public int? SafehouseId { get; set; }
    public string? ProgramArea { get; set; }
    public double? AmountAllocated { get; set; }
    public string? AllocationDate { get; set; }
    public string? AllocationNotes { get; set; }
}

public class DonationAllocationCreateDto
{
    public int? DonationId { get; set; }
    public int? SafehouseId { get; set; }
    public string? ProgramArea { get; set; }
    public double? AmountAllocated { get; set; }
    public string? AllocationDate { get; set; }
    public string? AllocationNotes { get; set; }
}
