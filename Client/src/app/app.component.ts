import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './models/pagination';
import { IProduct } from './models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'CloudNet';
  products:IProduct[];
  constructor(private http:HttpClient){}

  ngOnInit(): void {
   this.http.get('https://localhost:5001/api/products?pagesize=50').subscribe({
    next: (response:IPagination)=>{
      this.products = response.data;
    console.log(response);
   },
   error:error=>{
    console.log(error)
   }
  });
  }
 
}
