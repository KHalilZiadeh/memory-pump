import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent],
})
export class HomePage {

  constructor(private router: Router) {}

  goToGame(): void {
    this.router.navigate(['/game']);
  }
}