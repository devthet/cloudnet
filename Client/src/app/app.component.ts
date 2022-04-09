import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';
import { IPagination } from './shared/models/pagination';
import { IProduct } from './shared/models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'CloudNet';
 // products:IProduct[];
  constructor(private basketService:BasketService,private accoutService:AccountService){}

  ngOnInit(): void {
  //  this.http.get('https://localhost:5001/api/products?pagesize=50').subscribe({
  //   next: (response:IPagination)=>{
  //     this.products = response.data;
  //   console.log(response);
  //  },
  //  error:error=>{
  //   console.log(error)
  //  }
  // });
    this.loadBasket()
    this.loadCurrentUser()
  }

  loadCurrentUser(){
    const token = localStorage.getItem('token')
    // if(token){
      this.accoutService.loadCurrentUser(token).subscribe({
        next:()=>{
        console.log('loaded User')
      },
      error:error=>{console.log(error)}
    })
    // }
  }

  loadBasket(){
    const basketid = localStorage.getItem('basket_id')
    if(basketid){
      this.basketService.getBasket(basketid).subscribe({
        next:()=> console.log('Initialised basket')
        , 
        error:error=>console.log(error)
       } )
    }
    
  }
 
}
