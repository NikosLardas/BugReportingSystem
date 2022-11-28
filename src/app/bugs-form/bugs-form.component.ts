/*
    Typescript Code for the Bugs Form Component
    Author: Nikos Lardas
    Created: 05.2022
*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BugsService } from '../services/bugs.service';
import { BugsDataComment } from '../model/bugs-data-comments';

@Component({
  selector: 'app-bugs-form',
  templateUrl: './bugs-form.component.html',
  styleUrls: ['./bugs-form.component.scss']
})
export class BugsFormComponent implements OnInit {

  /* Bug Form Data handling,
  Service Subscription and conditional variables
  */
  newBug: boolean = true;
  bugForm!: FormGroup;
  bugCreatedOrUpdated: boolean = false;
  bugData: any;
  editSubscription: any;

  // Bug comments array
  bugComments: BugsDataComment[] = [];

  // Component constructor
  constructor(private formBuilder: FormBuilder, private service: BugsService, private router: Router) {}

  ngOnInit(): void {

    /* Subscription Service Method for retrieving bug data for edit form
    from the bugDataEdit Observable */
    this.editSubscription = this.service.bugDataEdit.subscribe({
      next: bug => {
        /* When data is received, if not empty
        save data and make New Bug check to false
        */
        if(bug != '') {
          this.bugData = bug;
          this.newBug = false;
        }
      }
    });

    // Unsubscribe from Service Method after receiving bug data
    // to make sure only one active subscription exists at a time
    this.editSubscription.unsubscribe()

    // Bug Form Initialization and Validators definitions
    this.bugForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      priority: ['', [Validators.required]],
      reporter: ['', [Validators.required]],
      status: [''],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]],
      commentReporter: [''],
      commentDescription: ['']
    });

    /* In case the New Bug check is false and bug Data is not empty, 
    call local method to fill data */
    if(this.bugData != '' && this.newBug == false) this.fillData();

  }

  /* Method to add the required validator to status if the reporter is QA
  or remove it otherwise, and update value and validity */
  validateStatus() {

    if (this.bugForm.get('reporter')?.value == 'QA') {
      this.bugForm.get('status')?.setValidators(Validators.required);
      this.bugForm.get('status')?.updateValueAndValidity();
    } else {
      this.bugForm.get('status')?.clearValidators();
      this.bugForm.get('status')?.updateValueAndValidity();
    }
  }

  // Method to fill the form fields with the edited Bug Data
  fillData() {

    this.bugForm.get('title')?.setValue(this.bugData.title);
    this.bugForm.get('priority')?.setValue(this.bugData.priority);
    this.bugForm.get('reporter')?.setValue(this.bugData.reporter);
    this.bugForm.get('status')?.setValue(this.bugData.status);
    this.bugForm.get('description')?.setValue(this.bugData.description);
  }

  // Method to add a new comment to the bugComments array
  addComment() {
   
    let comment: BugsDataComment = {
      reporter: this.bugForm.get('commentReporter')?.value,
      description: this.bugForm.get('commentDescription')?.value
    }

    this.bugComments.push(comment);

    // Reset fields after adding comment to array
    this.bugForm.get('commentReporter')?.reset();
    this.bugForm.get('commentDescription')?.reset();
  }

  // Method to Submit the Bug Form
  formSubmit() {
  
    // Get form values
    let title = this.bugForm.get('title')?.value;
    let priority = this.bugForm.get('priority')?.value;
    let reporter = this.bugForm.get('reporter')?.value;
    let status = this.bugForm.get('status')?.value;
    let description = this.bugForm.get('description')?.value;

    // If a new Bug is being created, call the postData service Method
    if (this.newBug) {

      // Call Service Method for Creating a new Bug
      this.service.postData(title, priority, reporter, status, description).subscribe({
        next: () => {
          // Activate Success Message appearance on page
          this.bugCreatedOrUpdated = true;
          // Reset the form
          this.bugForm.reset();
          // Navigate to Home Page after 5 seconds
          setTimeout( () => {
            this.router.navigateByUrl('/');
         }, 5000);
        },
        // Log potential errors
        error: error => console.log(error),
        // Log message when data creation is finished
        complete: () => console.log('post finished')
      });

    // If a Bug is being edited, call the putData service Method
    } else {

      /* Get Bug id, create combined array of previous and new comments, 
      if any, else replicate previous comments array to maintain the data
      as well as the createdAt date */
      let id = this.bugData.id;
      let comments = this.bugData.comments? [...this.bugData.comments, ...this.bugComments] : [...this.bugComments];
      let createdAt = this.bugData.createdAt;

      // Call Service Method for Updating a Bug
      this.service.putData(id, title, priority, reporter, status, description, createdAt, comments).subscribe({
        next: () => {
          // Activate Success Message appearance on page
          this.bugCreatedOrUpdated = true;
          // Reset the form
          this.bugForm.reset();
          // Navigate to Home Page after 5 seconds
          setTimeout( () => {
            this.router.navigateByUrl('/');
         }, 5000);
        },
        // Log potential errors
        error: error => console.log(error),
        // Log message when data update is finished
        complete: () => console.log('put finished')
      });
    }
  }

}