import { Component, OnInit, ViewChild } from '@angular/core';

import { Item } from '../models/Item';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { ItemService } from '../services/item.service';
import * as moment from 'moment';
// import { start } from 'repl';
// import { startTimeRange } from '@angular/core/src/profile/wtf_impl';

import { extendMoment } from 'moment-range';
const moment1 = extendMoment(moment);



// const moment1 = MomentRange.extendMoment(Moment);

@Component({
  selector: 'app-item-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  items: Item[] = [];
  tempitems: Item[] = [];
  fitems: Item[] = [];
  searchWord = '';
  startDate = '';
  endDate = '';
  displayedColumns = ['title', 'date', 'price', 'start', 'end'];
  dataSource = null;
  error: String = '';
  profileLoading: Boolean = true;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    // API

    this.itemService.getAllItems().subscribe(transformedData => {
      for (let i = 0; i < transformedData.length; i++) {
        transformedData[i].date = moment(transformedData[i].date).format('YYYY-MM-DD');
        transformedData[i].time = {
          start: moment(transformedData[i].start).format('HH:mm:ss'),
          end: moment(transformedData[i].end).format('HH:mm:ss')
        }
      }
      this.items = transformedData;
      console.log('Hello', transformedData);
      // for (let i = 0; i < transformedData.length; i++) {
      //   const element = new Item();
      //   element.title = transformedData[i].title;
      //   element.date = transformedData[i].date;
      //   element.price = transformedData[i].price;
      //   element.start = transformedData[i].start;
      //   element.end = transformedData[i].end;
      //   // element.title = 'Shubham';
      //   // element.date = 'Shubham';
      //   // element.price = 'Shubham';
      //   // element.start = 'Shubham';
      //   // element.end = 'Shubham';
      //   this.items.push(element);
      // }
      this.dataSource = new MatTableDataSource(this.items);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
  applyFilter(filterValue: string) {
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applySearch1(searchWord: string) {
    this.searchWord = searchWord;
    this.applyFilter(this.searchWord);

  }
  applySearch2(startDate: string) {
    this.startDate = startDate;

  }
  applySearch3(endDate: string) {
    this.endDate = endDate;
    console.log(this.endDate);

  }

  applySearch() {

    const tempitems = this.items;
    console.log('tempitems', tempitems);
    this.fitems = [];
    for (let i = 0; i < this.items.length; i++) {

      if (this.withinRange(this.items[i].date)) {
        this.fitems.push(this.items[i]);
      }
    }
    console.log(this.fitems);
    this.dataSource = new MatTableDataSource(this.fitems);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.applyFilter(this.searchWord);

  }

  // withinRange(date: string) {
  //   const currentDate = new Date(date);
  //   const startDate = new Date(this.startDate);
  //   const endDate =  new Date(this.endDate);
  //   console.log(currentDate, startDate, endDate);
  //   if((currentDate.getTime() <= endDate.getTime() && currentDate.getTime() >= startDate.getTime()))
  //   {
  //     console.log('Yes');
  //     return true;
  //   }
  //   else {
  //     console.log('No');
  //     return false;

  //   }
  // }




  withinRange(date: string) {
    console.log('Here in withinRange');
    // const userdate = moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
    // const startDate = moment(this.startDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
    // const endDate = moment(this.endDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
    const userdate = moment(date, 'YYYY-MM-DD');
    const startDate = moment(this.startDate, 'YYYY-MM-DD');
    const endDate = moment(this.endDate, 'YYYY-MM-DD');
    console.log(userdate, startDate, endDate);
    const range = moment1.range(startDate, endDate);
    return range.contains(userdate);






  }
  //   // if (range.contains(userdate)) {

  //   //   return true;
  //   //   console.log('Yes');
  //   // } else {

  //   //   return false;
  //   //   console.log('No');
  //   // }


  //   // console.log(typeof userdate, typeof startDate, endDate);
  //   // tslint:disable-next-line:max-line-length
  //   // if ( moment(this.startDate).isSameOrBefore(moment(date) )
  //   //    && moment(date).isSameOrBefore(moment(this.endDate)) ) {
  //   //                   console.log('Yes');
  //   //                   return true;
  //   //             }
  //   //             else {
  //   //                  console.log('No');
  //   //                  return false;
  //   //                }

  // }


  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
}
