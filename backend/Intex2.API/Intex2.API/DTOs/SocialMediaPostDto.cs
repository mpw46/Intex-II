namespace Intex2.API.DTOs;

public class SocialMediaPostDto
{
    public int? PostId { get; set; }
    public string? Platform { get; set; }
    public string? PlatformPostId { get; set; }
    public string? PostUrl { get; set; }
    public string? CreatedAt { get; set; }
    public string? DayOfWeek { get; set; }
    public int? PostHour { get; set; }
    public string? PostType { get; set; }
    public string? MediaType { get; set; }
    public string? Caption { get; set; }
    public string? Hashtags { get; set; }
    public int? NumHashtags { get; set; }
    public int? MentionsCount { get; set; }
    public string? HasCallToAction { get; set; }
    public string? CallToActionType { get; set; }
    public string? ContentTopic { get; set; }
    public string? SentimentTone { get; set; }
    public int? CaptionLength { get; set; }
    public string? FeaturesResidentStory { get; set; }
    public string? CampaignName { get; set; }
    public string? IsBoosted { get; set; }
    public string? BoostBudgetPhp { get; set; }
    public int? Impressions { get; set; }
    public int? Reach { get; set; }
    public int? Likes { get; set; }
    public int? Comments { get; set; }
    public int? Shares { get; set; }
    public int? Saves { get; set; }
    public int? ClickThroughs { get; set; }
    public string? VideoViews { get; set; }
    public double? EngagementRate { get; set; }
    public int? ProfileVisits { get; set; }
    public int? DonationReferrals { get; set; }
    public double? EstimatedDonationValuePhp { get; set; }
    public int? FollowerCountAtPost { get; set; }
    public string? WatchTimeSeconds { get; set; }
    public string? AvgViewDurationSeconds { get; set; }
    public string? SubscriberCountAtPost { get; set; }
    public string? Forwards { get; set; }
}
