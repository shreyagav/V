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
    }
}
