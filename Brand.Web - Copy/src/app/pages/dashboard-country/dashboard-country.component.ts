import { Card } from './../../classes/card';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from './../../classes/product';
import { GlobalDataService } from './../../services/global-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'krz-brand-dashboard-country',
  templateUrl: './dashboard-country.component.html'
})
export class DashboardCountryComponent implements OnInit {
  private routeSubscribe: any;
  country: string;
  pageTitle: string;
  productsForCountry: Product[];
  brands: Card[] = [];

  constructor(
    private route: ActivatedRoute,
    private globalDataService: GlobalDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSubscribe = this.route.params.subscribe(params => {
       this.country = params['country'];
    });
    this.productsForCountry = this.globalDataService.allProducts
      .filter(product => product.country === this.country);
    this.pageTitle = this.productsForCountry.length + " PRODUCTS FOUND FOR " + this.country.toUpperCase();
    this.getBrandsGroups();
  }

  getBrandsGroups(): void {
    this.productsForCountry.forEach(product => {
      let isAlreadyActiveBrand = false;
      for (let i = 0; i < this.brands.length; i++) {
        if (this.brands[i].name === product.brand) {
          isAlreadyActiveBrand = true;
          this.brands[i].count++;
          break;
        }
      }
      if (!isAlreadyActiveBrand) {
        this.brands.push({
          name: product.brand,
          count: 1,
          type: 'brand'
        });
      }
    });

    this.brands = this.brands.sort((n1, n2) => n2.count - n1.count);

    this.brands.forEach(brands => {
      brands.percentage = ((brands.count / this.productsForCountry.length) * 100).toFixed(2);
    });
  }

  open(event: any, brand: Card): void {
    if (brand.type === 'brand') {
      this.router.navigateByUrl('/dashboard/' + this.country + '/' + brand.name.split(' ').join(''));
    }
  };
}
