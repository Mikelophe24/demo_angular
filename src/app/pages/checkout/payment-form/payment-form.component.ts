import { Component } from '@angular/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { ViewPanelDirective } from '../../../directives/view-panel.directive';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [MatRadioButton, MatRadioGroup, ViewPanelDirective, MatIcon],
  template: `
    <div appViewPanel>
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
        <mat-icon>payment</mat-icon>
        Payment Options
      </h2>

      <div>
        <mat-radio-group [value]="'stripe'">
          <mat-radio-button value="stripe">
            <img src="stripe-logo.png" alt="Stripe" class="h-6" />
          </mat-radio-button>
        </mat-radio-group>
      </div>
    </div>
  `,
  styles: ``,
})
export class PaymentFormComponent {}
