import { Component, OnInit } from '@angular/core';
import { login, signUp } from '../data-type';
import { SellerService } from '../services/seller.service';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent implements OnInit {
  showLogin = false;
  authError: string = '';

  constructor(private seller: SellerService) {}

  ngOnInit(): void {
    this.seller.reloadSeller();
  }

  signUp(data: signUp): void {
    console.warn('Sign-up data:', data);
    this.seller.userSignUp(data);
  }

  login(data: login): void {
    this.seller.userLogin(data);
    this.seller.isLoginError.subscribe((isError) => {
      this.authError = isError ? 'Email or password is incorrect' : '';
    });
  }

  openLogin() {
    this.showLogin = true;
    this.authError = '';
  }

  openSignUp() {
    this.showLogin = false;
    this.authError = '';
  }
}
