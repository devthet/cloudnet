import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { CheckoutService } from '../checkout.service';

declare var Stripe
@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit,OnDestroy {

  @Input() checkoutForm
  @ViewChild('cardNumber',{static:true})  cardNumberElement:ElementRef
  @ViewChild('cardExpiry',{static:true})  cardExpiryElement:ElementRef
  @ViewChild('cardCvc',{static:true})  cardCvcElement:ElementRef
  stripe:any
  cardNumber:any
  cardExpiry:any
  cardCvc:any
  cardErrors:any
  cardHandler = this.onChange.bind(this)
  loading =false
  cardNumberValid = false
  cardExpiryValid = false
  cardCvcValid = false

  constructor(private basketService:BasketService,private checkoutService:CheckoutService,
    private toastr:ToastrService,private router:Router) { }


  ngAfterViewInit(): void {
    this.stripe = Stripe('pk_test_51KoTRbFvNyRBVovfVOxTS9PUPimxggJbPUIF5LmHPHlf5EFGY7sRlFko6IOxl9TJYob1acmfWGRJAWRwWDH4uXwY00GvTa4vqb')
    const elements = this.stripe.elements()

    this.cardNumber = elements.create('cardNumber')
    this.cardNumber.mount(this.cardNumberElement.nativeElement)
    this.cardNumber.addEventListener('change',this.cardHandler)

    this.cardExpiry = elements.create('cardExpiry')
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement)
    this.cardExpiry.addEventListener('change',this.cardHandler)

    this.cardCvc = elements.create('cardCvc')
    this.cardCvc.mount(this.cardCvcElement.nativeElement)
    this.cardCvc.addEventListener('change',this.cardHandler)
  }

  ngOnDestroy(): void {
    this.cardNumber.destroy()
    this.cardExpiry.destroy()
    this.cardCvc.destroy()
  }

  onChange(event){
    if(event.error){
      this.cardErrors = event.error.message
    }else{
      this.cardErrors = null
    }

    switch(event.ElementType){
      case 'cardNumber':
        this.cardNumberValid = event.complete
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete
        break;

    }

  }

 

  async submitOrder(){
    this.loading = true
    const basket = this.basketService.getCurrentBasketValue()
    try {
      const createdOrder = await this.createdOrder(basket)
      const paymentResult = await this.confirmPaymentWithStrip(basket)
      if(paymentResult.paymentIntent){
        this.basketService.deleteBasket(basket)
        const navigationExtras:NavigationExtras = {state:createdOrder}
        this.router.navigate(['checkout/success'],navigationExtras)
      }else{
        this.toastr.error(paymentResult.error.message)
      }
      this.loading = false
      
    } catch (error) {
      console.log(error)
      this.loading = false
    }
   
    
    // this.checkoutService.createOrder(orderToCreate).subscribe({
    //   next:(order:IOrder)=>{
     
    //   this.stripe.confirmCardPayment(basket.clientSecret,{
    //     payment_method:{
    //       card:this.cardNumber,
    //       billing_details:{
    //         name:this.checkoutForm.get('paymentForm').get('nameOnCard').value
    //       }
    //     }
    //   }).then(result=>{
    //     console.log(result)
    //     if(result.paymentIntent){
    //       this.basketService.deleteLocalBasket(basket.id)
    //       const navigationExtras:NavigationExtras = {state:order}
    //       this.router.navigate(['checkout/success'],navigationExtras)
    //     }
    //     else{
    //       this.toastr.error(result.error.message)
    //     }
    //   });
    //   // this.basketService.deleteLocalBasket(basket.id)
    //   // const navigationExtras:NavigationExtras = {state:order}
    //   // this.router.navigate(['checkout/success'],navigationExtras)
    // },
    // error:error=>{
    //   this.toastr.error(error)
    //   console.log(error)
    // }
    // })
  }
  private async confirmPaymentWithStrip(basket:IBasket) {
    return this.stripe.confirmCardPayment(basket.clientSecret,{
      payment_method:{
        card:this.cardNumber,
        billing_details:{
          name:this.checkoutForm.get('paymentForm').get('nameOnCard').value
        }
      }
    })
  }
  private async createdOrder(basket: IBasket) {
    const orderToCreate = this.getOrderToCreate(basket)
   // return this.checkoutService.createOrder(orderToCreate).toPromise()
    return lastValueFrom(this.checkoutService.createOrder(orderToCreate))
  }
  private getOrderToCreate(basket: IBasket) {
   return {
     basketId :basket.id,
     deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
     shipToAddress: this.checkoutForm.get('addressForm').value
   }
  }
  

}

