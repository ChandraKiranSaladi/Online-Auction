import { Component, OnInit } from "@angular/core";
import { ItemService } from "../services/item.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Item } from "../models/Item";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

// var ELEMENT_DATA = [
//   // {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   // {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   // {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   // {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   // {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   // {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   // {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   // {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   // {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   // {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: "app-bid-history",
  styleUrls: ["./bidhistory.component.css"],
  templateUrl: "./bidhistory.component.html"
})
export class BidHistoryComponent implements OnInit {
  ELEMENT_DATA = [];
  datasource = [];
  item: Item;
  users = [];
  ItemTitle = "";
  private itemId = "";
  displayedColumns: string[] = ["UserId", "BidPrice"];

  constructor(private itemService: ItemService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("itemId")) {
        this.itemId = paramMap.get("itemId");
        this.itemService.getItem(this.itemId).subscribe(itemData => {
          console.log(JSON.stringify(itemData));
          this.ItemTitle = itemData.data.title;
        });

        this.itemService.getBids(this.itemId).subscribe(bids => {
          console.log("bids",bids);
          bids.data.forEach(element => {
            const bid = {
              id: element.userId,
              price: element.bidPrice
            };
            this.ELEMENT_DATA.push(bid);
          });
          console.log(this.ELEMENT_DATA);
          this.datasource = this.ELEMENT_DATA;
        });

      }
    });
  }
}
