using System;
using System.Collections.Generic;

namespace Intex2.API.Data;

public partial class Donation
{
    public int? DonationId { get; set; }

    public int? SupporterId { get; set; }

    public string? DonationType { get; set; }

    public string? DonationDate { get; set; }

    public string? IsRecurring { get; set; }

    public string? CampaignName { get; set; }

    public string? ChannelSource { get; set; }

    public string? CurrencyCode { get; set; }

    public string? Amount { get; set; }

    public double? EstimatedValue { get; set; }

    public string? ImpactUnit { get; set; }

    public string? Notes { get; set; }

    public string? ReferralPostId { get; set; }
}
