using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Infrastructure.identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class IdentityServiceExtension
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services,IConfiguration configuration){

            var builder = services.AddIdentityCore<AppUser>();
            builder = new Microsoft.AspNetCore.Identity.IdentityBuilder(builder.UserType,builder.Services);
            builder.AddEntityFrameworkStores<AppIdentityContext>();
            builder.AddSignInManager<SignInManager<AppUser>>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options=>{
                options.TokenValidationParameters=new Microsoft.IdentityModel.Tokens.TokenValidationParameters{
                    ValidateIssuerSigningKey=true,
                    IssuerSigningKey= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Token:Key"])),
                    ValidIssuer = configuration["Token:Issuer"],
                    ValidateIssuer= true,
                    ValidateAudience = false
                };
            })
            ;
            return services;
        }
    }
}