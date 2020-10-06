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
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Hosting;

namespace NETCore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ApiController : ControllerBase
    {
        private readonly ApiContext _context;

        private IHostingEnvironment _env;

        public ApiController(ApiContext context, IHostingEnvironment env)
        {
            _context = context;
            _env = env;
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

        // [HttpGet("index")]
        // public ActionResult<String> Index()
        // {
        //     var webRoot = _env.WebRootPath;
        //     var fileContent = System.IO.File.ReadAllText(webRoot + "/index.html");
        //     return fileContent;
        // }

        [HttpPost("save")]
        public async Task Save([FromQuery]string input)
        {
            await using (StreamWriter writer = System.IO.File.AppendText("log.txt"))
            {
                writer.WriteLine(input.Trim('"'));
            }
        }

    }
}
