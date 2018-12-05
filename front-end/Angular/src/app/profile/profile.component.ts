import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/User';
import { Item } from '../models/Item';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ProfileService } from '../services/profile.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  user: User;
  isEdit = false;
  isAdmin = false;
  items: Item[] = [];
  displayedColumns = ['name', 'initialBidPrice', 'auctionDateTime'];
  dataSource = null;
  error: String = '';
  profileLoading: Boolean = true;

  constructor(private profileService: ProfileService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.profileService.getUserDetails().subscribe(
      (data) => {
        const user_data = data['data'];
        user_data['role'] = this.authService.getRole();
        this.user = Object.assign(new User, user_data);
        this.isAdmin = this.user.role.toLowerCase() === 'admin';
        this.error = '';
        this.profileLoading = false;
      },
      (err) => {
        console.log(err);
        this.error = 'Failed to fetch User Details.';
        this.profileLoading = false;
      }
    );
    // API
    // for (let i = 0; i < 10; i++) {
    //   const element = new Item();
    //   element.title = 'element ' + i;
    //   element.initialBidPrice = 2 * i + 0.5 * i;
    //   element.auctionDateTime = new Date(new Date().getTime() - i * 5000);
    //   this.items.push(element);
    // }
    this.dataSource = new MatTableDataSource(this.items);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  saveProfile() {
    this.isEdit = !this.isEdit;
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
