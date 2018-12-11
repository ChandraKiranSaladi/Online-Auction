import { Component, OnInit } from "@angular/core";
import { ItemService } from "../services/item.service";
import { Item } from "../models/Item";
import { Bid } from "../models/Bids";
import { interval } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  bidValue = "";
  price = "";
  name = "";
  user: any;
  CurrentBidNull = true;
  item: Item = null;
  currentBid: Bid = null;
  form: FormGroup;
  error = "";
  message = "";
  poll = null;
  subscription = null;
  constructor(
    private itemService: ItemService,
    private authService: AuthenticationService,
    public router: Router
  ) {}

  ngOnInit() {
    this.poll = interval(2000).pipe(
      startWith(0),
      switchMap(() => this.itemService.getCurrentItem())
    );
    this.subscription = this.poll.subscribe(
      item => {
        if (item["status"] === "success") {
          this.error = "";
          if (!item["data"]) {
            this.message = item["message"];
            this.item = null;
          } else {
            this.item = Object.assign(new Item, item["data"]);
            this.item.id = item['data']['_id'];
            // this.item = item["data"] !== this.item ? item["data"] : this.item;
            console.log("----------",this.item);
            this.message = "";
            console.log(this.item.id);
            this.itemService.getCurrentBid(this.item.id).subscribe(
              bid => {
                console.log(bid);
                if (!bid["data"]) {
                  this.message = bid["message"];
                  this.currentBid = null;
                  this.price = this.item.initialBidPrice;
                } else {
                  this.CurrentBidNull = false;
                  this.currentBid = bid["data"];
                  console.log(this.currentBid);
                  this.message = "";
                  this.price = this.currentBid.bidPrice;
                  this.itemService.getItemSellerDetails(this.currentBid.userId).subscribe( res => {
                    this.user = res.data;
                    console.log(res);
                    this.name = this.user.name.firstname;
                  });

                  // this.form.controls["bidForm"].setValue(this.currentBid.bidPrice);
                }
              },
              err => {
                // this.error = item['message'];
              }
            );
          }
        } else this.error = item["message"];
      },
      err => {
        this.error = err["message"];
        this.message = "";
      }
    );

    this.form = new FormGroup({
      bidForm: new FormControl(null, [
        Validators.required,
        Validators.min(Number.parseInt(this.price)),
        Validators.pattern("^[0-9]*$")])
    });
  }

  OnBid() {
    console.log(")))))"+ Number.parseInt(this.price));
    console.log("****** "+this.bidValue);
    if (this.form.invalid || Number.parseInt(this.price) >  this.form.get('bidForm').value) {
      console.log("invalid");
      return;
    }
    console.log("fired");
    const bid = new Bid();
    bid.bidPrice = this.form.get('bidForm').value,
    bid.itemId = this.item.id,
    bid.time = new Date().toDateString(),
    // bid.userId = null
    this.itemService.createBid(bid).subscribe(res => {
      console.log(res);
    });

  }
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
