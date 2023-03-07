using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Services
{
    public class TRRUserStore : IUserPasswordStore<AspNetUser>, IUserRoleStore<AspNetUser>
    {
        private readonly ApplicationDbContext _context;
        public TRRUserStore(ApplicationDbContext ctx)
        {
            _context = ctx;
        }

        public async Task AddToRoleAsync(AspNetUser user, string roleName, CancellationToken cancellationToken)
        {
            _context.Attach(user);
            var role = await _context.AspNetRoles.FirstOrDefaultAsync(a => a.Name == roleName, cancellationToken);
            user.Roles.Add(role);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<IdentityResult> CreateAsync(AspNetUser user, CancellationToken cancellationToken)
        {
            user.Id= Guid.NewGuid().ToString();
            await _context.AspNetUsers.AddAsync(user, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(AspNetUser user, CancellationToken cancellationToken)
        {
            user.Deleted = true;
            _context.Attach(user);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public async Task<AspNetUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            return await _context.AspNetUsers.FirstOrDefaultAsync(a => a.Id == userId, cancellationToken);
        }

        public async Task<AspNetUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            return await _context.AspNetUsers.FirstOrDefaultAsync(a => a.NormalizedUserName == normalizedUserName, cancellationToken);
        }

        public Task<string> GetNormalizedUserNameAsync(AspNetUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user?.NormalizedUserName);
        }

        public Task<string> GetPasswordHashAsync(AspNetUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public async Task<IList<string>> GetRolesAsync(AspNetUser user, CancellationToken cancellationToken)
        {
            return await _context.AspNetRoles.Where(a => a.Users.Any(b => b.Id == user.Id)).Select(a => a.Name).ToListAsync();
        }

        public Task<string> GetUserIdAsync(AspNetUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user?.Id);
        }

        public Task<string> GetUserNameAsync(AspNetUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user?.UserName);
        }

        public async Task<IList<AspNetUser>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            return await _context.AspNetRoles.Where(a => a.Name == roleName).SelectMany(a => a.Users).ToListAsync(cancellationToken);
        }

        public Task<bool> HasPasswordAsync(AspNetUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash != null);
        }

        public async Task<bool> IsInRoleAsync(AspNetUser user, string roleName, CancellationToken cancellationToken)
        {
            return await _context.AspNetRoles.AnyAsync(a => a.Name == roleName && a.Users.Any(b => b.Id == user.Id), cancellationToken);
        }

        public async Task RemoveFromRoleAsync(AspNetUser user, string roleName, CancellationToken cancellationToken)
        {
            var role = await _context.AspNetRoles.Include(a => a.Users).FirstOrDefaultAsync(a => a.Name == roleName);
            role.Users.Remove(user);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task SetNormalizedUserNameAsync(AspNetUser user, string normalizedName, CancellationToken cancellationToken)
        {
            user.NormalizedUserName = normalizedName;
            var res = await UpdateAsync(user, cancellationToken);
            CheckUpdateResult(res);
        }

        public async Task SetPasswordHashAsync(AspNetUser user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            var res = await UpdateAsync(user, cancellationToken);
            CheckUpdateResult(res);
        }

        private void CheckUpdateResult(IdentityResult res)
        {
            if (!res.Succeeded)
            {
                throw new Exception(String.Join(Environment.NewLine, res.Errors.Select(a => a.Description)));
            }
        }

        public async Task SetUserNameAsync(AspNetUser user, string userName, CancellationToken cancellationToken)
        {
            user.UserName = userName;
            var res = await UpdateAsync(user, cancellationToken);
            CheckUpdateResult(res);
        }

        public async Task<IdentityResult> UpdateAsync(AspNetUser user, CancellationToken cancellationToken)
        {
            if (!string.IsNullOrWhiteSpace(user.Id))
            {
                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync(cancellationToken);
            }
            return IdentityResult.Success;
        }
    }
}
