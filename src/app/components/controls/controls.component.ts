import { Component, OnInit } from '@angular/core';
import { BORDER } from 'src/app/models/ENUM_BORDER';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit{

  ngOnInit(): void {
    this.getActivatedColor();
  }

  num: number = 5;
  resolution: number = 0.5;

  pallete = [];

  colors = [
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

  grid = {
    none: false,
    black: false,
    white: false,
    mix: false
  }


  borderType: BORDER = BORDER.NONE;

  selectderBorder = "";

  selectBorder(event) {
    const value = event.target.value;
    if (value === "none"){
      this.borderType = BORDER.NONE
    }
    if (value === "black"){
      this.borderType = BORDER.BLACK
    }
    if (value === "white"){
      this.borderType = BORDER.WHITE
    }
    if (value === "mix"){
      this.borderType = BORDER.MIX
    }
  }
  activateColor(index) {
    this.colors[index].use = !this.colors[index].use;
    this.getActivatedColor()
    console.log(this.pallete)
  }

  getActivatedColor() {
    this.pallete = [];
    this.colors.forEach(a => {
      if (a.use === true){
        this.pallete.push(a.color)
      }
    })

  }

  resetGrid() {
    this.grid.black = false;
    this.grid.white = false;
    this.grid.mix = false;

  }

}
