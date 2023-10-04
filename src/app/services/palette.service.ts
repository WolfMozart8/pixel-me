import { Injectable } from '@angular/core';
import { Color } from '../models/Color';

@Injectable({
  providedIn: 'root'
})
export class PaletteService {

  palette: Color[] = [
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

  constructor() { }


  setPalette(palette):void {
    this.palette = {...palette}
  }

  getPalette(): Color[] {
    return this.palette
  }
  addColor(color): void {
    const newColor: Color = {
      color: color,
      use: true
    }

    this.palette.push(newColor);
  }

  setQuantityPixels(object) {
    for (let color in object){
      this.palette.forEach(colorInPallette => {
        if (colorInPallette.color === color){
          colorInPallette.quantity = object[color];
        }
      })
    }
    console.log(this.palette)
  }
}
