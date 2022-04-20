import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, of } from 'rxjs';
import { IBrand } from '../shared/models/brand';
import { IPagination, Pagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService  {
  baseUrl = 'https://localhost:5001/api/'
  products:IProduct[] = []
  brands:IBrand[] = []
  types: IType[] = []
  pagination = new Pagination()
  shopParams = new ShopParams()
  productCache = new Map()

  constructor(private http:HttpClient) { }

  //getProduct(shopParams:ShopParams){
    getProduct(useCache:boolean){

      if(useCache==false){
        this.productCache = new Map()
      }
      if(this.productCache.size > 0 && useCache==true){
        if(this.productCache.has(Object.values(this.shopParams).join('-'))){
          this.pagination.data = this.productCache.get(Object.values(this.shopParams).join('-'))
          return of(this.pagination)
        }
      }


    let params = new HttpParams()
    if(this.shopParams.brandId != 0)
    {
      params = params.append('brandId',this.shopParams.brandId.toString())
    }
    if(this.shopParams.typeId != 0)
    {
      params = params.append('typeId',this.shopParams.typeId.toString())
    }
    if(this.shopParams.search)
    {
      params = params.append('search',this.shopParams.search)
    }
    
      params = params.append('sort',this.shopParams.sort)
      params = params.append('pageSize',this.shopParams.pageSize.toString())
      params = params.append('pageIndex',this.shopParams.pageNumber.toString())
    
    return this.http.get<IPagination>(this.baseUrl+'products',{observe:'response',params})
    .pipe(map(response=>{
     // this.products = response.body.data
     // this.products = [...this.products,...response.body.data]
     this.productCache.set(Object.values(this.shopParams).join('-'),response.body.data)
      this.pagination = response.body
      return this.pagination
    }))
  }

  setShopParams(params:ShopParams){
    this.shopParams = params

  }
  getShopParams(){
    return this.shopParams
  }
  getBrand(){
    if(this.brands.length > 0){
      return of(this.brands)
    }
    return this.http.get<IBrand[]>(this.baseUrl+'products/brands').pipe(
      map(response=>{
        this.brands = response
        return response
      })
    )
  }
  getType(){
    if(this.types.length > 0){
      return of(this.types)
    }
    return this.http.get<IType[]>(this.baseUrl+'products/types').pipe(
      map(response=>{
        this.types = response
        return response
      })
    )
  }

  getProductDetail(id:number)
  {
   // const product = this.products.find(p=>p.id== id)
   let product:IProduct
   this.productCache.forEach((products:IProduct[])=>{
     product = products.find(p=>p.id=== id)
   })
    if(product)
    {
      return of(product)
    }
    return this.http.get<IProduct>(this.baseUrl+'products/'+id)
  }

}
