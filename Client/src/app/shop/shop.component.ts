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
  @ViewChild('search',{static:false}) searchTerm:ElementRef
  products:IProduct[]
  brands:IBrand[]
  types:IType[]
  shopParams:ShopParams
  totalCount:number
  sortOptions=[
    {"name":"Alphabetical","value":"name"},
    {"name":"Price:Low to High","value":"priceAsc"},
    {"name":"Price:High to Low","value":"priceDesc"}
  ]

  constructor(private shopService:ShopService) {
    this.shopParams = this.shopService.getShopParams()
   }

  ngOnInit(): void {
    this.getProduct(true)
    this.getBrand()
    this.getType()
  }
  getProduct(useCache=false){
    this.shopService.getProduct(useCache).subscribe({
      next: response=>{
       this.products=response.data
      // this.shopParams.pageNumber = response.pageIndex
     //  this.shopParams.pageSize = response.pageSize
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
    const params = this.shopService.getShopParams()
    params.brandId = brandId
    params.pageNumber = 1
    this.shopService.setShopParams(params)
    this.getProduct()
  }
  onTypeSelected(typeId:number)
  {
    const params = this.shopService.getShopParams()
    params.typeId = typeId
    params.pageNumber = 1
    this.shopService.setShopParams(params)
    this.getProduct()
  }
  onSortSelected(sort:string)
  {
    const params = this.shopService.getShopParams()
    params.sort = sort
    this.shopService.setShopParams(params)
    this.getProduct()
  }

  onPageChange(event:any){
    const params = this.shopService.getShopParams()
    if(params.pageNumber !== event)
    {
      params.pageNumber = event
      this.shopService.setShopParams(params)
      this.getProduct(true)
    }
   
  }

  onSearch()
  {
    const params = this.shopService.getShopParams()
    params.search = this.searchTerm.nativeElement.value
    params.pageNumber = 1
    this.shopService.setShopParams(params)
    this.getProduct()
  }
  onReset()
  {
    this.searchTerm.nativeElement.value =''
    this.shopParams = new ShopParams()
    this.shopService.setShopParams(this.shopParams)
    this.getProduct()
  }

}
