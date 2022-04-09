using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class CustomerBasketdto
    {
        [Required]
         public string Id { get; set; }
        public List<BasketItemdto> Items { get; set; }
    }
}