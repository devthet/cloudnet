import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { IDeliveryMethod } from 'src/app/shared/models/deliverymethod';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
@Input() checkoutForm:FormGroup
deliveryMethods :IDeliveryMethod[]
  constructor(private checkoutService:CheckoutService,private basketService:BasketService) { }

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe(
      {
        next:(dm:IDeliveryMethod[])=>{
        this.deliveryMethods = dm
      },
      error:error =>{ console.log(error)}
      });
  }
  setDeliveryPrice(deliveryMethod:IDeliveryMethod){
    this.basketService.setShippingPrice(deliveryMethod)
  }

}