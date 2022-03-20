import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search',{static:true}) searchTerm:ElementRef
  products:IProduct[]
  brands:IBrand[]
  types:IType[]
  shopParams = new ShopParams()
  totalCount:number
  sortOptions=[
    {"name":"Alphabetical","value":"name"},
    {"name":"Price:Low to High","value":"priceAsc"},
    {"name":"Price:High to Low","value":"priceDesc"}
  ]

  constructor(private shopService:ShopService) { }

  ngOnInit(): void {
    this.getProduct()
    this.getBrand()
    this.getType()
  }
  getProduct(){
    this.shopService.getProduct(this.shopParams).subscribe({
      next: response=>{
       this.products=response.data
       this.shopParams.pageNumber = response.pageIndex
       this.shopParams.pageSize = response.pageSize
       this.totalCount = response.count
     },
     error:error=>{
       console.log(error)
     }})
  }
  getBrand(){
    this.shopService.getBrand().subscribe({
      next: response=>{
       this.brands=[{id:0,name:"All"},...response]
     },
     error:error=>{
       console.log(error)
     }})
  }
  getType(){
    this.shopService.getType().subscribe({
      next: response=>{
       this.types=[{id:0,name:"All"},...response]
     },
     error:error=>{
       console.log(error)
     }})
  }
  onBrandSelected(brandId:number)
  {
    this.shopParams.brandId = brandId
    this.shopParams.pageNumber = 1
    this.getProduct()
  }
  onTypeSelected(typeId:number)
  {
    this.shopParams.typeId = typeId
    this.shopParams.pageNumber = 1
    this.getProduct()
  }
  onSortSelected(sort:string)
  {
    this.shopParams.sort = sort
    this.getProduct()
  }
  onPageChange(event:any){
    if(this.shopParams.pageNumber !== event)
    {
      this.shopParams.pageNumber = event
      this.getProduct()
    }
   
  }

  onSearch()
  {
    this.shopParams.search = this.searchTerm.nativeElement.value
    this.shopParams.pageNumber = 1
    this.getProduct()
  }
  onReset()
  {
    this.searchTerm.nativeElement.value =''
    this.shopParams = new ShopParams()
    this.getProduct()
  }

}
