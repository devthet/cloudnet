using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
   
    public class AccountController : BaseApiController
    {
     
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager,SignInManager<AppUser> signInManager,
        ITokenService tokenService,IMapper mapper )
        {
            _tokenService = tokenService;
            _mapper = mapper;
            _signInManager = signInManager;
            _userManager = userManager;
            
        }

        [Authorize]
        [HttpGet()]
        public async Task<ActionResult<Userdto>> GetCurrentUser(){
            //var email = HttpContext.User?.Claims?.FirstOrDefault(x=>x.Type== ClaimTypes.Email)?.Value;
            //var email = User.FindFirstValue(ClaimTypes.Email);
            //var user = await _userManager.FindByEmailAsync(email);
             var user =  await _userManager.FindByEmailForClaimPrinciple(HttpContext.User);
            return new Userdto{
                Email=user.Email,
                Token= _tokenService.CreateToken(user),
                DisplayName= user.DisplayName
            };
        }
        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery]string email){
            return await _userManager.FindByEmailAsync(email)!= null;
        }
        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<Addressdto>> GetUserAddress(){
            // var email = HttpContext.User?.Claims?.FirstOrDefault(x=>x.Type== ClaimTypes.Email)?.Value;
            //var user = await _userManager.FindByEmailAsync(email);
            var user =  await _userManager.FindByUserByClaimprincipleEmailWithAddressAsync(HttpContext.User);
            return _mapper.Map<Address,Addressdto>(user.Address) ;

        }
        [HttpPut("address")]
        public async Task<ActionResult<Addressdto>> UpdateUserAddress(Addressdto addressdto){
            var user = await _userManager.FindByUserByClaimprincipleEmailWithAddressAsync(HttpContext.User);
            user.Address = _mapper.Map<Addressdto,Address>(addressdto);
            var result = await _userManager.UpdateAsync(user);
            if(result.Succeeded) return Ok(_mapper.Map<Address,Addressdto>(user.Address));
            return BadRequest("Problem updating the user"); 

        }

        [HttpPost("login")]
        public async Task<ActionResult<Userdto>> Login(Logindto logindto){
           var user = await _userManager.FindByEmailAsync(logindto.Email);
           if(user==null){
               return Unauthorized(new ApiResponse(401));
           }
           var result = await _signInManager.CheckPasswordSignInAsync(user,logindto.Password,false);
           if(!result.Succeeded){
               return Unauthorized(new ApiResponse(401));
           }
            return new Userdto{
                Email=user.Email,
                Token= _tokenService.CreateToken(user),
                DisplayName= user.DisplayName
            };

        }
        [HttpPost("register")]
    public async Task<ActionResult<Userdto>> Register(Registerdto registerdto){
        if(CheckEmailExistsAsync(registerdto.Email).Result.Value){
            return new BadRequestObjectResult(new ApiValidationErrorResponse{
                Errors= new []{
                    "Email address is in use."
                }
            });
        }
        var user = new AppUser{
            DisplayName=registerdto.DisplayName,
            Email = registerdto.Email,
            UserName = registerdto.Email
        };
        var result = await _userManager.CreateAsync(user,registerdto.Password);

        if(!result.Succeeded){
            return BadRequest(new ApiResponse(400));
        }


        return new Userdto{
            DisplayName= user.DisplayName,
            Email=user.Email,
            Token =  _tokenService.CreateToken(user),
        };
    }

    }

    
}