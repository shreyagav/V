using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
        public IHostingEnvironment HostingEnv { get; }
        public HomeController(IHostingEnvironment env)
        {
            HostingEnv = env;
        }

        [HttpGet]
        public IActionResult RedirectIndex()
        {
            return new PhysicalFileResult(
                Path.Combine(HostingEnv.ContentRootPath, "ClientApp", "public", "index.html"),
                "text/html"
            );
        }
    }
}