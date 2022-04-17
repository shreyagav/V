using Microsoft.AspNetCore.Identity;
using Models.Context;
using System;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class TRRPasswordHasher : IPasswordHasher<AspNetUser>
    {
        public string HashPassword(AspNetUser user, string password)
        {
            return getHash(password);
        }

        private string getHash(string pass)
        {
            var sha1 = System.Security.Cryptography.SHA1.Create();
            var hash = sha1.ComputeHash(sha1.ComputeHash(Encoding.ASCII.GetBytes(pass)));
            return BitConverter.ToString(hash).Replace("-", "");
        }

        public PasswordVerificationResult VerifyHashedPassword(AspNetUser user, string hashedPassword, string providedPassword)
        {
            if(hashedPassword == getHash(providedPassword))
            {
                return PasswordVerificationResult.Success;
            }
            return PasswordVerificationResult.Failed;
        }
    }
}