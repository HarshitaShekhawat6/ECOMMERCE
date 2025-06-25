import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName: string = '';
  userName: string = '';
  searchResult: undefined | product[];
  cartItems = 0;

  constructor(
    private route: Router,
    private product: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.events.subscribe((val: any) => {
        if (val instanceof NavigationEnd) {
          if (localStorage.getItem('seller') && val.url.includes('seller')) {
            let sellerStore = localStorage.getItem('seller');
            let sellerData = sellerStore && JSON.parse(sellerStore)[0];
            this.sellerName = sellerData?.name;
            this.menuType = 'seller';
          } else if (localStorage.getItem('user')) {
            let userStore = localStorage.getItem('user');
            let userData = userStore && JSON.parse(userStore);
            this.userName = userData?.name;
            this.menuType = 'user';
            this.product.getCartList(userData.id);
          } else {
            this.menuType = 'default';
          }
        }
      });

      let cartData = localStorage.getItem('localCart');
      if (cartData) {
        this.cartItems = JSON.parse(cartData).length;
      }
      this.product.cartData.subscribe((items) => {
        this.cartItems = items.length;
      });
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('seller');
      this.route.navigate(['/']);
    }
  }

  userLogout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      this.route.navigate(['/user-auth']);
      this.product.cartData.emit([]);
    }
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.product.searchProduct(element.value).subscribe((result) => {
        if (result.length > 5) {
          result.length = 5; // limit to 5 results for UI clarity
        }
        this.searchResult = result;
      });
    }
  }

  hideSearch() {
    this.searchResult = undefined;
  }

  redirectToDetails(id: number) {
    this.route.navigate(['/details/' + id]);
  }

  submitSearch(val: string) {
    this.route.navigate([`search/${val}`]);
  }
}
