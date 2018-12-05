import {Component, OnInit} from '@angular/core';

import * as moment from 'moment';
import { Item } from '../../models/Item';
import { ItemService } from '../../services/item.service';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';

@Component({

  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']

})
export class ItemCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  form: FormGroup;
  isLoading = false;
  imagePreview: string;
  private itemId = '';
  item: Item;

  constructor(public itemService: ItemService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: Validators.required}),
      price: new FormControl(null, {validators: [Validators.required, Validators.min(1)]}),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType]}),
      start: new FormControl(null, {validators: [Validators.required, Validators.max(23)]}),
      end: new FormControl(null, {validators: [Validators.required, Validators.max(23)]}),
      date: new FormControl(null, {validators: Validators.required})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('itemId')) {
        this.mode = 'edit';
        this.itemId = paramMap.get('itemId');
        this.isLoading = true;
        this.itemService.getItem(this.itemId).subscribe(itemData => {
        this.isLoading = false;
        this.item = {
                    id: itemData._id,
                    title: itemData.title,
                    date: itemData.date,
                    content: itemData.content,
                    price: itemData.price,
                    start: itemData.start,
                    end: itemData.end,
                    imagePath: null
                  };

        // setValue allows you to set values of all the inputs
        this.form.controls['title'].setValue(this.item.title);
        this.form.controls['content'].setValue(this.item.content);
        this.form.controls['price'].setValue(this.item.price);
        this.form.controls['start'].setValue(this.item.start);
        this.form.controls['end'].setValue(this.item.end);
        this.form.controls['date'].setValue(this.item.date);

        });
      } else {
        this.mode = 'create';
        this.itemId = null;
      }

    });
  }

  OnSaveItem() {
    console.log( moment(this.form.get('date').value).format('DD-MM-YYYY'));
    if (this.form.invalid) {
      console.log('invalid');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      console.log('form.value.title: ' + this.form.value.title );
      console.log('form.value.content: ' + this.form.value.content );
      this.itemService.addItem(this.form.value.title, this.form.value.content,
         moment(this.form.value.date).format('YYYY-MM-DD'),  this.form.value.price,
                                this.form.value.start, this.form.value.end, this.form.value.image);
    } else {
      console.log('form.value.title: ' + this.form.value.title );
      console.log('form.value.content: ' + this.form.value.content );
      this.itemService.updateItem(this.itemId, this.form.value.title, this.form.value.content, this.form.value.price,
                                  this.form.value.date, this.form.value.start, this.form.value.end);
    }
    // this.form.reset();
  }

  OnImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
     // patchValue allows to control the value of single input
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    } ;
    reader.readAsDataURL(file);
  }

}
