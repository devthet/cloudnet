import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  
  product:IProduct
  quantity=1
  constructor(private shopService:ShopService,private activateRoute:ActivatedRoute,private breadcrrumb:BreadcrumbService,private basketService:BasketService) {
    this.breadcrrumb.set('@productDetails','')
   }

  ngOnInit(): void {
    this.loadProduct()
  }

  loadProduct(){
    this.shopService.getProductDetail(+this.activateRoute.snapshot.paramMap.get('id')).subscribe({
      next:product=>{
      this.product = product,
      this.breadcrrumb.set('@productDetails',product.name)
    },
    error:error=>{
      console.log(error)
    }})
  }

  addItemToBasket(){
    this.basketService.addIitemToBasket(this.product,this.quantity)
  }
  incrementQuantity(){
    this.quantity++
  }
  decrementQuantity(){
    if(this.quantity>0){
      this.quantity--
    }
    
  }

}
