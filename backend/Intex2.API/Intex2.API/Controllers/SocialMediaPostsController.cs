using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;
using Intex2.API.DTOs;

namespace Intex2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SocialMediaPostsController : ControllerBase
{
    private readonly Intex2104Context _context;

    public SocialMediaPostsController(Intex2104Context context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SocialMediaPostDto>>> GetAll(
        [FromQuery] string? platform,
        [FromQuery] string? contentTopic,
        [FromQuery] int? limit)
    {
        var query = _context.SocialMediaPosts.AsQueryable();

        if (!string.IsNullOrEmpty(platform))
            query = query.Where(p => p.Platform == platform);

        if (!string.IsNullOrEmpty(contentTopic))
            query = query.Where(p => p.ContentTopic == contentTopic);

        query = query.OrderByDescending(p => p.CreatedAt);

        if (limit.HasValue && limit.Value > 0)
            query = query.Take(limit.Value);

        var results = await query
            .Select(p => new SocialMediaPostDto
            {
                PostId = p.PostId,
                Platform = p.Platform,
                PlatformPostId = p.PlatformPostId,
                PostUrl = p.PostUrl,
                CreatedAt = p.CreatedAt,
                DayOfWeek = p.DayOfWeek,
                PostHour = p.PostHour,
                PostType = p.PostType,
                MediaType = p.MediaType,
                Caption = p.Caption,
                Hashtags = p.Hashtags,
                NumHashtags = p.NumHashtags,
                MentionsCount = p.MentionsCount,
                HasCallToAction = p.HasCallToAction,
                CallToActionType = p.CallToActionType,
                ContentTopic = p.ContentTopic,
                SentimentTone = p.SentimentTone,
                CaptionLength = p.CaptionLength,
                FeaturesResidentStory = p.FeaturesResidentStory,
                CampaignName = p.CampaignName,
                IsBoosted = p.IsBoosted,
                BoostBudgetPhp = p.BoostBudgetPhp,
                Impressions = p.Impressions,
                Reach = p.Reach,
                Likes = p.Likes,
                Comments = p.Comments,
                Shares = p.Shares,
                Saves = p.Saves,
                ClickThroughs = p.ClickThroughs,
                VideoViews = p.VideoViews,
                EngagementRate = p.EngagementRate,
                ProfileVisits = p.ProfileVisits,
                DonationReferrals = p.DonationReferrals,
                EstimatedDonationValuePhp = p.EstimatedDonationValuePhp,
                FollowerCountAtPost = p.FollowerCountAtPost,
                WatchTimeSeconds = p.WatchTimeSeconds,
                AvgViewDurationSeconds = p.AvgViewDurationSeconds,
                SubscriberCountAtPost = p.SubscriberCountAtPost,
                Forwards = p.Forwards,
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SocialMediaPostDto>> GetById(int id)
    {
        var p = await _context.SocialMediaPosts.FindAsync(id);
        if (p == null) return NotFound();

        return Ok(new SocialMediaPostDto
        {
            PostId = p.PostId,
            Platform = p.Platform,
            PlatformPostId = p.PlatformPostId,
            PostUrl = p.PostUrl,
            CreatedAt = p.CreatedAt,
            DayOfWeek = p.DayOfWeek,
            PostHour = p.PostHour,
            PostType = p.PostType,
            MediaType = p.MediaType,
            Caption = p.Caption,
            Hashtags = p.Hashtags,
            NumHashtags = p.NumHashtags,
            MentionsCount = p.MentionsCount,
            HasCallToAction = p.HasCallToAction,
            CallToActionType = p.CallToActionType,
            ContentTopic = p.ContentTopic,
            SentimentTone = p.SentimentTone,
            CaptionLength = p.CaptionLength,
            FeaturesResidentStory = p.FeaturesResidentStory,
            CampaignName = p.CampaignName,
            IsBoosted = p.IsBoosted,
            BoostBudgetPhp = p.BoostBudgetPhp,
            Impressions = p.Impressions,
            Reach = p.Reach,
            Likes = p.Likes,
            Comments = p.Comments,
            Shares = p.Shares,
            Saves = p.Saves,
            ClickThroughs = p.ClickThroughs,
            VideoViews = p.VideoViews,
            EngagementRate = p.EngagementRate,
            ProfileVisits = p.ProfileVisits,
            DonationReferrals = p.DonationReferrals,
            EstimatedDonationValuePhp = p.EstimatedDonationValuePhp,
            FollowerCountAtPost = p.FollowerCountAtPost,
            WatchTimeSeconds = p.WatchTimeSeconds,
            AvgViewDurationSeconds = p.AvgViewDurationSeconds,
            SubscriberCountAtPost = p.SubscriberCountAtPost,
            Forwards = p.Forwards,
        });
    }
}
