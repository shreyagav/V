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
        public IWebHostEnvironment HostingEnv { get; }
        public HomeController(IWebHostEnvironment env)
        {
            HostingEnv = env;
        }
        [HttpGet]
        public IActionResult Index()
        {
            //return new PhysicalFileResult(
            //    Path.Combine(HostingEnv.ContentRootPath, "ClientApp", "public", "index.html"),
            //    "text/html"
            //);
            return new ContentResult() { Content = HostingEnv.ContentRootPath + "::" + HostingEnv.WebRootPath, ContentType = "text/html" };
        }
        //[HttpGet]
        //public IActionResult RedirectIndex()
        //{
        //    return new PhysicalFileResult(
        //        Path.Combine(HostingEnv.ContentRootPath, "ClientApp", "public", "index.html"),
        //        "text/html"
        //    );
        //}
    }
}