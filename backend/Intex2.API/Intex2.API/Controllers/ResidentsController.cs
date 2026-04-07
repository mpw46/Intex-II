using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex2.API.Data;

namespace Intex2.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResidentsController : ControllerBase
    {
        private readonly Intex2104Context _context;

        public ResidentsController(Intex2104Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var residents = await _context.Residents
                .Select(r => new
                {
                    r.ResidentId,
                    r.CaseStatus,
                    r.AssignedSocialWorker,
                    r.SafehouseId,
                })
                .ToListAsync();

            return Ok(residents);
        }
    }
}
