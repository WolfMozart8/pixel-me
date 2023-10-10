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
  isSmooth: boolean = true;
  // smooth: ImageSmoothingQuality = "low";
  blockMode: boolean = false;
  blocks: string = "square";

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

  selectBorder(event): void {
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
  activateColor(index): void {
    this.colors[index].use = !this.colors[index].use;
    if (!this.colors[index].use) {
      this.colors[index].quantity = 0;
    }
    this.getActivatedColor()
    console.log(this.pallete)
  }

  getActivatedColor(): void {
    this.pallete = [];
    this.colors.forEach(color => {
      if (color.use === true){
        this.pallete.push(color.color)
      }
    })

  }

  resetGrid(): void {
    this.grid.black = false;
    this.grid.white = false;
    this.grid.mix = false;

  }

  addColor(color): void{

    this.paletteService.addColor(color);
    this.colors = this.paletteService.getPalette();

    this.getActivatedColor();
  }

  changeColor(id: number, event: any): void {
    this.colors.filter(color => color.id === id)[0].color = event.target.value;
    this.getActivatedColor()
  }

  changeMode(): boolean {
    if (this.blocks === "circle") {
      return true
    }
    else {
      return false
    }
  }

}
