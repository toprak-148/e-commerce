import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { unwatchFile } from 'fs';
import { TypeModifier } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cardItems:CartItem[] = [];
  totalPrice:Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity:Subject<number> = new BehaviorSubject<number>(0);

  storage : Storage|any= sessionStorage;








  constructor() {
    //read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems'));


    if(data != null)
      this.cardItems = data;


    // compute totals based  on the data that is read from storage
    this.computeCartTotals();



  }

  addToCart(theCartItem:CartItem)
  {
      //check if we already have the item in our cart (ürünün zaten sepetimizde olup olmadığını kontrol etmek)
      let alreadyExistsInCart:boolean = false;
      let existingCartItem : CartItem | undefined = undefined;

      if(this.cardItems.length > 0)
      {
        //find the item in the cart based on item id ( öğe kimliğine göre sepetteki öğeyi bulmak)



        existingCartItem = this.cardItems.find(
          tempCartItem => tempCartItem.id === theCartItem.id
        );


        // for(let tempCartItem of this.cardItems)
        // {
        //   if(tempCartItem.id === theCartItem.id)
        //   {
        //     existingCartItem = tempCartItem;
        //     break;
        //   }

        // }

        //check if we found it ( öğenin varlığını kontrol etmek)
        alreadyExistsInCart = (existingCartItem != undefined);

      }


      if(alreadyExistsInCart)
      {
        //increment the quantity (miktarı artırmak)

        existingCartItem!.quantity += 1;


      }
      else{
        this.cardItems.push(theCartItem);

      }

      // compute cart total price and total total quantity

      this.computeCartTotals();






  }


  computeCartTotals()
  {

    let totalPriceValue :number = 0;
    let totalQuantityValue:number=0;

    for(let currentCartItem of this.cardItems)
    {
      //miktar * ürün bedeli
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }


    //publish the new values .... all subscribers will receive the new data

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);


    //log cart data just for debugging purpose
    this.logCartData(totalPriceValue,totalQuantityValue);

  }

  persisteCartItems(){
    this.storage.setItem('cartItem',JSON.stringify(this.cardItems));
  }


  logCartData(totalPriceValue:number,totalQuantityValue:number)
  {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cardItems)
    {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;

      console.log(`name : ${tempCartItem.name} , quantity= ${tempCartItem} , unitPrice=${tempCartItem.unitPrice} , subTotalPrice:${subTotalPrice}`) ;

    }

    console.log(`total price:${totalPriceValue.toFixed(2)} , totalQuantity:${totalQuantityValue}`);

    console.log("------------------");

  }

  decrementQuantity(theCartItem:CartItem)
  {
    theCartItem.quantity--;
    if(theCartItem.quantity === 0)
    {
      this.remove(theCartItem);
    }

  }
  remove(theCartItem: CartItem) {
      //get index of item in the array
      const itemIndex = this.cardItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

      //if found, remove the item from the array at he given index
      if(itemIndex > -1)
      {
        this.cardItems.splice(itemIndex,1);
        this.computeCartTotals();
      }
  }


}
