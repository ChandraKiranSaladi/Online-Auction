import { Item } from "../models/Item";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import * as moment from 'moment';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Schedule } from "../models/Schedule";
import { Bid } from "../models/Bids";

@Injectable({ providedIn: "root" })
export class ItemService {
  baseUrl = environment.apiUrl;
  private items: Item[] = [];
  private itemUpdated = new Subject<Item[]>();
  constructor(private http: HttpClient, private router: Router) {}

  getItems() {
    this.http
      .get<{ message: String; data: { items: any } }>(this.baseUrl + "/item")
      .pipe(
        map(itemData => {
          return itemData.data.items.map(item => {
            return {
              id: item._id,
              title: item.title,
              content: item.content,
              date: item.date,
              initialBidPrice: item.initialBidPrice,
              time: { start: item.time.start, end: item.time.end },
              imagePath: item.imagePath
            };
          });
        })
      )
      .subscribe(transformedData => {

        transformedData.forEach(ele => {
          ele.date = moment(ele.date).format("MM/DD/YYYY");
          ele.isScheduled = moment(ele.date).isBefore(new Date());
          console.log("scheduled ",ele.isScheduled,"date ",ele.date);
        })
        this.items = transformedData;
        this.itemUpdated.next([...this.items]);
      });
  }

  getSlots(date: string) {
    return this.http.get<{ status: string; message: string; data: [] }>(
      this.baseUrl + "/schedule/slots/" + date
    );
  }
  getItemUpdateListener() {
    return this.itemUpdated.asObservable();
  }

  getItem(id: string) {
    return this.http.get<{
      data: any }>(this.baseUrl + "/item/" + id);
  }

  getBids(id: string) {
    return this.http.get<{data: any}>(this.baseUrl + "/bid/history/" + id);
  }

  updateItem(
    id: string,
    title: string,
    content: string,
    date: string,
    price: string,
    start: string,
    end: string,
    image: File
  ) {
    const itemData = new FormData();
    itemData.append("id", id);
    itemData.append("title", title);
    itemData.append("content", content);
    itemData.append("price", price);
    itemData.append("start", start);
    itemData.append("end", end);
    itemData.append("date", date);
    itemData.append("image", image, title);
    console.log(`updateItem: ${itemData}`);

    // const item: Item = { id: id, title: title, content: content, initialBidPrice: price, time: { start: start, end: end }, date: date, imagePath: imagePath };
    this.http
      .put<{ data: any }>(this.baseUrl + "/item/" + id, itemData)
      .subscribe(response => {
        const UpdatedItems = [...this.items];
        const OldItemIndex = UpdatedItems.findIndex(p => p.id === id);
        UpdatedItems[OldItemIndex] = response.data;
        this.items = UpdatedItems;
        this.itemUpdated.next([...this.items]);
        this.router.navigate(["/profile"]);
        console.log(response);
      });
  }

  addItem(
    title: string,
    content: string,
    date: string,
    price: string,
    start: string,
    end: string,
    image: File
  ) {
    const itemData = new FormData();
    itemData.append("title", title);
    itemData.append("content", content);
    itemData.append("price", price);
    itemData.append("start", start);
    itemData.append("end", end);
    itemData.append("date", date);
    itemData.append("image", image, title);
    console.log(`additem: ${itemData}`);

    // const item1 = { "item": { title, content, price, start, end, date, "image": image}};
    this.http
      .post<{ message: string; data: { item: Item } }>(
        this.baseUrl + "/item/create",
        itemData
      )
      .subscribe(responseData => {
        console.log("date : " + JSON.stringify(responseData));
        const item: Item = {
          id: responseData.data.item.id,
          title: title,
          content: content,
          date: date,
          initialBidPrice: price,
          time: { start: start, end: end },
          imagePath: responseData.data.item.imagePath,
          isScheduled: false
        };

        this.items.push(item);
        this.itemUpdated.next([...this.items]);
        this.router.navigate(["/profile"]);
      });
  }

  deleteItem(id: string) {
    return this.http.delete<{ status: string; message: string; data: [] }>(
      this.baseUrl + "/item/" + id
    );
  }

  getCurrentItem() {
    return this.http.get(this.baseUrl + "/schedule/getCurrent");
  }

  getCurrentBid(itemId: string) {
    return this.http.get<{ userId: string, bidPrice: string, itemId: string, time: string}>(this.baseUrl + "/item/currentBid/" + itemId);
  }

  getItemsByDate(date: string) {
    return this.http.get(this.baseUrl + "/item/itemsByDate/" + date);
  }

  getItemSellerDetails(userId: string) {
    return this.http.get<{data: any}>(this.baseUrl + "/user/" + userId);
  }
  createSchedule(schedule: Schedule) {
    return this.http
      .post(this.baseUrl + "/schedule/create", { schedule: schedule })
      .pipe(
        map(res => {
          return res["status"] === "success";
        })
      );
  }

  createBid(bid: Bid) {
    return this.http.post(this.baseUrl + "/bid/create", bid);
  }

  getAllItems() {

    return this.http.get<{ message: String, data: any }>(this.baseUrl + '/item/all')
      .pipe(map((itemData) => {
        return itemData.data.map(item => {
          return {
            id: item._id,
            title: item.title,
            content: item.content,
            date: item.date,
            price: item.initialBidPrice,
            start: item.time.start,
            end: item.time.end,
            imagePath: item.imagePath
          };
        });
      }))
      ;
  }
}
