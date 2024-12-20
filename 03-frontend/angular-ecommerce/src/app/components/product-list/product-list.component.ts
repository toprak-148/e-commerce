import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products:Product[] = [];
  currentCategoryId : number = 1;
  previousCategoryId:number=1;
  searchMode:boolean = false;

  // new properties for pagination
  thePageNumber:number = 1;
  thePageSize:number = 5;
  theToltalElements:number = 5;


  previousKeyword:string = "";


  constructor(private productService:ProductService,
              private route:ActivatedRoute,
              private cartService:CartService
  )
  { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
        this.listProducts();
      }
    )
  }


  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode)
    {
      this.handleListProducts();
    }
    else{
      this.handleSearchProduct();
    }

  }


  handleSearchProduct(){
    const theKeyWord:string = this.route.snapshot.paramMap.get('keyword')!;


    //*if we have a different keyword than previous
    //*then set thePageNumber to 1
    if(this.previousKeyword != theKeyWord)
    {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyWord;

    console.log(`keywod=${theKeyWord} , thePageNumber=${this.thePageNumber}`);


    //*now search for the products using keyword
    this.productService.searchProductPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               theKeyWord).subscribe(this.processResult());
  }



  handleListProducts()
  {

    //check if 'id' parameter is avaiblable
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId)
    {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

    }
    else{
      //not category id available ... default to category id 1
      this.currentCategoryId = 1;

    }

    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed.

    //if have a different category id than previous
    //then set thePageNumber back to 1

    if(this.previousCategoryId!= this.currentCategoryId)
    {
      this.thePageNumber = 1;
    }
    this.previousCategoryId =this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId} , thePageNumber:${this.thePageNumber}`);




    //now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                              this.currentCategoryId ).subscribe(this.processResult());
  }


  updatePageSize(pageSize:string)
  {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();



  }

  processResult()
  {
    return  ( data:any) =>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theToltalElements = data.page.totalElements;

    }
  }


  addToCart(tempProduct:Product)
  {
    console.log(`Adding to cart:${tempProduct} , ${tempProduct.unitPrice}`);

    //*TODO... do the real work

    const theCartItem = new CartItem(tempProduct);

    this.cartService.addToCart(theCartItem);



  }




}
