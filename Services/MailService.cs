using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class MailService : IMailService
    {
        private readonly IConfiguration _config;
        public MailService(IConfiguration config)
        {
            _config = config;
        }
        public async Task Send(string subject, string plain, string html, 
            (string Email, string Name) from, 
            (string Email, string Name)[] to, 
            (string Email, string Name)[] cc = null, (string Email, string Name)[] bcc = null)
        {
            var client = new SendGridClient(_config.GetConnectionString("SendGridKey"));
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(from.Email, from.Name),
                Subject = subject,
                PlainTextContent = plain,
                HtmlContent = html
            };
            foreach(var e in to)
            {
                msg.AddTo(new EmailAddress(e.Email, e.Name));
            }
            if(cc!=null)
            {
                foreach (var e in cc)
                {
                    msg.AddCc(new EmailAddress(e.Email, e.Name));
                }
            }
            if (bcc != null)
            {
                foreach (var e in bcc)
                {
                    msg.AddBcc(new EmailAddress(e.Email, e.Name));
                }
            }
            var response = await client.SendEmailAsync(msg);
        }
    }
}
