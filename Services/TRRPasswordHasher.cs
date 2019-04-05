using Microsoft.AspNetCore.Identity;
using Models;
using System;
using System.Text;

namespace Services
{

    public class TRRPasswordHasher : IPasswordHasher<TRRUser>
    {
        public string HashPassword(TRRUser user, string password)
        {
            return getHash(password);
        }

        private string getHash(string pass)
        {
            var sha1 = System.Security.Cryptography.SHA1.Create();
            var hash = sha1.ComputeHash(sha1.ComputeHash(Encoding.ASCII.GetBytes(pass)));
            return BitConverter.ToString(hash).Replace("-", "");
        }

        public PasswordVerificationResult VerifyHashedPassword(TRRUser user, string hashedPassword, string providedPassword)
        {
            if(hashedPassword == getHash(providedPassword))
            {
                return PasswordVerificationResult.Success;
            }
            return PasswordVerificationResult.Failed;
        }
    }
}