/*
    Typescript Code for modeling the Bug Reporter Application Data received by the API
    Author: Nikos Lardas
    Created: 05.2022
*/

import { BugsDataComment } from './bugs-data-comments';

export interface BugsData {
    id?: bigint;
    title: string;
    description: string;
    priority: number;
    reporter: string;
    status: string;
    updatedAt: Date;
    createdAt: Date;
    comments?: BugsDataComment[];
}