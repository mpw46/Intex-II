using Microsoft.AspNetCore.Mvc;
using Intex2.API.Data;

namespace Intex2.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeVisitationController : ControllerBase
    {
        private Intex2104Context _intexContext;

        public HomeVisitationController(Intex2104Context temp)
        {
            _intexContext = temp;
        }

        [HttpGet("GetHomeVisitations")]
        public IActionResult Get()
        {
            var query = _intexContext.HomeVisitations.AsQueryable();

            var homeVisitations = query.ToList();

            return Ok(homeVisitations);
        }
    }
}