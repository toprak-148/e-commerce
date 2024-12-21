import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from 'src/app/config/my-app-config';
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  oktaSignIn:any;



  //  injection okta service
  constructor(@Inject(OKTA_AUTH) private oktaAuth:OktaAuth) {
    // okta login widget
    this.oktaSignIn = new OktaSignIn({
      logo:'assets/image/logo.png',
      baseUrl:myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId:myAppConfig.oidc.clientId,
      readirectUri:myAppConfig.oidc.redirectUri,
      authParams:{
        pkce:true,
        issuer:myAppConfig.oidc.issuer,
        scopes:myAppConfig.oidc.scopes
      }

    });


   }

  ngOnInit(): void {

  }


}
