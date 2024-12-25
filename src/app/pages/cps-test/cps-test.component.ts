import {Component, HostListener, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cps-test',
  imports: [
    FormsModule,
    DecimalPipe,
    RouterLink
  ],
  templateUrl: './cps-test.component.html',
  styleUrl: './cps-test.component.scss'
})
export class CpsTestComponent {
  protected clicks: WritableSignal<number> = signal(0);
  protected started: WritableSignal<boolean> = signal(false);
  protected timer: WritableSignal<number> = signal(0);
  protected results: WritableSignal<TimerResult[]> = signal([]);
  protected onCooldown: WritableSignal<boolean> = signal(false);

  protected timeLimits: number[] = [5, 10, 20, 30, 60]; // Time limits in seconds
  protected selectedTimeLimit: ModelSignal<number> = model(this.timeLimits[0]);

  private intervalId: any;
  private timeoutId: any;

  @HostListener('window:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    if (this.started()) {
      this.click();
    } else if(!this.onCooldown()) {
      this.startTest();
    }
  }


  protected startTest() {
    console.log('Starting test');
    this.started.set(true);
    this.timer.set(0);
    this.clicks.set(0);

    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.timer.update((val) => val + 0.01);
    }, 10);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.stopTest();
      const clicks = this.clicks();
      const timeLimit = this.selectedTimeLimit();
      this.results.update((val) => [...val, { clicks, timeLimit }]);
      this.clicks.set(0);
      this.timer.set(0);
    }, this.selectedTimeLimit() * 1000);
  }

  protected stopTest() {
    this.started.set(false);
    this.onCooldown.set(true);
    setTimeout(() => {
      this.onCooldown.set(false);
    }, 1000);
  }

  protected click() {
    if(this.started()) {
      this.clicks.update((val) => val + 1);
    }
  }

}

type TimerResult = {
  clicks: number;
  timeLimit: number;
}
