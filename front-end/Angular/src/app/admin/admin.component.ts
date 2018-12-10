import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import { ItemService } from '../services/item.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Schedule } from '../models/Schedule';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  slots = [];
  datePicked = false;
  message = '';
  error = '';
  form: FormGroup;
  minDate: Date;
  isLoading = false;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.form = new FormGroup({
      date: new FormControl(null, { validators: [Validators.required] }),
      startTime: new FormControl(null, { validators: [Validators.required] }),
      endTime: new FormControl(null, { validators: [Validators.required] }),
      numberItems: new FormControl(null, { validators: [Validators.required] })
    });
    this.minDate = moment().toDate()
    // this.minDate = moment().add(1, 'days').toDate()
  }

  OnDatePicked(event: Event) {
    const date = (event.target as HTMLInputElement).value;
    console.log(date);
    this.isLoading = true;
    this.itemService
      .getItemsByDate(moment(date).format("YYYYMMDD"))
      .subscribe(response => {
        this.isLoading = false;
        this.datePicked = true;
        if (response['data'].length)
          this.message = "Cannot modify schedule on this date. There are Items scheduled on this day.";
        else
          this.message = "";
        this.error = '';
      }, err => {
        this.isLoading = false;
        this.error = "Failed to Load the Schedule for this day";
        this.message = '';
      });
  }

  OnSaveSchedule() {

    if (this.form.invalid)
      return;
    console.log("should save the schedule");

    var schedule = new Schedule();
    schedule.items = [];
    schedule.date = moment(this.form.controls["date"].value).toString();
    schedule.time = {
      startTime: moment(this.form.controls["startTime"].value, "hh:mm a").format("HH:mm:ss"),
      endTime: moment(this.form.controls["endTime"].value, "hh:mm a").format("HH:mm:ss")
    }
    schedule.itemNumbers = this.form.controls["numberItems"].value;

    this.itemService.createSchedule(schedule).subscribe(
      (data) => {
        this.message = "Saved successfully.";
        this.error = '';
        this.form.reset();
      },
      (err) => {
        this.message = '';
        this.error = "Failed to save the changes."
        this.form.reset();
      });
  }

}
