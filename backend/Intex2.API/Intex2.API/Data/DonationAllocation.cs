using System;
using System.Collections.Generic;

namespace Intex2.API.Data;

public partial class DonationAllocation
{
    public int? AllocationId { get; set; }

    public int? DonationId { get; set; }

    public int? SafehouseId { get; set; }

    public string? ProgramArea { get; set; }

    public double? AmountAllocated { get; set; }

    public string? AllocationDate { get; set; }

    public string? AllocationNotes { get; set; }
}
