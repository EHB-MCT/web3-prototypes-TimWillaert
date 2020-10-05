using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _NETCore.Models;
using System.IO;
using System.Net.Http;

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
        public IActionResult Multiply([FromQuery]long number)
        {
            long result = number * number;
            return new OkObjectResult(new Result{result = result});
        }

        [HttpGet("index")]
        public ContentResult Index()
        {
            return new ContentResult 
            {
                ContentType = "text/html",
                Content = "<h1>Hey</h1><h2>Hoi</h2>"
            };
        }

        [HttpPost("save")]
        public async Task Save([FromQuery]string input)
        {
            using (StreamWriter writer = System.IO.File.AppendText("log.txt"))
            {
                writer.WriteLine(input.Trim('"'));
            }
        }

    }
}
