using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController:BaseApiController
    {
        private readonly IBasketRepository _repository;
        private readonly IMapper _mapper;

        public BasketController(IBasketRepository repository,IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id){
            var basket = await _repository.GetBasketAsync(id);
            return Ok(basket??new CustomerBasket(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketdto basketdto){
            var basket = _mapper.Map<CustomerBasketdto,CustomerBasket>(basketdto);
            var updatedBasket = await _repository.UpdateBasketAsync(basket);
            return Ok((updatedBasket));

        }
        [HttpDelete]
        public async Task DeleteBasket(string id){
            await _repository.DeleteBasketAsync(id);
        }
    
    }
}