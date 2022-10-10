import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-warranty-tabs',
  templateUrl: './warranty-tabs.page.html',
  styleUrls: ['./warranty-tabs.page.scss'],
})
export class WarrantyTabsPage implements OnInit {
  selectedSegment: any;

  constructor(private location: Location) {}

  ngOnInit() {
    this.selectedSegment = 0;
  }

  navigateBack() {
    this.location.back();
  }
}
