import { Item } from '../models/Item';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class ItemService {

  private items: Item[] = [];
  private itemUpdated = new Subject<Item[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getItems() {

    this.http.get<{message: String, items: any}>('http://localhost:3000/api/items')
      .pipe(map((itemData) => {
          return itemData.items.map(item => {
            return {
              id: item._id,
              title: item.title,
              content: item.content,
              date: item.date,
              price: item.price,
              start: item.start,
              end: item.end,
              imagePath: item.imagePath
            };
          });
      }))
      .subscribe((transformedData) => {
        this.items = transformedData;
        this.itemUpdated.next([...this.items]);
      });
  }

  getItemUpdateListener() {
    return this.itemUpdated.asObservable();
  }

  getItem(id: String) {
    return this.http.get<{_id: string, title: string, content: string, date: string, price: string,
                            start: string, end: string }>('http://localhost:3000/api/items/' + id);
  }

  updateItem(id: string,  title: string, content: string, date: string, price: string, start: string, end: string ) {
    const item: Item = { id: id, title: title, content: content, price: price, start: start, end: end, date: date, imagePath: null};
    this.http.put<{}>('http://localhost:3000/api/items/' + id, item)
      .subscribe(response => {
        const UpdatedItems = [...this.items];
        const OldItemIndex = UpdatedItems.findIndex(p => p.id === id );
        UpdatedItems[OldItemIndex] = item;
        this.items = UpdatedItems;
        this.itemUpdated.next([...this.items]);
        this.router.navigate(['/']);
        console.log(response);
      });
  }

  addItem( title: string, content: string, date: string, price: string, start: string, end: string, image: File) {

    const itemData = new FormData();
    itemData.append('title', title);
    itemData.append('content', content);
    itemData.append('price', price);
    itemData.append('start', start);
    itemData.append('end', end);
    itemData.append('date', date);
    itemData.append('image', image, title);
    console.log(`additem: ${itemData}`);
    this.http.post<{message: string, item: Item }>('http://localhost:3000/api/items/create', itemData)
      .subscribe((responseData) => {
          const item: Item = {id: responseData.item.id, title: title, content: content, date: date, price: price,
                              start: start, end: end, imagePath: responseData.item.imagePath };
          console.log(responseData);
          this.items.push(item);
          this.itemUpdated.next([...this.items]);
          this.router.navigate(['/']);
      });


  }
}
