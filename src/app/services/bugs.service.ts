/*
    Typescript Code for the Service of the Bug Reporter Application
    Author: Nikos Lardas
    Created: 05.2022
*/

import { BugsData } from './../model/bugs-data';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { BugsDataComment } from '../model/bugs-data-comments';

@Injectable({
  providedIn: 'root'
})
export class BugsService {

  /* Initialize a BehaviorSubject and make it an Observable,
  in order to be used for passing data from the Bugs Table to the Bugs Form component */
  private bugDataEditSource = new BehaviorSubject<any>('');
  bugDataEdit = this.bugDataEditSource.asObservable();

  // Service constructor
  constructor(private http: HttpClient) { }

  // Base Url for all API calls
  BaseUrl: string = 'https://bug-report-system-server.herokuapp.com/';

  // Http Options for all requests
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'code.hub.ng5.token'
    })
  }

  // GET Bugs

  // Method to Get all Bugs
  getData(): Observable<BugsData[]> {

    // Dynamic GET url creation
    let GETurl: string = `${this.BaseUrl}bugs`

    // Call the API using the GET Method, Url and Http options and return the data received from the API
    return this.http.get<BugsData[]>(GETurl, this.httpOptions)
      .pipe(
        // retry api call one more time in case of failure
        retry(1),
        // catch and display possible errors
        catchError(error => throwError(() => `Something went wrong: ${error}`))
      );
  }

  // DELETE Bug

  // Method to Delete a Bug
  deleteData(bugId: bigint) {

    // Dynamic DELETE url creation
    let DELETEurl: string = `${this.BaseUrl}bugs/${bugId}`;

    // Call the API using the DELETE Method, Url and Http options and return the data received from the API
    return this.http.delete<boolean>(DELETEurl, this.httpOptions)
      .pipe(
        // retry api call one more time in case of failure
        retry(1),
        // catch and display possible errors
        catchError(error => throwError(() => `Something went wrong: ${error}`))
      );
  }

  // Sort Bugs 

  // Method to Sort Bugs Table per field
  sortData(field: string, ascSort: boolean, currentPage: number, searchTitle: string) {

    // Set Http Parameters dynamically
    let params = new HttpParams()
                .set('sort',`${field},${ascSort? 'asc' : 'desc'}`)
                .set('page', currentPage)
                .set('title', searchTitle);

    // Dynamic Sort url creation
    let SortUrl: string = `${this.BaseUrl}bugs`;

    // Call the API using the GET Method, Sort Url, Http parameters and Http options and return the data received from the API
    return this.http.get<BugsData[]>(SortUrl, {params: params, headers: this.httpOptions.headers})
    .pipe(
      // retry api call one more time in case of failure
      retry(1),
      // catch and display possible errors
      catchError(error => throwError(() => `Something went wrong: ${error}`))
    );
  }
  
  // Paginate Bugs 

  // Method to Paginate the Bugs Table
  paginateData(newPage: number, ascSort: boolean, field: string, searchTitle: string) {

    // Set Http Parameters dynamically
    let params = new HttpParams()
                .set('page', newPage)
                .set('title', searchTitle);
                
    // If there is a sorting value, include it in the parameters
    if(field) params = params.set('sort',`${field},${ascSort? 'asc' : 'desc'}`);

    // Dynamic Paging url creation
    let pagingUrl: string = `${this.BaseUrl}bugs`

    // Call the API using the GET Method, Paging Url, Http parameters and Http options and return the data received from the API
    return this.http.get<BugsData[]>(pagingUrl, {params: params, headers: this.httpOptions.headers})
    .pipe(
      // retry api call one more time in case of failure
      retry(1),
      // catch and display possible errors
      catchError(error => throwError(() => `Something went wrong: ${error}`))
    );

  }

  // Search Bugs by Title

  // Method to Search Bugs by Title
  getDataByTitle(searchTitle: string) {

    // Dynamic Search url creation
    let GetByTitleUrl: string = `${this.BaseUrl}bugs`

    // Set Http Parameters dynamically
    let params = new HttpParams().set('title', searchTitle);

    // Call the API using the GET Method, Search Url, Http parameters and Http options and return the data received from the API
    return this.http.get<BugsData[]>(GetByTitleUrl, {params: params, headers: this.httpOptions.headers})
    .pipe(
      // retry api call one more time in case of failure
      retry(1),
      // catch and display possible errors
      catchError(error => throwError(() => `Something went wrong: ${error}`))
    );

  }

  // POST Bug

  // Method to Create a Bug 
  postData(title: string, priority: number, reporter: string, status: string, description: string) {

    // Dynamic POST url creation
    let POSTurl: string = `${this.BaseUrl}bugs`

    // Body of POST http request
    const data: BugsData = {
      title: title,
      description: description,
      priority: priority,
      reporter: reporter,
      status: status,
      updatedAt: new Date(),
      createdAt: new Date()
    }

    // Call the API using the POST Method, POST Url, Stringified Request Body and Http options and return the data received from the API
    return this.http.post<BugsData>(POSTurl, JSON.stringify(data), this.httpOptions)
    .pipe(
      // retry api call one more time in case of failure
      retry(1),
      // catch and display possible errors
      catchError(error => throwError(() => `Something went wrong: ${error}`))
    );

  }

  // PUT Bug

  // Method to pass Bug data to Bug Form for editing a Bug
  passDataEdit(bug:BugsData) {
    /* Add data passed from the Bugs Table component
    to the BehaviorSubject, which will be added to the bugDataEdit Observable*/
    this.bugDataEditSource.next(bug);
    /* After 1 second, change the latest value to an empty string, as a workaround for 
    avoiding the situation where the user navigates back and forth on the browser and still
    sees data displayed on the form */
    setTimeout( () => {
      this.bugDataEditSource.next('');
   }, 1000);
  }

  // Method to Update Bug data
  putData(id: bigint, title: string, priority: number, reporter: string, status: string, description: string, createdAt: Date, comments: BugsDataComment[]) {

    // Dynamic PUT url creation
    let PUTurl: string = `${this.BaseUrl}bugs/${id}`

    // Body of PUT http request
    const data: BugsData = {
      title: title,
      description: description,
      priority: priority,
      reporter: reporter,
      status: status,
      updatedAt: new Date(),
      createdAt: createdAt,
      comments: comments
    }

    console.log(data);
    // Call the API using the PUT Method, PUT Url,Stringified Request Body and Http options and return the data received from the API
    return this.http.put<BugsData>(PUTurl, JSON.stringify(data), this.httpOptions)
    .pipe(
      // retry api call one more time in case of failure
      retry(1),
      // catch and display possible errors
      catchError(error => throwError(() => `Something went wrong: ${error}`))
    );

  }
}