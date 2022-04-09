using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<Product,ProductToReturnDto>()
            .ForMember(d=>d.ProductBrand,o=>o.MapFrom(s=>s.ProductBrand.Name))
            .ForMember(d=>d.ProductType,o=>o.MapFrom(s=>s.ProductType.Name))
            .ForMember(d=>d.PictureUrl,o=>o.MapFrom<ProductUrlResolver>())
            ;
            CreateMap<Core.Entities.Identity.Address, Addressdto>().ReverseMap();
            CreateMap<CustomerBasketdto,CustomerBasket>();
            CreateMap<BasketItemdto,BasketItem>();
            CreateMap<Addressdto,Core.Entities.OrderAggregate.Address>();
            CreateMap<OrderItem,OrderItemdto>()
            .ForMember(d=>d.ProductId,o=>o.MapFrom(s=>s.ItemOrdered.ProductItemId))
            .ForMember(d=>d.ProductName,o=>o.MapFrom(s=>s.ItemOrdered.ProductName))
            .ForMember(d=>d.PictureUrl,o=>o.MapFrom(s=>s.ItemOrdered.PictureUrl))
            .ForMember(d=>d.PictureUrl,o=>o.MapFrom<OrderItemUrlResolver>());
            CreateMap<Order,OrderToReturndto>()
             .ForMember(d=>d.DeliveryMethod,o=>o.MapFrom(s=>s.DeliveryMethod.ShortName))
             .ForMember(d=>d.ShippingPrice,o=>o.MapFrom(s=>s.DeliveryMethod.Price));
            
            
        }
    }
}