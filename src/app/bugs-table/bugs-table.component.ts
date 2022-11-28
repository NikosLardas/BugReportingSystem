/*
    Typescript Code for the Bugs Table Component
    Author: Nikos Lardas
    Created: 05.2022
*/

import { BugsData } from './../model/bugs-data';
import { BugsService } from './../services/bugs.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bugs-table',
  templateUrl: './bugs-table.component.html',
  styleUrls: ['./bugs-table.component.scss']
})
export class BugsTableComponent implements OnInit {

  // Bugs Data Handling Variables
  results!: BugsData[];
  loading: boolean = true;

  // Sorting Variables & Table Headers
  ascSort: boolean = false;
  arrowDir: string = 'up';
  displayArrow: boolean = false;
  titleWithArrow!: string;
  tableTitles: string[] = ['title', 'priority', 'reporter', 'createdAt', 'status'];

  // Pagination Variables
  pageNumber: number = 0;
  lastPage: boolean = false;

  // Searching Form
  searchForm: any;

  // Component constructor
  constructor(private service: BugsService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {

    // Search Form Initialization
    this.searchForm = this.formBuilder.group({
      bugTitle: ['']
    });

    // Call Service Method for Data retrieval
    this.service.getData().subscribe({
      next: data => {
        // Save data
        this.results = data;
        // Turn loading to false
        this.loading = false;
      },
      // Log potential Errors
      error: error => console.log(error),
      // Log message when data retrieval is finished
      complete: () => console.log('get finished')
    });
  }

  // Navigate to Add Form
  navigateAddForm() {
    this.router.navigateByUrl('/addBug');
  }

  // Navigate to Edit Form
  navigateEditForm(bug:BugsData) {
    // First Pass Data for Bug to be Editing to Service
    // in order to be communicated with the Bug Form Component
    this.service.passDataEdit(bug);
    this.router.navigateByUrl('/editBug');
  }

  // Method to Data Deletion
  deleteData(bugId: bigint): void {

    // Call Service Method for Data Deletion
    this.service.deleteData(bugId).subscribe({
      next: data => {
        /* If deletion was successful, stop displaying sorting arrow
        turn to page 0, make lastPage check false and re-initialize component */ 
        if(data == true) {
          this.displayArrow = false;
          this.pageNumber = 0;
          this.lastPage = false;
          this.ngOnInit();
        }
      },
      // Log potential Errors
      error: error => console.log(error),
      // Log message when data deletion is finished
      complete: () => console.log('delete finished')
    });
  }

  // Method fpr Data Sorting
  sortData(field: string) {

    /* Set arrow display to true, title with arrow, 
    arrow direction and title for which to sort */
    this.displayArrow = true;
    this.titleWithArrow = field;
    this.arrowDir = this.arrowDir == 'down'? 'up' : 'down';
    let sortTitle = this.searchForm.get("bugTitle").value;

    // Call Service Method for Data Sorting
    this.service.sortData(field, this.ascSort, this.pageNumber, sortTitle).subscribe({
      // If sorting was successful, save data
      next: data => {
        this.results = data;
      },
      // Log potential Errors
      error: error => console.log(error),
      /* Change sorting value to prepare for possible next sorting call
      and log message when data sorting is finished 
      */
      complete: () => {
        this.ascSort = !this.ascSort;
        console.log('sorting finished');
      }
    });
  }

  // Table Pagination
  paginateData(action: string) {

    // Save current Page number before paginating and get the searching title if any
    let currentPage = this.pageNumber;
    let searchTitle = this.searchForm.get("bugTitle").value;

    // Increase or decrease pageNumber conditionally
    if(action === 'next' && this.lastPage == false) this.pageNumber++;
    else if (action === 'prev' && this.pageNumber > 0) this.pageNumber--;

    // If pageNumber was changed, call the pagination service method
    if (currentPage != this.pageNumber) {

      // Call Service Method for Data Pagination
      this.service.paginateData(this.pageNumber, !this.ascSort, this.titleWithArrow, searchTitle).subscribe({
        next: data => {
          /* If the new page contains data, save them and make last page check false
          else decrease pagenumber to correspond to current page and make last page check true
          to clarify we are now on the last page that contains data
          */
          if(data.length > 0) {
            this.results = data;
            if (this.lastPage) this.lastPage = false;
          } else {
            this.pageNumber--;
            this.lastPage = true;
          }

        },
        // Log potential Errors
        error: error => console.log(error),
        // Log message when data pagination is finished
        complete: () => console.log('pagination finished')
      })

    }
  }

  // Method for Data Searching by Title
  searchByTitle() {

    // Call Service Method for Data Searching by Title 
    this.service.getDataByTitle(this.searchForm.get("bugTitle").value).subscribe({
      next: data => {
        // Save Data
        this.results = data;
      },
      // Log potential errors
      error: error => console.log(error),
      // Log message when data searching is finished
      complete: () => console.log('get by title finished')
    });
  }

}