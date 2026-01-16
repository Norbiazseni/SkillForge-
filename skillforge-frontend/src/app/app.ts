import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/layout/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <app-header></app-header>
    <main style="padding: 24px">
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {}