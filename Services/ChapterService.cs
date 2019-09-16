using Microsoft.EntityFrameworkCore;
using Models;
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

        public EventSite Get(int id)
        {
            var temp = _ctx.EventSites.Include(a => a.GOVT).Include(a => a.Main).Include(a => a.National).Include(a => a.Outreach).Include(a => a.Coordinator).FirstOrDefault(a => a.Id == id);
            if (temp.GOVT == null)
                temp.GOVT = new Contact();
            if (temp.Coordinator == null)
                temp.Coordinator = new Contact();
            if (temp.Main == null)
                temp.Main = new Contact();
            if (temp.National == null)
                temp.National = new Contact();
            if (temp.Outreach == null)
                temp.Outreach = new Contact();
            return temp;
        }

        public EventSite Set(EventSite eventSite)
        {
            EventSite site = null;
            if (eventSite.Id > 0)
            {
                site = _ctx.EventSites.FirstOrDefault(a => a.Id == eventSite.Id);
            }
            else
            {
                site = new EventSite();
            }
            
            site.Name = eventSite.Name;
            site.GroupId = eventSite.GroupId;
            site.GroupName = eventSite.GroupName;
            site.Description = eventSite.Description;
            site.SecurityClearance = eventSite.SecurityClearance;
            site.PoolRental = eventSite.PoolRental;
            site.AllowEverybody = eventSite.AllowEverybody;
            if(site.Id == 0)
            {
                _ctx.EventSites.Add(site);
                _ctx.SaveChanges();
            }

            site.GOVTId = UpdateContact(eventSite.GOVT);
            site.NationalId = UpdateContact(eventSite.National);
            site.CoordinatorId = UpdateContact(eventSite.Coordinator);
            site.MainId = UpdateContact(eventSite.Main);
            site.OutreachId = UpdateContact(eventSite.Outreach);
            _ctx.SaveChanges();
            return eventSite;
        }

        private int? UpdateContact(Contact source)
        {
            if(String.IsNullOrEmpty(source.Email)&& String.IsNullOrEmpty(source.Name) && String.IsNullOrEmpty(source.Phone))
            {
                return null;
            }
            var dest = _ctx.Contacts.FirstOrDefault(a => a.Id == source.Id);
            bool create = false;
            if(dest == null)
            {
                dest = new Contact();
                create = true;
            }
            dest.Email = source.Email;
            dest.Name = source.Name;
            dest.Phone = source.Phone;
            if(create)
            {
                _ctx.Contacts.Add(dest);
            }
            return dest.Id;
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
