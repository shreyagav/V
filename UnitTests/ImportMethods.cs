using Microsoft.AspNetCore.Identity;
using Models.Context;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace UnitTests
{
    public partial class UserServiceTest
    {
        //private static List<XmlNode> ImportEventTypes(XmlNodeList nodes, ICalendarEventService service)
        //{
        //    List<XmlNode> failed = new List<XmlNode>();
        //    foreach (XmlNode t in nodes)
        //    {
        //        Models.CalendarEventType newType = new Models.CalendarEventType();
        //        try
        //        {
        //            foreach (XmlNode node in t.ChildNodes)
        //            {
        //                string name = node.Attributes["name"].Value;
        //                switch (name)
        //                {
        //                    case "code_id":
        //                        newType.OldId = int.Parse(node.InnerText);
        //                        break;
        //                    case "code_desc":
        //                        newType.Title = node.InnerText;
        //                        break;
        //                }
        //            }
        //            switch (newType.OldId)
        //            {
        //                case 29:
        //                    newType.Color = "#fe7b22";
        //                    break;
        //                case 28:
        //                    newType.Color = "#8bba19";
        //                    break;
        //                case 100:
        //                    newType.Color = "#efb135";
        //                    break;
        //                case 27:
        //                    newType.Color = "#3aa6a0";
        //                    break;
        //                case 90:
        //                    newType.Color = "#AB4189";
        //                    break;
        //                case 86:
        //                    newType.Color = "#047884";
        //                    break;
        //                case 30:
        //                    newType.Color = "#d16c35";
        //                    break;
        //                case 98:
        //                    newType.Color = "#f577a3";
        //                    break;
        //                case 80:
        //                    newType.Color = "#794068";
        //                    break;
        //                default:
        //                    newType.Color = "#666666";
        //                    break;
        //            }

        //            service.AddEventType(newType);
        //        }
        //        catch (Exception ex)
        //        {
        //            failed.Add(t);
        //        }
        //    }
        //    return failed;
        //}

        //static List<XmlNode> ImportSites(XmlNodeList sites, ICalendarEventService service)
        //{
        //    List<XmlNode> failed = new List<XmlNode>();
        //    foreach (XmlNode site in sites)
        //    {
        //        Models.EventSite evtSite = new Models.EventSite();
        //        Models.Contact main = new Models.Contact();
        //        Models.Contact govt = new Models.Contact();
        //        Models.Contact vol = new Models.Contact();
        //        Models.Contact outreach = new Models.Contact();
        //        Models.Contact national = new Models.Contact();
        //        try
        //        {
        //            foreach (XmlNode node in site.ChildNodes)
        //            {
        //                string name = node.Attributes["name"].Value;
        //                try
        //                {
        //                    switch (name)
        //                    {
        //                        case "site_id":
        //                            evtSite.OldId = int.Parse(node.InnerText);
        //                            break;
        //                        case "site_name":
        //                            evtSite.Name = node.InnerText;
        //                            break;
        //                        case "site_type_id":
        //                            evtSite.TypeId = int.Parse(node.InnerText);
        //                            break;
        //                        case "site_staff_type":
        //                            evtSite.StaffTypeId = int.Parse(node.InnerText);
        //                            break;
        //                        case "site_comments":
        //                            evtSite.Description = node.InnerText;
        //                            break;
        //                        case "site_main_email":
        //                            main.Email = node.InnerText;
        //                            break;
        //                        case "site_main_name":
        //                            main.Name = node.InnerText;
        //                            break;
        //                        case "site_main_phone":
        //                            main.Phone = node.InnerText;
        //                            break;
        //                        case "site_govt_email":
        //                            govt.Email = node.InnerText;
        //                            break;
        //                        case "site_govt_name":
        //                            govt.Name = node.InnerText;
        //                            break;
        //                        case "site_govt_phone":
        //                            govt.Phone = node.InnerText;
        //                            break;
        //                        case "site_vol_coord_email":
        //                            vol.Email = node.InnerText;
        //                            break;
        //                        case "site_vol_coord_name":
        //                            vol.Name = node.InnerText;
        //                            break;
        //                        case "site_vol_coord_phone":
        //                            vol.Phone = node.InnerText;
        //                            break;
        //                        case "site_national_contact_email":
        //                            national.Email = node.InnerText;
        //                            break;
        //                        case "site_national_contact_name":
        //                            national.Name = node.InnerText;
        //                            break;
        //                        case "site_national_contact_phone":
        //                            national.Phone = node.InnerText;
        //                            break;
        //                        case "site_outreach_email":
        //                            outreach.Email = node.InnerText;
        //                            break;
        //                        case "site_outreach_name":
        //                            outreach.Name = node.InnerText;
        //                            break;
        //                        case "site_outreach_phone":
        //                            outreach.Phone = node.InnerText;
        //                            break;
        //                        case "site_sec_clearance":
        //                            evtSite.SecurityClearance = node.InnerText;
        //                            break;
        //                        case "site_start_date":
        //                            evtSite.Originated = DateTime.Parse(node.InnerText);
        //                            break;
        //                        case "site_status_id":
        //                            evtSite.SiteStatusId = int.Parse(node.InnerText);
        //                            break;
        //                        case "site_pool_rental":
        //                            evtSite.PoolRental = node.InnerText == "Y";
        //                            break;
        //                        case "site_group_id":
        //                            evtSite.SiteGroupId = int.Parse(node.InnerText);
        //                            break;
        //                    }
        //                }
        //                catch (Exception ex)
        //                {

        //                }
        //            }
        //            if (!string.IsNullOrEmpty(main.Email))
        //            {
        //                var temp = service.GetContactByEmail(main.Email);
        //                if (temp != null)
        //                {
        //                    evtSite.Main = temp;
        //                }
        //                else
        //                {
        //                    service.AddContact(main);
        //                    evtSite.Main = main;
        //                }
        //            }
        //            if (!string.IsNullOrEmpty(vol.Email))
        //            {
        //                var temp = service.GetContactByEmail(vol.Email);
        //                if (temp != null)
        //                {
        //                    evtSite.Coordinator = temp;
        //                }
        //                else
        //                {
        //                    service.AddContact(vol);
        //                    evtSite.Coordinator = vol;
        //                }
        //            }
        //            if (!string.IsNullOrEmpty(govt.Email))
        //            {
        //                var temp = service.GetContactByEmail(govt.Email);
        //                if (temp != null)
        //                {
        //                    evtSite.GOVT = temp;
        //                }
        //                else
        //                {
        //                    service.AddContact(govt);
        //                    evtSite.GOVT = govt;
        //                }
        //            }
        //            if (!string.IsNullOrEmpty(national.Email))
        //            {
        //                var temp = service.GetContactByEmail(national.Email);
        //                if (temp != null)
        //                {
        //                    evtSite.National = temp;
        //                }
        //                else
        //                {
        //                    service.AddContact(national);
        //                    evtSite.National = national;
        //                }
        //            }
        //            if (!string.IsNullOrEmpty(outreach.Email))
        //            {
        //                var temp = service.GetContactByEmail(outreach.Email);
        //                if (temp != null)
        //                {
        //                    evtSite.Outreach = temp;
        //                }
        //                else
        //                {
        //                    service.AddContact(outreach);
        //                    evtSite.Outreach = outreach;
        //                }
        //            }
        //            service.AddEventSite(evtSite);
        //        }
        //        catch (Exception ex)
        //        {
        //            failed.Add(site);
        //        }
        //    }

        //    return failed;
        //}

        //private static List<XmlNode> ImportEvents(XmlNodeList nodes, ICalendarEventService service, IImportService import)
        //{
        //    var eventTypes = service.AllEventTypes();
        //    var failed = new List<XmlNode>();
        //    var events = new List<CalendarEvent>();
        //    foreach (XmlNode t in nodes)
        //    {
        //        try
        //        {
        //            var temp = ImportEvent(t, service, eventTypes);
        //            if (temp.EventTypeId == 100) continue;
        //            import.ImportEvent(temp);
        //            events.Add(temp);
        //        }
        //        catch (Exception ex)
        //        {
        //            Console.WriteLine(ex.Message);
        //            if (ex.InnerException != null)
        //            {
        //                Console.WriteLine(ex.InnerException.Message);
        //            }
        //            failed.Add(t);
        //        }
        //        //if (events.Count == 1000)
        //        //{
        //        //    import.ImportEvents(events);
        //        //    events.Clear();
        //        //}
        //    }
        //    //import.ImportEvents(events);
        //    return failed;
        //}
        //private static CalendarEvent ImportEvent(XmlNode t, ICalendarEventService service, CalendarEventType[] eventTypes)
        //{
        //    Models.CalendarEvent evt = new Models.CalendarEvent();
        //    string name = string.Empty;
        //    int month = 0, year = 0, day = 0, createdById = 0, modifiedById = 0, eventType = 0, eventSiteId = 0;
        //    string modifiedStr = "";
        //    foreach (XmlNode node in t.ChildNodes)
        //    {
        //        name = node.Attributes["name"].Value;
        //        switch (name)
        //        {
        //            case "event_id":
        //                evt.OldId = int.Parse(node.InnerText);
        //                break;
        //            case "event_title":
        //                evt.Name = node.InnerText;
        //                break;
        //            case "event_desc":
        //                evt.Description = node.InnerText;
        //                break;
        //            case "event_report":
        //                evt.Report = node.InnerText;
        //                break;
        //            case "event_type":
        //                eventType = int.Parse(node.InnerText);
        //                break;
        //            case "event_added_by_id":
        //                createdById = int.Parse(node.InnerText);
        //                break;
        //            case "event_modified_by_id":
        //                modifiedById = int.Parse(node.InnerText);
        //                break;
        //            case "event_max":
        //                evt.MaxCapacity = int.Parse(node.InnerText);
        //                break;
        //            case "event_count":
        //                evt.OldEventCount = int.Parse(node.InnerText);
        //                break;
        //            case "event_multi_order":
        //                evt.OldEventMultiOrder = int.Parse(node.InnerText);
        //                break;
        //            case "event_repeat":
        //                evt.OldEventRepeat = node.InnerText != "NULL" ? int.Parse(node.InnerText) : 0;
        //                break;
        //            case "event_site_id":
        //                eventSiteId = int.Parse(node.InnerText);
        //                break;
        //            case "event_day":
        //                day = int.Parse(node.InnerText);
        //                break;
        //            case "event_year":
        //                year = int.Parse(node.InnerText);
        //                break;
        //            case "event_month":
        //                month = int.Parse(node.InnerText);
        //                break;
        //            case "event_time":
        //                evt.StartTime = string.IsNullOrEmpty(node.InnerText) ? 800 : int.Parse(node.InnerText);
        //                break;
        //            case "event_end_time":
        //                evt.EndTime = string.IsNullOrEmpty(node.InnerText) ? 2000 : int.Parse(node.InnerText);
        //                break;
        //            case "event_fee":
        //                evt.Fee = decimal.Parse(node.InnerText);
        //                break;
        //            case "event_date_added":
        //                evt.Created = DateTime.Parse(node.InnerText);
        //                break;
        //            case "event_date_updated":
        //                modifiedStr = node.InnerText;
        //                break;
        //            case "event_visibility":
        //                evt.OldEventVisibility = node.InnerText[0];
        //                break;
        //            case "event_date_deleted":
        //                evt.Deleted = node.InnerText == "0000-00-00" ? null : (DateTime?)DateTime.Parse(node.InnerText);
        //                break;
        //            case "event_date_canceled":
        //                evt.Canceled = node.InnerText == "0000-00-00" ? null : (DateTime?)DateTime.Parse(node.InnerText);
        //                break;
        //        }
        //    }
        //    evt.Date = new DateTime(year == 0 ? 2010 : year, month, day);
        //    evt.Modified = modifiedStr == "0000-00-00" ? evt.Created : DateTime.Parse(modifiedStr);
        //    evt.Site = service.GetEventSite(eventSiteId);
        //    evt.CreatedById = service.GetUserByOldId(createdById)?.Id;
        //    if (modifiedById != 0)
        //        evt.ModifiedById = modifiedById != createdById ? service.GetUserByOldId(modifiedById)?.Id : evt.CreatedById;
        //    evt.EventTypeId = eventTypes.FirstOrDefault(a => a.OldId == eventType).Id;

        //    return evt;
        //}
        //public async static Task<XmlNode[]> ImportUsersNew(XmlNodeList nodes, IImportService service)
        //{
        //    List<TRRUser> users = new List<TRRUser>();
        //    Dictionary<int, XmlNode> nodesProcessed = new Dictionary<int, XmlNode>();
        //    List<TRRUser> usersProcessed = new List<TRRUser>();
        //    var sites = service.GetContext().EventSites.ToArray();
        //    foreach (XmlNode user in nodes)
        //    {
        //        TRRUser usr = new TRRUser();
        //        foreach (XmlNode node in user.ChildNodes)
        //        {
        //            string name = node.Attributes["name"].Value;
        //            try
        //            {
        //                switch (name)
        //                {
        //                    case "user_email":
        //                        usr.Email = node.InnerText;
        //                        usr.NormalizedEmail = usr.Email.ToUpper();
        //                        break;
        //                    case "user_login":
        //                        usr.UserName = SanitizeUserName(node.InnerText);
        //                        usr.NormalizedUserName = usr.UserName.ToUpper();
        //                        usr.OldLogin = node.InnerText;
        //                        break;
        //                    case "user_password":
        //                        usr.OldPassword = node.InnerText;
        //                        usr.PasswordHash = node.InnerText.Substring(1);
        //                        break;
        //                    case "user_first_name":
        //                        usr.FirstName = node.InnerText;
        //                        break;
        //                    case "user_last_name":
        //                        usr.LastName = node.InnerText;
        //                        break;
        //                    case "user_id":
        //                        usr.OldId = int.Parse(node.InnerText);
        //                        nodesProcessed.Add(usr.OldId, user);
        //                        break;
        //                    case "user_phone":
        //                        usr.PhoneNumber = node.InnerText;
        //                        break;
        //                    case "user_alt_phone":
        //                        usr.AltPhone = node.InnerText;
        //                        break;
        //                    case "user_address":
        //                        usr.Address = node.InnerText;
        //                        break;

        //                    case "user_dob":
        //                        usr.DateOfBirth = DateTime.Parse(node.InnerText);
        //                        break;
        //                    case "user_site_id":
        //                        usr.OldSiteId = int.Parse(node.InnerText);
        //                        break;
        //                    case "user_type":
        //                        usr.OldType = (TRRUserType)int.Parse(node.InnerText);
        //                        break;
        //                    case "user_gender":
        //                        usr.Gender = node.InnerText.Length == 0 ? ' ' : node.InnerText[0];
        //                        break;
        //                    case "user_travel_time":
        //                        usr.TravelTime = node.InnerText;
        //                        break;
        //                    case "user_join_date":
        //                        usr.JoinDate = DateTime.Parse(node.InnerText);
        //                        break;
        //                    case "user_sponsored_by":
        //                        usr.OldSponsoredById = int.Parse(node.InnerText);
        //                        break;
        //                    case "user_auth_level":
        //                        usr.OldAuthLevel = int.Parse(node.InnerText);
        //                        break;
        //                    case "user_active":
        //                        usr.Active = node.InnerText[0] == 'Y';
        //                        break;
        //                    case "user_deactive_cause":
        //                        usr.DeactiveCause = node.InnerText;
        //                        break;
        //                    case "user_branch_id":
        //                        usr.BranchId = int.Parse(node.InnerText);
        //                        break;
        //                    case "user_status":
        //                        usr.OldStatus = int.Parse(node.InnerText);
        //                        break;
        //                    case "user_medical":
        //                        usr.Medical = (Medical)int.Parse(node.InnerText);
        //                        break;
        //                    case "user_date_injured":
        //                        usr.DateInjured = DateTime.Parse(node.InnerText);
        //                        break;
        //                    case "user_release_signed":
        //                        usr.ReleaseSigned = node.InnerText == "Y";
        //                        break;
        //                    case "user_liability_signed":
        //                        usr.LiabilitySigned = node.InnerText == "Y";
        //                        break;
        //                    case "user_comments":
        //                        usr.Comments = node.InnerText;
        //                        break;
        //                }
        //            }
        //            catch (Exception ex)
        //            {

        //            }

        //        }
        //        usr.SecurityStamp = DateTime.Now.ToString();
        //        usr.SiteId = sites.Where(a => a.OldId == usr.OldSiteId).FirstOrDefault()?.Id;
        //        var exists = usersProcessed.FirstOrDefault(a => String.Compare( a.UserName,usr.UserName,true)==0);
        //        if (exists == null)
        //        {
        //            exists = users.FirstOrDefault(a => String.Compare(a.UserName, usr.UserName, true) == 0);
        //            if(exists == null)
        //                users.Add(usr);
        //        }
        //        if (users.Count == 1000)
        //        {
        //            await service.ImportUsers(users);
        //            usersProcessed.AddRange(users);
        //            users = new List<TRRUser>();
        //        }
        //    }
        //    await service.ImportUsers(users);
        //    var allUsers = service.GetContext().Users.ToArray();
        //    return nodesProcessed.Where(a => allUsers.FirstOrDefault(b => b.OldId == a.Key) == null).Select(a => a.Value).ToArray();

        //}
        //private static List<XmlNode> ImportUserOptions(XmlNodeList nodes, IImportService service)
        //{
        //    List<XmlNode> failed = new List<XmlNode>();
        //    Option[] all = service.GetAllOptions();
        //    TRRUser[] allUsers = service.GetAllUsers();
        //    List<UserOption> wholeList = new List<UserOption>();
        //    List<UserOption> list = new List<UserOption>();
        //    foreach (XmlNode ue in nodes)
        //    {
        //        var uOpt = new UserOption();
        //        foreach (XmlNode node in ue.ChildNodes)
        //        {
        //            var name = node.Attributes["name"].Value;
        //            switch (name)
        //            {
        //                case "user_id":
        //                    var usr = allUsers.FirstOrDefault(a => a.OldId == int.Parse(node.InnerText));
        //                    if (usr != null)
        //                    {
        //                        uOpt.UserId = usr.Id;
        //                        uOpt.User = usr;
        //                    }
        //                    else
        //                    {
        //                        continue;
        //                    }
        //                    break;
        //                case "option_id":
        //                    var opt = all.FirstOrDefault(a => a.OldId == int.Parse(node.InnerText));
        //                    if (opt != null)
        //                    {
        //                        uOpt.OptionId = opt.Id;
        //                        uOpt.Option = opt;
        //                    }
        //                    else
        //                    {
        //                        continue;
        //                    }
        //                    break;
        //                case "user_option_desc":
        //                    uOpt.Description = node.InnerText;
        //                    break;
        //            }
        //        }
        //        var exists = wholeList.FirstOrDefault(a => a.UserId == uOpt.UserId && a.OptionId == uOpt.OptionId);
        //        if (exists == null && uOpt.Option != null && uOpt.User != null)
        //        {
        //            list.Add(uOpt);
        //            wholeList.Add(uOpt);
        //        }
        //        else
        //        {
        //            failed.Add(ue);
        //        }
        //        if (list.Count == 1000)
        //        {
        //            service.ImportUserOptions(list.ToArray());
        //            list = new List<UserOption>();
        //        }
        //    }
        //    service.ImportUserOptions(list.ToArray());
        //    return failed;
        //}
        //private static List<XmlNode> ImportUserDiagnosis(XmlNodeList nodes, IImportService service)
        //{
        //    List<UserDiagnosis> list = new List<UserDiagnosis>();
        //    List<XmlNode> failed = new List<XmlNode>();
        //    var all = service.GetAllDiagnoses();
        //    var users = service.GetAllUsers();
        //    foreach (XmlNode ue in nodes)
        //    {
        //        var cat = new UserDiagnosis();
        //        TRRUser user = null;
        //        Diagnosis diag = null;
        //        foreach (XmlNode node in ue.ChildNodes)
        //        {
        //            var name = node.Attributes["name"].Value;
        //            switch (name)
        //            {
        //                case "diagnosis_syscode":
        //                    diag = all.FirstOrDefault(d => d.OldId == int.Parse(node.InnerText));
        //                    break;
        //                case "user_id":
        //                    user = users.FirstOrDefault(u => u.OldId == int.Parse(node.InnerText));
        //                    break;
        //                case "diagnosis_note":
        //                    cat.Note = node.InnerText;
        //                    break;
        //            }
        //        }
        //        if (user != null && diag != null)
        //        {
        //            var exists = list.FirstOrDefault(u => u.DiagnosisId == diag.Id && u.UserId == user.Id) != null;
        //            if (!exists)
        //            {
        //                cat.User = user;
        //                cat.UserId = user.Id;
        //                cat.Diagnosis = diag;
        //                cat.DiagnosisId = diag.Id;
        //                list.Add(cat);
        //            }
        //        }
        //        else
        //        {
        //            failed.Add(ue);
        //        }
        //    }
        //    service.ImportUserDiagnoses(list.ToArray());
        //    return failed;
        //}
        //private static void ImportOptionCategories(XmlNodeList nodes, IImportService service)
        //{

        //    List<OptionCategory> list = new List<OptionCategory>();
        //    foreach (XmlNode ue in nodes)
        //    {
        //        var cat = new OptionCategory();
        //        foreach (XmlNode node in ue.ChildNodes)
        //        {
        //            var name = node.Attributes["name"].Value;
        //            switch (name)
        //            {
        //                case "category_id":
        //                    cat.OldId = int.Parse(node.InnerText);
        //                    break;
        //                case "category_name":
        //                    cat.Name = node.InnerText;
        //                    break;
        //            }
        //        }
        //        list.Add(cat);
        //    }
        //    service.ImportOptionCategories(list.ToArray());
        //}
        //private static void ImportOptions(XmlNodeList nodes, IImportService service)
        //{
        //    OptionCategory[] cats = service.GetAllCategories();
        //    List<Option> list = new List<Option>();
        //    foreach (XmlNode ue in nodes)
        //    {
        //        var opt = new Option();
        //        foreach (XmlNode node in ue.ChildNodes)
        //        {
        //            var name = node.Attributes["name"].Value;
        //            switch (name)
        //            {
        //                case "option_id":
        //                    opt.OldId = int.Parse(node.InnerText);
        //                    break;
        //                case "category_id":
        //                    var cat = cats.First(a => a.OldId == int.Parse(node.InnerText));
        //                    opt.OptionCategoryId = cat.Id;
        //                    opt.Category = cat;
        //                    break;
        //                case "option_title":
        //                    opt.Title = node.InnerText;
        //                    break;
        //                case "option_desc":
        //                    opt.Description = node.InnerText;
        //                    break;
        //            }
        //        }
        //        list.Add(opt);
        //    }
        //    service.ImportOptions(list.ToArray());
        //}
        //private static void ImportSystemCodes(XmlNodeList nodes, IImportService service)
        //{

        //    List<SystemCode> list = new List<SystemCode>();
        //    foreach (XmlNode ue in nodes)
        //    {
        //        var cat = new SystemCode();
        //        foreach (XmlNode node in ue.ChildNodes)
        //        {
        //            var name = node.Attributes["name"].Value;
        //            switch (name)
        //            {
        //                case "code_id":
        //                    cat.OldId = int.Parse(node.InnerText);
        //                    break;
        //                case "code_desc":
        //                    cat.Description = node.InnerText;
        //                    break;
        //                case "code_type":
        //                    cat.CodeType = node.InnerText;
        //                    break;
        //            }
        //        }
        //        list.Add(cat);
        //    }
        //    service.ImportSystemCodes(list.ToArray());
        //}
        //public class UserEventId { public int UserId { get; set; } public int EventId { get; set; } }
        //private static List<XmlNode> ImportUserEvents(XmlNodeList nodes, IImportService service)
        //{
        //    List<ImportUserEvent> users = new List<ImportUserEvent>();
        //    Dictionary<UserEventId, XmlNode> processed = new Dictionary<UserEventId, XmlNode>();
        //    foreach (XmlNode ue in nodes)
        //    {
        //        DateTime added = DateTime.Now;
        //        string name = "", value = "";
        //        try
        //        {
        //            var user = new ImportUserEvent();
        //            foreach (XmlNode node in ue.ChildNodes)
        //            {
        //                name = node.Attributes["name"].Value;
        //                value = node.InnerText;
        //                switch (name)
        //                {
        //                    case "user_id":
        //                        user.UserId = int.Parse(node.InnerText);
        //                        break;
        //                    case "event_anchor":
        //                        user.EventId = int.Parse(node.InnerText.Split('_')[1]);
        //                        break;
        //                    case "user_event_comment":
        //                        user.Comment = node.InnerText;
        //                        break;
        //                    case "user_event_added":
        //                        user.Created = DateTime.Parse(node.InnerText);
        //                        break;
        //                    case "user_added_by":
        //                        user.CreatedById = int.Parse(node.InnerText);
        //                        break;
        //                    case "user_attended":
        //                        user.UserAttended = string.IsNullOrEmpty(node.InnerText) ? null : (bool?)(node.InnerText == "Y");
        //                        break;
        //                }
        //            }
        //            processed.Add(new UserEventId() { EventId = user.EventId, UserId = user.UserId }, ue);
        //            users.Add(user);
        //            if (users.Count == 1000)
        //            {
        //                string[] errors = service.ImportUserEvents(users);
        //                users.Clear();
        //            }
        //        }
        //        catch (Exception ex)
        //        {

        //        }
        //    }
        //    if(users.Count>0)
        //    service.ImportUserEvents(users);

        //    var all = service.GetContext().UserEvents.ToArray();
        //    return processed.Where(a => all.FirstOrDefault(b => b.OldUserId == a.Key.UserId && b.OldEventId == a.Key.EventId) == null).Select(a => a.Value).ToList();
        //}
    }
}
