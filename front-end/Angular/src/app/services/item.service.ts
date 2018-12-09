import { Item } from '../models/Item';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class ItemService {
  baseUrl = environment.apiUrl;
  private items: Item[] = [];
  private itemUpdated = new Subject<Item[]>();
  constructor(private http: HttpClient, private router: Router) {}

  getItems() {

    this.http.get<{message: String, data: { items: any}}>(this.baseUrl + '/item')
      .pipe(map((itemData) => {
          return itemData.data.items.map(item => {
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

  getSlots(date: string) {

    return this.http.get<{status: string, message: string, data: []}>(this.baseUrl + '/schedule/slots/' + date);

  }
  getItemUpdateListener() {
    return this.itemUpdated.asObservable();
  }

  getItem(id: String) {
    return this.http.get<{data: {_id: string, title: string, content: string, date: string, initialBidPrice: string,
                            start: string, end: string} }>(this.baseUrl + '/item/' + id);
  }

  updateItem(id: string,  title: string, content: string, date: string, price: string, start: string, end: string ) {
    const item: Item = { id: id, title: title, content: content, price: price, start: start, end: end, date: date, imagePath: null};
    this.http.put<{}>(this.baseUrl + '/item/' + id, item)
      .subscribe(response => {
        const UpdatedItems = [...this.items];
        const OldItemIndex = UpdatedItems.findIndex(p => p.id === id );
        UpdatedItems[OldItemIndex] = item;
        this.items = UpdatedItems;
        this.itemUpdated.next([...this.items]);
        this.router.navigate(['/item/items']);
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

    // const item1 = { "item": { title, content, price, start, end, date, "image": image}};
    this.http.post<{message: string, data: { item: Item} }>(this.baseUrl + '/item/create', itemData )
      .subscribe((responseData) => {
          console.log('date : ' + JSON.stringify(responseData));
          const item: Item = {id: responseData.data.item.id, title: title, content: content, date: date, price: price,
                              start: start, end: end, imagePath: responseData.data.item.imagePath };

          this.items.push(item);
          this.itemUpdated.next([...this.items]);
          this.router.navigate(['/item/items']);
      });


  }
}
