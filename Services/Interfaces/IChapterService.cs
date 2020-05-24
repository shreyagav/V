using Models;
using Models.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services.Interfaces
{
    public interface IChapterService
    {
        SiteListItemView[] SiteListItemView();
        EventSite Get(int id);
        EventSite Set(EventSite eventSite);
        Region[] AllRegions();
        Region GetRegion(int id);
        Region SaveRegion(Region region);
        void DeleteRegion(Region region);
    }
}
