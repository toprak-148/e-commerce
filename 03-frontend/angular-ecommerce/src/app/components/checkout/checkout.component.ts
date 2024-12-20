import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Td005ShopFormService } from 'src/app/services/td005-shop-form.service';
import { TD005Validators } from 'src/app/validators/td005-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup:FormGroup| any;
  totalPrice:number = 0;
  totalQuintity:number = 0;

  creaditCardYears:number[] = [];
  creditCardMonths:number[] = [];

  countries:Country[] = [];


  shippingAddressStates:State[] = [];
  billingAddressStates:State[] = [];

  //depedency injection
  constructor(private formBuilder:FormBuilder,
              private td005FormService:Td005ShopFormService
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer:this.formBuilder.group({
        firstName:new FormControl('', [Validators.required,Validators.minLength(2),TD005Validators.notOnlyWhitespace] ),
        lastName:new FormControl('',[Validators.required,Validators.minLength(2),TD005Validators.notOnlyWhitespace] ),
        email:new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      //teslimat adresi
      shippingAddress:this.formBuilder.group({
        street: new FormControl('',[Validators.required,Validators.minLength(2),TD005Validators.notOnlyWhitespace]),
        city:new FormControl('',[Validators.required,Validators.minLength(2),TD005Validators.notOnlyWhitespace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required,Validators.minLength(2),TD005Validators.notOnlyWhitespace]),

      }),
      //fatura adresi
      billingAddress:this.formBuilder.group({
        street: new FormControl('',[Validators.required,Validators.minLength(2),TD005Validators.notOnlyWhitespace]),
        city:new FormControl('',[Validators.required,Validators.minLength(2),TD005Validators.notOnlyWhitespace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required,Validators.minLength(2),TD005Validators.notOnlyWhitespace]),
      }),
      //kredi kartı bilgileri
      creditCard:this.formBuilder.group({
        cardType:new FormControl('',[Validators.required]),
        nameOnCard:new FormControl('',[Validators.required,Validators.minLength(2),TD005Validators.notOnlyWhitespace]),
        cardNumber:new FormControl('',[ Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode:new FormControl('',[ Validators.required,Validators.pattern('[0-9]{3}')]),
        expirationYear:[''],
      }),



    })

    //populate credit card months
    const startMonth:number = new Date().getMonth() + 1;
    console.log("startMonth : " + startMonth);


    this.td005FormService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        console.log("Retrieved credit card months :" + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )


    this.td005FormService.getCreaditCardYears().subscribe(
      data=>{
        console.log("Retrieved credit card years : " + JSON.stringify(data));
        this.creaditCardYears = data;
      }
    )

    //populate countries

    this.td005FormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )

  }

  onSubmit()
  {
    console.log("AA Bana resmen tikladin");

    if(this.checkoutFormGroup.invalid)
    {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value);

    console.log("the shipping address country   is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);

    console.log("the shipping address state   is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);


  }

  //!customer
  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }

  //!shippingAddress
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }


   //!BillingAddress
   get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street'); }
   get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city'); }
   get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state'); }
   get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode'); }
   get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country'); }





  //!Credit Card

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode'); }







  //!billingAddress

  copyShippingAddressToBillingAddress(event:any)
  {
    if(event.target.checked)
    {
      this.checkoutFormGroup.controls.billingAddress
          .setValue(this.checkoutFormGroup.controls.shippingAddress.value);


      //* bug fix for states
      this.billingAddressStates = this.shippingAddressStates;

    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      //* bug fix for states
      this.billingAddressStates = [];

    }
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear:number = new Date().getFullYear();
    const selectedYear:number = Number(creditCardFormGroup.value.expirationYear);

    //* if the current year equals the selected year,then start with the current

    let startMonth:number;

    if(currentYear === selectedYear)
    {
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }

    this.td005FormService.getCreditCardMonths(startMonth).subscribe(
      data=>{
        console.log("Retrieved credit card months:"  + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );


  }


  getStates(formGroupName: string) {
      const formGroup = this.checkoutFormGroup.get(formGroupName);

      const countryCode = formGroup.value.country.code;
      const countryName = formGroup.value.country.name;


      console.log(`${formGroupName} country code : ${countryCode}`);
      console.log(`${formGroupName} country name : ${countryName}`);

      this.td005FormService.getStates(countryCode).subscribe(
        data =>{
          if(formGroupName === 'shippingAddress'){
            this.shippingAddressStates = data;
          }
          else{
            this.billingAddressStates = data;
          }
          // select first item by default
          formGroup.get('state').setValue(data[0]);
        }

      );
    }

}
