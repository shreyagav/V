using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class SMTPMailService : IMailService
    {

        public async Task Send(string subject, string plain, string html, (string Email, string Name) from, (string Email, string Name)[] to, (string Email, string Name)[] cc = null, (string Email, string Name)[] bcc = null)
        {
            MailMessage message = new MailMessage()
            {
                Subject = subject,
                Body = String.IsNullOrWhiteSpace(html) ? plain : html,
                IsBodyHtml = !String.IsNullOrWhiteSpace(html),
                From = new MailAddress(from.Email, from.Name)
            };
            message.ReplyToList.Add(new MailAddress("info@teamriverrunner.org", "TRR Info"));
            ProcessAddresses(message.To, to);
            if(cc != null)
            {
                ProcessAddresses(message.CC, cc);
            }
            if (bcc != null)
            {
                ProcessAddresses(message.Bcc, bcc);
            }
            SmtpClient client = new SmtpClient("mail.teamriverrunner.org", 2525);
            client.Credentials = new NetworkCredential("mail@teamriverrunner.org", "TRR_Pa$$w0rd");
            //client.EnableSsl = true;
            try
            {
                await client.SendMailAsync(message);
            }
            catch (Exception ex) { }
        }

        private void ProcessAddresses(MailAddressCollection col, (string Email, string Name)[] addr)
        {
            foreach (var a in addr)
            {
                col.Add(new MailAddress(a.Email, a.Name));
            }
        }
    }
}
