namespace Intex2.API.DTOs;

public class InKindDonationItemDto
{
    public int? ItemId { get; set; }
    public int? DonationId { get; set; }
    public string? ItemName { get; set; }
    public string? ItemCategory { get; set; }
    public int? Quantity { get; set; }
    public string? UnitOfMeasure { get; set; }
    public double? EstimatedUnitValue { get; set; }
    public string? IntendedUse { get; set; }
    public string? ReceivedCondition { get; set; }
}

public class InKindDonationItemCreateDto
{
    public int? DonationId { get; set; }
    public string? ItemName { get; set; }
    public string? ItemCategory { get; set; }
    public int? Quantity { get; set; }
    public string? UnitOfMeasure { get; set; }
    public double? EstimatedUnitValue { get; set; }
    public string? IntendedUse { get; set; }
    public string? ReceivedCondition { get; set; }
}
