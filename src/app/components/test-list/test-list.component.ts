import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css'],
})
export class TestListComponent implements OnInit {
  allTests: any[] = [];
  constructor(private _api: ApiService) {}

  ngOnInit(): void {
    console.log('ng on init');
    this.getData();
  }

  getData() {
    this._api.getData().subscribe({
      next: (data: any) => {
        this.allTests = data.tests;
        console.log(this.allTests);
      },
    });
  }
}
