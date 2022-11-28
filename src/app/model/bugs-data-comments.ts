/*
    Typescript Code for modeling the comments array as part of the Bug Reporter Application Data received by the API
    Author: Nikos Lardas
    Created: 05.2022
*/

export interface BugsDataComment {
    _id?: bigint;
    reporter: string;
    description: string;
}