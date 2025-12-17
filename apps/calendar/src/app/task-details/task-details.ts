import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupernovaAssets } from '../../assets/supernova/assets';

@Component({
  selector: 'app-task-details',
  imports: [CommonModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss'
})
export class TaskDetails {
  SupernovaAssets = SupernovaAssets;
}

