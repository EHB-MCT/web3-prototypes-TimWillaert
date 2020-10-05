using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _NETCore.Models;

namespace NETCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ApiController : ControllerBase
    {
        private readonly ApiContext _context;

        public ApiController(ApiContext context)
        {
            _context = context;
        }

        [HttpGet("multiply")]
        public IActionResult getMultiply([FromQuery]long number)
        {
            long result = number * number;
            return new OkObjectResult(new Result{result = result});
        }
    }
}
