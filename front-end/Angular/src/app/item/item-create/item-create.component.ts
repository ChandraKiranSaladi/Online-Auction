import { Component, OnInit } from "@angular/core";

import * as moment from "moment";
import { Item } from "../../models/Item";
import { ItemService } from "../../services/item.service";
import { ParamMap, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-item-create",
  templateUrl: "./item-create.component.html",
  styleUrls: ["./item-create.component.css"]
})
export class ItemCreateComponent implements OnInit {
  selected = '';
  minDate = new Date();
  maxDate = moment().add(30,'days').toDate();
  isSlots = false;
  enteredTitle = "";
  enteredContent = "";
  private mode = "create";
  form: FormGroup;
  isLoading = false;
  imagePreview: string;
  private itemId = "";
  item: Item;
  slots = [];
  constructor(public itemService: ItemService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: Validators.required }),
      price: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.pattern("^[0-9]*$")
        ]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      // start: new FormControl(null, {validators: [Validators.required]}),
      // end: new FormControl(null, {validators: [Validators.required]}),
      // time: new FormControl(null, {validators: [Validators.required]}),
      slot: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null, { validators: Validators.required })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("itemId")) {
        this.mode = "edit";
        this.itemId = paramMap.get("itemId");
        this.isLoading = true;
        this.itemService.getItem(this.itemId).subscribe(itemData => {
          console.log(JSON.stringify(itemData));
          this.isLoading = false;
          this.item = {
            id: itemData.data._id,
            title: itemData.data.title,
            date: itemData.data.date,
            content: itemData.data.content,
            initialBidPrice: itemData.data.initialBidPrice,
            time: { start: itemData.data.start, end: itemData.data.end },
            imagePath: null,
            isScheduled: moment(itemData.data.date).isBefore(new Date())
          };

          this.selected = this.item.time.start + "-" + this.item.time.end;

          this.itemService
            .getSlots(moment(this.item.date).format("YYYYMMDD"))
            .subscribe(response => {
              this.isSlots = true;
              response.data.forEach(ele =>
                this.slots.push(ele["start"] + "-" + ele["end"])
              );
              console.log(this.slots);
            });

          console.log(JSON.stringify(this.item.title));
          // setValue allows you to set values of all the inputs
          this.form.controls["title"].setValue(this.item.title);
          this.form.controls["content"].setValue(this.item.content);
          this.form.controls["price"].setValue(this.item.initialBidPrice);
          // this.form.controls['start'].setValue(this.item.start);
          // this.form.controls['end'].setValue(this.item.end);
          this.form.controls["date"].setValue(new Date(this.item.date));
          this.form.controls["slot"].setValue(this.selected);
        });
      } else {
        this.mode = "create";
        this.itemId = null;
      }
    });
  }

  OnSaveItem() {
    console.log(moment(this.form.get("date").value).format("DD-MM-YYYY"));
    if (this.form.invalid) {
      console.log("invalid");
      return;
    }
    const startTime = this.form.value.slot.split("-")[0];
    const endTime = this.form.value.slot.split("-")[1];
    this.isLoading = true;
    if (this.mode === "create") {
      console.log("form.value.title: " + this.form.value.title);
      console.log("form.value.content: " + this.form.value.content);
      this.itemService.addItem(
        this.form.value.title,
        this.form.value.content,
        moment(this.form.value.date).format("YYYY-MM-DD"),
        this.form.value.price,
        startTime,
        endTime,
        this.form.value.image
      );
    } else {
      console.log("form.value.title: " + this.form.value.title);
      console.log("form.value.content: " + this.form.value.content);
      this.itemService.updateItem(
        this.itemId,
        this.form.value.title,
        this.form.value.content,
        moment(this.form.value.date).format("YYYY-MM-DD"),
        this.form.value.price,
        startTime,
        endTime,
        this.form.value.image
      );
    }
    // this.form.reset();
  }
  // singlesign on, primary seconday, security protocols: saml, openOauth, openId, SSL/tls, memchachong, compression.
  // general implementation. 20-30 html, 20 xml, 20 serveLets, jsps, 20, webservices, 20 security.
  // length paper, be specific. to the point. two differences. means two differences.
  // 1 / 2 questions might be big. 20 minute questions.
  OnImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // patchValue allows to control the value of single input
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  OnDatePicked(event: Event) {
    const date = (event.target as HTMLInputElement).value;
    console.log(date);
    this.itemService
      .getSlots(moment(date).format("YYYYMMDD"))
      .subscribe(response => {
        this.isSlots = true;
        this.slots = [];
        response.data.forEach(ele =>
          this.slots.push(ele["start"] + "-" + ele["end"])
        );
        console.log("--------------", this.slots);
      });
  }

  // OnSlotPicked( event: Event) {
  //   const slot = (event.target as HTMLInputElement).value;
  //   console.log(slot);
  //   // this.form.patchValue({start: slot.start});
  // }
}
