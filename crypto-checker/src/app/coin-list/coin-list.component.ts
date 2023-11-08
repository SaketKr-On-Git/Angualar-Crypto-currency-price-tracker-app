import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CurrencyService } from '../service/currency.service';



@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.css']
})
export class CoinListComponent implements OnInit {
  
  bannerData:any=[];
  currency:string="INR";
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['symbol', 'current_price', 'price_change_percentage_24h', 'market_cap'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

  constructor(private api:ApiService,private router:Router,private currencyService:CurrencyService){

  }
  ngOnInit(){
     this.getAllData();
     this.getBannerData();
     this.currencyService.getCurrency()
     .subscribe((val: string)=>{
      this.currency=val;
      this.getAllData();
     this.getBannerData();
     })
  }
  getAllData(){
    this.api.getCurrencyData(this.currency)
    .subscribe(res=>{
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  getBannerData(){
    this.api.getTrendingCurrency(this.currency)
     .subscribe(res=>{
      console.log(res);
      this.bannerData=res;
      
     })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  gotoDetails(row:any){
    this.router.navigate(['coin-detail',row.id]);
  }
  

}
