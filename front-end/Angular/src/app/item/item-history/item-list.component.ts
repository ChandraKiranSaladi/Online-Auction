import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';

import { Item } from '../item.model';
import { ItemService } from '../item.service';
@Component({

    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  isLoading = false;
  private itemSub: Subscription;
  // To add a service , add a constructor
  constructor(public itemService: ItemService) {


  }

  ngOnInit() {
    this.isLoading = true;
    this.itemService.getItems();
    this.itemSub = this.itemService.getItemUpdateListener().subscribe((items: Item[]) => {
        this.isLoading = false;
        this.items = items;
    });
  }

  ngOnDestroy() {
    this.itemSub.unsubscribe();
  }

}


