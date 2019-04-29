using Models.Dto;
using Services.Data;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Services
{
    public class ChapterService : IChapterService
    {
        private readonly ApplicationDbContext _ctx;
        public ChapterService(ApplicationDbContext ctx)
        {
            _ctx = ctx;
        }

        public SiteListItemView[] SiteListItemView()
        {
            var sites = _ctx.EventSites.ToArray();
            var temp = (from e in sites
                        group e by e.GroupId into ge
                        select new SiteListItemView() { Id = ge.Key , Chapters = ge.Select(a => new SiteItem() { Id = a.Id, Name = a.Name, Type = SiteListItemType.Site }).ToArray() }).ToArray();
            foreach(SiteListItemView t in temp)
            {
                var b = sites.First(a => a.GroupId == t.Id);
                t.State = b.GroupName;
                
            }
            return temp.OrderBy(a=>a.State).ToArray();
        }
    }
}
