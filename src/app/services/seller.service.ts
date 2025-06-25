import { EventEmitter, Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { login, signUp } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError = new EventEmitter<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  userSignUp(data: signUp) {
    this.http.post('http://localhost:3000/seller', data, { observe: 'response' })
      .subscribe((result) => {
        if (result && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('seller', JSON.stringify(result.body));
          this.router.navigate(['seller-home']);
        }
      });
  }

  reloadSeller() {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('seller')) {
        this.isSellerLoggedIn.next(true);
        this.router.navigate(['seller-home']);
      }
    }
  }

  userLogin(data: login) {
    this.http.get(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
      { observe: 'response' }).subscribe((result: any) => {
        if (isPlatformBrowser(this.platformId)) {
          if (result && result.body && result.body.length === 1) {
            this.isLoginError.emit(false);
            localStorage.setItem('seller', JSON.stringify(result.body));
            this.router.navigate(['seller-home']);
          } else {
            this.isLoginError.emit(true);
          }
        }
      });
  }
}
