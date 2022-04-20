//import uuid from 'uuid'

import {v4 as uuidv4} from 'uuid'
// import * as uuid from 'uuid';
export interface IBasket{
    id:string
    items:IBasketItem[]
    clientSecret?:string
    deliveryMethodId?:number
    paymentIntentId?:string
    shippingPrice?:number
}

export interface IBasketItem{
    id: number
    productName: string
    price: number
    quantity: number
    pictureUrl: string
    brand: string
    type: string
}

export class Basket implements IBasket
{

     id=uuidv4()
    //id: uuid.value
    items: IBasketItem[] =[]

}

export interface IBasketTotals{
    shipping:number
    subtotal:number
    total:number
}