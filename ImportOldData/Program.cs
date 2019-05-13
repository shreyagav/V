using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Models;
using Services;
using Services.Data;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;

namespace ImportOldData
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = builder.Build();

            var services = new ServiceCollection();
            //services.AddTransient<IUserClaimsPrincipalFactory<TRRUser>, TRRClaimsPrincipalFactory<TRRUser>>();
            services.AddTransient<IPasswordHasher<TRRUser>, TRRPasswordHasher>();
            services.AddTransient<ICalendarEventService, CalendarEventService>();
            services.AddTransient<IImportService, ImportService>();
            services.AddDbContext<ApplicationDbContext>(options =>
                            options.UseSqlServer(
                                "Data Source=912-4801\\sql2016std;Initial Catalog=test-teamriverrunner;User ID=sql_dmytrod;Password=Pa$$w0rd;MultipleActiveResultSets=False;Connection Timeout=30;", b => b.MigrationsAssembly("Services")));
            services.AddDefaultIdentity<TRRUser>()
                .AddEntityFrameworkStores<ApplicationDbContext>();
            services.AddScoped<IUserService, UserService>();
            var serviceProvider = services.BuildServiceProvider();
            var userService = serviceProvider.GetService<IUserService>();
            var importService = serviceProvider.GetService<IImportService>();
            ICalendarEventService service = serviceProvider.GetService<ICalendarEventService>();

            /*DbContextOptionsBuilder<ApplicationDbContext> optBulder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optBulder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            ApplicationDbContext context = new ApplicationDbContext(optBulder.Options);
            CalendarEventService service = new CalendarEventService(context);
            Console.WriteLine("Hello World!");*/

            XmlDocument doc = new XmlDocument();
            doc.Load("C:\\Work\\TeamRiverRunnerOld\\teamriv_admin.xml");
            //var nodes = doc.SelectNodes("//table[@name='site']");
            //ImportSites(nodes, service);
            //nodes = doc.SelectNodes("//table[@name='syscode' and ./column='E']");
            //ImportEventTypes(nodes, service);
            //nodes = doc.SelectNodes("//table[@name='calendar_events']");
            //ImportEvents(nodes, service);

            //nodes = doc.SelectNodes("//table[@name='user']");
            //ImportUsers(nodes, userService);
            //ImportExceptionalEvents(doc,service);
            //var nodes = doc.SelectNodes("//table[@name='user_event']");
            //ImportUserEvents(nodes, service);
            //var nodes = doc.SelectNodes("//table[@name='option_category']");
            //ImportOptionCategories(nodes, importService);
            //nodes = doc.SelectNodes("//table[@name='options']");
            //ImportOptions(nodes, importService);
            //var nodes = doc.SelectNodes("//table[@name='user_options']");
            //ImportUserOptions(nodes, importService);
            //var nodes = doc.SelectNodes("//table[@name='syscode']");
            //ImportSystemCodes(nodes, importService);
            var nodes = doc.SelectNodes("//table[@name='diagnosis']");
            ImportUserDiagnosis(nodes, importService);
        }

        private static void ImportUserDiagnosis(XmlNodeList nodes, IImportService service)
        {
            List<UserDiagnosis> list = new List<UserDiagnosis>();
            var all = service.GetAllDiagnoses();
            var users = service.GetAllUsers();
            foreach (XmlNode ue in nodes)
            {
                var cat = new UserDiagnosis();
                TRRUser user = null;
                Diagnosis diag = null;
                foreach (XmlNode node in ue.ChildNodes)
                {
                    var name = node.Attributes["name"].Value;
                    switch (name)
                    {
                        case "diagnosis_syscode":
                            diag = all.FirstOrDefault(d => d.OldId == int.Parse(node.InnerText));
                            break;
                        case "user_id":
                            user = users.FirstOrDefault(u => u.OldId == int.Parse(node.InnerText));
                            break;
                        case "diagnosis_note":
                            cat.Note = node.InnerText;
                            break;
                    }
                }
                if(user!=null && diag != null)
                {
                    var exists = list.FirstOrDefault(u => u.DiagnosisId == diag.Id && u.UserId == user.Id) != null;
                    if (!exists)
                    {
                        cat.User = user;
                        cat.UserId = user.Id;
                        cat.Diagnosis = diag;
                        cat.DiagnosisId = diag.Id;
                        list.Add(cat);
                    }
                }
            }
            service.ImportUserDiagnoses(list.ToArray());
        }

        private static void ImportSystemCodes(XmlNodeList nodes, IImportService service)
        {

            List<SystemCode> list = new List<SystemCode>();
            foreach (XmlNode ue in nodes)
            {
                var cat = new SystemCode();
                foreach (XmlNode node in ue.ChildNodes)
                {
                    var name = node.Attributes["name"].Value;
                    switch (name)
                    {
                        case "code_id":
                            cat.OldId = int.Parse(node.InnerText);
                            break;
                        case "code_desc":
                            cat.Description = node.InnerText;
                            break;
                        case "code_type":
                            cat.CodeType = node.InnerText;
                            break;
                    }
                }
                list.Add(cat);
            }
            service.ImportSystemCodes(list.ToArray());
        }

        private static void ImportUserOptions(XmlNodeList nodes, IImportService service) {

            Option[] all = service.GetAllOptions();
            TRRUser[] allUsers = service.GetAllUsers();
            List<UserOption> wholeList = new List<UserOption>();
            List<UserOption> list = new List<UserOption>();
            foreach (XmlNode ue in nodes)
            {
                var uOpt = new UserOption();
                foreach (XmlNode node in ue.ChildNodes)
                {
                    var name = node.Attributes["name"].Value;
                    switch (name)
                    {
                        case "user_id":
                            var usr = allUsers.FirstOrDefault(a => a.OldId == int.Parse(node.InnerText));
                            if (usr != null)
                            {
                                uOpt.UserId = usr.Id;
                                uOpt.User = usr;
                            }
                            else {
                                continue;
                            }
                            break;
                        case "option_id":
                            var opt = all.FirstOrDefault(a => a.OldId == int.Parse(node.InnerText));
                            if (opt != null)
                            {
                                uOpt.OptionId = opt.Id;
                                uOpt.Option = opt;
                            }
                            else
                            {
                                continue;
                            }
                            break;
                        case "user_option_desc":
                            uOpt.Description = node.InnerText;
                            break;
                    }
                }
                var exists = wholeList.FirstOrDefault(a => a.UserId == uOpt.UserId && a.OptionId == uOpt.OptionId);
                if (exists == null && uOpt.Option!=null && uOpt.User != null)
                {
                    list.Add(uOpt);
                    wholeList.Add(uOpt);
                }
                else
                    Console.WriteLine($"{uOpt.UserId}::{uOpt.OptionId}");
                if(list.Count == 1000)
                {
                    service.ImportUserOptions(list.ToArray());
                    list = new List<UserOption>();
                }
            }
            service.ImportUserOptions(list.ToArray());
        }

        private static void ImportOptionCategories(XmlNodeList nodes, IImportService service)
        {

            List<OptionCategory> list = new List<OptionCategory>();
            foreach (XmlNode ue in nodes)
            {
                var cat = new OptionCategory();
                foreach (XmlNode node in ue.ChildNodes)
                {
                    var name = node.Attributes["name"].Value;
                    switch (name)
                    {
                        case "category_id":
                            cat.OldId = int.Parse(node.InnerText);
                            break;
                        case "category_name":
                            cat.Name = node.InnerText;
                            break;
                    }
                }
                list.Add(cat);
            }
            service.ImportOptionCategories(list.ToArray());
        }

        private static void ImportOptions(XmlNodeList nodes, IImportService service)
        {
            OptionCategory[] cats = service.GetAllCategories();
            List<Option> list = new List<Option>();
            foreach (XmlNode ue in nodes)
            {
                var opt = new Option();
                foreach (XmlNode node in ue.ChildNodes)
                {
                    var name = node.Attributes["name"].Value;
                    switch (name)
                    {
                        case "option_id":
                            opt.OldId = int.Parse(node.InnerText);
                            break;
                        case "category_id":
                            var cat = cats.First(a => a.OldId == int.Parse(node.InnerText));
                            opt.OptionCategoryId = cat.Id;
                            opt.Category = cat;
                            break;
                        case "option_title":
                            opt.Title = node.InnerText;
                            break;
                        case "option_desc":
                            opt.Description = node.InnerText;
                            break;
                    }
                }
                list.Add(opt);
            }
            service.ImportOptions(list.ToArray());
        }

        private static void ImportUserEvents(XmlNodeList nodes, ICalendarEventService service)
        {
            List<ImportUserEvent> users = new List<ImportUserEvent>();
            foreach (XmlNode ue in nodes)
            {
                int userId = 0, eventId = 0, createdBy = 0;
                bool? userAttended = null;
                string comment = "";
                DateTime added = DateTime.Now;
                string name="",value="";
                int idx = 0;
                try {
                    var user = new ImportUserEvent();
                    foreach (XmlNode node in ue.ChildNodes)
                    {
                        name = node.Attributes["name"].Value;
                        value = node.InnerText;
                        switch (name)
                        {
                            case "user_id":
                                user.UserId = int.Parse(node.InnerText);
                                break;
                            case "event_anchor":
                                user.EventId = int.Parse(node.InnerText.Split('_')[1]);
                                break;
                            case "user_event_comment":
                                user.Comment = node.InnerText;
                                break;
                            case "user_event_added":
                                user.Created = DateTime.Parse(node.InnerText);
                                break;
                            case "user_added_by":
                                user.CreatedById = int.Parse(node.InnerText);
                                break;
                            case "user_attended":
                                user.UserAttended = string.IsNullOrEmpty(node.InnerText) ? null : (bool?)(node.InnerText == "Y");
                                break;
                        }
                    }
                    users.Add(user);
                    if(users.Count == 1000)
                    {
                        //string[] errors = service.AddUserEvent(users);
                        //foreach(var err in errors)
                        {
                           // File.AppendAllText("ImportUserEvents.log", $"{err};\r\n");
                        }
                        users.Clear();
                    }
                }
                catch (Exception ex)
                {
                    File.AppendAllLines("ImportUserEventsNotAdded.log", new string[] { $"{name}={value}" });
                    File.AppendAllText("ImportUserEvents.log", $"{DateTime.Now}  :: Failed to import event with {name}={value}; Error={ex.Message};\r\n");
                }
            }
        }

        private static void ImportExceptionalEvents(XmlDocument doc, ICalendarEventService service)
        {
            var eventTypes = service.AllEventTypes();
            var lines = File.ReadAllLines("ImportEventsNotAdded4.log");
            foreach (string line in lines)
            {
                var node = doc.SelectSingleNode($"//table[@name='calendar_events' and ./column='{line}']");
                ImportEvent(node, service, eventTypes);
            }
        }

        private static void ImportEvents(XmlNodeList nodes, ICalendarEventService service)
        {
            var eventTypes = service.AllEventTypes();
            foreach (XmlNode t in nodes)
            {
                ImportEvent(t, service, eventTypes);
            }
        }
        private static void ImportEvent(XmlNode t, ICalendarEventService service, CalendarEventType[] eventTypes)
        {
            Models.CalendarEvent evt = new Models.CalendarEvent();
            string name = string.Empty;
            try
            {

                int month = 0, year = 0, day = 0, createdById = 0, modifiedById = 0, eventType = 0, eventSiteId = 0;
                string modifiedStr = "";
                foreach (XmlNode node in t.ChildNodes)
                {
                    name = node.Attributes["name"].Value;
                    switch (name)
                    {
                        case "event_id":
                            evt.OldId = int.Parse(node.InnerText);
                            break;
                        case "event_title":
                            evt.Name = node.InnerText;
                            break;
                        case "event_desc":
                            evt.Description = node.InnerText;
                            break;
                        case "event_report":
                            evt.Report = node.InnerText;
                            break;
                        case "event_type":
                            eventType = int.Parse(node.InnerText);
                            break;
                        case "event_added_by_id":
                            createdById = int.Parse(node.InnerText);
                            break;
                        case "event_modified_by_id":
                            modifiedById = int.Parse(node.InnerText);
                            break;
                        case "event_max":
                            evt.MaxCapacity = int.Parse(node.InnerText);
                            break;
                        case "event_count":
                            evt.OldEventCount = int.Parse(node.InnerText);
                            break;
                        case "event_multi_order":
                            evt.OldEventMultiOrder = int.Parse(node.InnerText);
                            break;
                        case "event_repeat":
                            evt.OldEventRepeat = node.InnerText != "NULL" ? int.Parse(node.InnerText) : 0;
                            break;
                        case "event_site_id":
                            eventSiteId = int.Parse(node.InnerText);
                            break;
                        case "event_day":
                            day = int.Parse(node.InnerText);
                            break;
                        case "event_year":
                            year = int.Parse(node.InnerText);
                            break;
                        case "event_month":
                            month = int.Parse(node.InnerText);
                            break;
                        case "event_time":
                            evt.StartTime = string.IsNullOrEmpty(node.InnerText) ? 800 : int.Parse(node.InnerText);
                            break;
                        case "event_end_time":
                            evt.EndTime = string.IsNullOrEmpty(node.InnerText) ? 2000 : int.Parse(node.InnerText);
                            break;
                        case "event_fee":
                            evt.Fee = decimal.Parse(node.InnerText);
                            break;
                        case "event_date_added":
                            evt.Created = DateTime.Parse(node.InnerText);
                            break;
                        case "event_date_updated":
                            modifiedStr = node.InnerText;
                            break;
                        case "event_visibility":
                            evt.OldEventVisibility = node.InnerText[0];
                            break;
                        case "event_date_deleted":
                            evt.Deleted = node.InnerText == "0000-00-00" ? null : (DateTime?)DateTime.Parse(node.InnerText);
                            break;
                        case "event_date_canceled":
                            evt.Canceled = node.InnerText == "0000-00-00" ? null : (DateTime?)DateTime.Parse(node.InnerText);
                            break;
                    }
                }
                evt.Date = new DateTime(year == 0 ? 2010 : year, month, day);
                evt.Modified = modifiedStr == "0000-00-00" ? evt.Created : DateTime.Parse(modifiedStr);
                evt.Site = service.GetEventSite(eventSiteId);
                evt.CreatedBy = service.GetUserByOldId(createdById);
                if (modifiedById != 0)
                    evt.ModifiedBy = modifiedById != createdById ? service.GetUserByOldId(modifiedById) : evt.CreatedBy;
                evt.EventType = eventTypes.FirstOrDefault(a => a.OldId == eventType);
                service.AddEvent(evt);
            }
            catch (Exception ex)
            {
                File.AppendAllLines("ImportEventsNotAdded5.log", new string[] { evt.OldId.ToString() });
                File.AppendAllText("ImportEvents5.log", $"{DateTime.Now}  :: Failed to import event with id={evt.OldId}; name={name}; Error={ex.Message};\r\n");
            }
        }

        private async static void ImportUsers(XmlNodeList nodes, IUserService service)
        {
            TRRUser user1 = new TRRUser();
            user1.Email = "dozcent3@mcdean.com";
            user1.UserName = "dmyt.ro3";
            var res = await service.SignUp(user1);
            foreach (XmlNode user in nodes)
            {
                TRRUser usr = new TRRUser();
                foreach (XmlNode node in user.ChildNodes)
                {
                    string name = node.Attributes["name"].Value;
                    try
                    {
                        switch (name)
                        {
                            case "user_email":
                                usr.Email = node.InnerText;
                                break;
                            case "user_login":
                                usr.UserName = node.InnerText;
                                break;
                                /*case "user_password":
                                    usr.OldPassword = node.InnerText;
                                    break;
                                case "user_first_name":
                                    usr.FirstName = node.InnerText;
                                    break;
                                case "user_last_name":
                                    usr.LastName = node.InnerText;
                                    break;
                                case "user_id":
                                    usr.OldId = int.Parse(node.InnerText);
                                    break;
                                case "user_phone":
                                    usr.PhoneNumber = node.InnerText;
                                    break;
                                case "user_alt_phone":
                                    usr.AltPhone = node.InnerText;
                                    break;
                                case "user_address":
                                    usr.Address = node.InnerText;
                                    break;

                                    case "user_dob":
                                        usr.DateOfBirth = DateTime.Parse(node.InnerText);
                                        break;
                                    case "user_site_id":
                                        usr.OldSiteId = int.Parse(node.InnerText);
                                        break;
                                    case "user_type":
                                        usr.OldType = int.Parse(node.InnerText);
                                        break;
                                    case "user_gender":
                                        usr.Gender = node.InnerText.Length==0?' ':node.InnerText[0];
                                        break;
                                    case "user_travel_time":
                                        usr.TravelTime = node.InnerText;
                                        break;
                                    case "user_join_date":
                                        usr.JoinDate = DateTime.Parse(node.InnerText);
                                        break;
                                    case "user_sponsored_by":
                                        usr.SponsoredBy = int.Parse(node.InnerText);
                                        break;
                                    case "user_auth_level":
                                        usr.OldAuthLevel = int.Parse(node.InnerText);
                                        break;
                                    case "user_active":
                                        usr.Active = node.InnerText[0]=='Y';
                                        break;
                                    case "user_deactive_cause":
                                        usr.DeactiveCause = node.InnerText;
                                        break;
                                    case "user_branch_id":
                                        usr.BranchId = int.Parse(node.InnerText);
                                        break;
                                    case "user_status":
                                        usr.OldStatus = int.Parse(node.InnerText);
                                        break;
                                    case "user_medical":
                                        usr.Medical = int.Parse(node.InnerText);
                                        break;
                                    case "user_date_injured":
                                        usr.DateInjured = DateTime.Parse(node.InnerText);
                                        break;
                                    case "user_release_signed":
                                        usr.ReleaseSigned = node.InnerText == "Y";
                                        break;
                                    case "user_liability_signed":
                                        usr.LiabilitySigned = node.InnerText == "Y";
                                        break;
                                    case "user_comments":
                                        usr.Comments = node.InnerText;
                                        break;*/
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }
                res = await service.SignUp(usr);
                if (!res.Succeeded)
                {

                }

            }
        }
        private static void ImportEventTypes(XmlNodeList nodes, ICalendarEventService service)
        {
            foreach (XmlNode t in nodes)
            {
                Models.CalendarEventType newType = new Models.CalendarEventType();
                foreach (XmlNode node in t.ChildNodes)
                {
                    string name = node.Attributes["name"].Value;
                    switch (name)
                    {
                        case "code_id":
                            newType.OldId = int.Parse(node.InnerText);
                            break;
                        case "code_desc":
                            newType.Title = node.InnerText;
                            break;
                    }
                }
                service.AddEventType(newType);
            }
        }

        static void ImportSites(XmlNodeList sites, ICalendarEventService service)
        {
            foreach (XmlNode site in sites)
            {
                Models.EventSite evtSite = new Models.EventSite();
                Models.Contact main = new Models.Contact();
                Models.Contact govt = new Models.Contact();
                Models.Contact vol = new Models.Contact();
                Models.Contact outreach = new Models.Contact();
                Models.Contact national = new Models.Contact();

                foreach (XmlNode node in site.ChildNodes)
                {
                    string name = node.Attributes["name"].Value;
                    try
                    {
                        switch (name)
                        {
                            case "site_id":
                                evtSite.OldId = int.Parse(node.InnerText);
                                break;
                            case "site_name":
                                evtSite.Name = node.InnerText;
                                break;
                            case "site_type_id":
                                evtSite.TypeId = int.Parse(node.InnerText);
                                break;
                            case "site_staff_type":
                                evtSite.StaffTypeId = int.Parse(node.InnerText);
                                break;
                            case "site_comments":
                                evtSite.Description = node.InnerText;
                                break;
                            case "site_main_email":
                                main.Email = node.InnerText;
                                break;
                            case "site_main_name":
                                main.Name = node.InnerText;
                                break;
                            case "site_main_phone":
                                main.Phone = node.InnerText;
                                break;
                            case "site_govt_email":
                                govt.Email = node.InnerText;
                                break;
                            case "site_govt_name":
                                govt.Name = node.InnerText;
                                break;
                            case "site_govt_phone":
                                govt.Phone = node.InnerText;
                                break;
                            case "site_vol_coord_email":
                                vol.Email = node.InnerText;
                                break;
                            case "site_vol_coord_name":
                                vol.Name = node.InnerText;
                                break;
                            case "site_vol_coord_phone":
                                vol.Phone = node.InnerText;
                                break;
                            case "site_national_contact_email":
                                national.Email = node.InnerText;
                                break;
                            case "site_national_contact_name":
                                national.Name = node.InnerText;
                                break;
                            case "site_national_contact_phone":
                                national.Phone = node.InnerText;
                                break;
                            case "site_outreach_email":
                                outreach.Email = node.InnerText;
                                break;
                            case "site_outreach_name":
                                outreach.Name = node.InnerText;
                                break;
                            case "site_outreach_phone":
                                outreach.Phone = node.InnerText;
                                break;
                            case "site_sec_clearance":
                                evtSite.SecurityClearance = node.InnerText;
                                break;
                            case "site_start_date":
                                evtSite.Originated = DateTime.Parse(node.InnerText);
                                break;
                            case "site_status_id":
                                evtSite.SiteStatusId = int.Parse(node.InnerText);
                                break;
                            case "site_pool_rental":
                                evtSite.PoolRental = node.InnerText == "Y";
                                break;
                            case "site_group_id":
                                evtSite.SiteGroupId = int.Parse(node.InnerText);
                                break;
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }
                if (!string.IsNullOrEmpty(main.Email))
                {
                    var temp = service.GetContactByEmail(main.Email);
                    if (temp != null)
                    {
                        evtSite.Main = temp;
                    }
                    else
                    {
                        service.AddContact(main);
                        evtSite.Main = main;
                    }
                }
                if (!string.IsNullOrEmpty(vol.Email))
                {
                    var temp = service.GetContactByEmail(vol.Email);
                    if (temp != null)
                    {
                        evtSite.Coordinator = temp;
                    }
                    else
                    {
                        service.AddContact(vol);
                        evtSite.Coordinator = vol;
                    }
                }
                if (!string.IsNullOrEmpty(govt.Email))
                {
                    var temp = service.GetContactByEmail(govt.Email);
                    if (temp != null)
                    {
                        evtSite.GOVT = temp;
                    }
                    else
                    {
                        service.AddContact(govt);
                        evtSite.GOVT = govt;
                    }
                }
                if (!string.IsNullOrEmpty(national.Email))
                {
                    var temp = service.GetContactByEmail(national.Email);
                    if (temp != null)
                    {
                        evtSite.National = temp;
                    }
                    else
                    {
                        service.AddContact(national);
                        evtSite.National = national;
                    }
                }
                if (!string.IsNullOrEmpty(outreach.Email))
                {
                    var temp = service.GetContactByEmail(outreach.Email);
                    if (temp != null)
                    {
                        evtSite.Outreach = temp;
                    }
                    else
                    {
                        service.AddContact(outreach);
                        evtSite.Outreach = outreach;
                    }
                }
                service.AddEventSite(evtSite);
            }

        }
    }
}
