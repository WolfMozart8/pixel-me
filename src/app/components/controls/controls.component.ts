import { Component, OnInit } from '@angular/core';
import { Color, ColorHex } from 'src/app/models/Color';
import { BORDER } from 'src/app/models/ENUM_BORDER';
import { PaletteService } from 'src/app/services/palette.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit{

  constructor(private paletteService: PaletteService){}

  ngOnInit(): void {
    this.resolution = 0.5;
    this.colors = this.paletteService.getPalette();
    this.getActivatedColor();
  }

  pixelLevel: number = 5;
  resolution: number = 0.5;

  pallete: ColorHex[] = [];

  colors: Color[] = [];

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
    this.colors.forEach(color => {
      if (color.use === true){
        this.pallete.push(color.color)
      }
    })

  }

  resetGrid() {
    this.grid.black = false;
    this.grid.white = false;
    this.grid.mix = false;

  }

  addColor(color){

    this.paletteService.addColor(color);
    this.colors = this.paletteService.getPalette();
    this.getActivatedColor();
  }

}
