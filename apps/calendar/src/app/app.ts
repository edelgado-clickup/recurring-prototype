import { Component } from '@angular/core';
import { FormSection } from './form-section/form-section';

@Component({
  selector: 'app-root',
  imports: [FormSection],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
