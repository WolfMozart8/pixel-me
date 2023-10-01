import { Component } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

  myBool: boolean = false;
  num: number = 0;

  ck() {
    this.myBool = !this.myBool;
  }

}
