import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit{

  ngOnInit(): void {
    this.getActivatedColor();
  }

  num: number = 0;

  pallete = [];
  paleta = [

  ];
  paleta2 = [
    {
      color: "#ff0000",
      use: true
    },
    {
      color: "#00ff00",
      use: true
    },
    {
      color: "#0000ff",
      use: true
    },
    {
      color: "#ffff00",
      use: true
    },
    {
      color: "#ffffff",
      use: true
    },
    {
      color: "#000000",
      use: true
    }
  ];

  activateColor(index) {
    this.paleta2[index].use = !this.paleta2[index].use;
    this.getActivatedColor()
    console.log(this.pallete)
  }

  getActivatedColor() {
    this.pallete = [];
    this.paleta2.forEach(a => {
      if (a.use === true){
        this.pallete.push(a.color)
      }
    })

  }

}
