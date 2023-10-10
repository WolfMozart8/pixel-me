import { Injectable } from '@angular/core';
import { Color } from '../models/Color';

@Injectable({
  providedIn: 'root'
})
export class PaletteService {

  private static idIncrement: number = 1;

  palette: Color[] = [
    {
      id: this.setId(),
      color: "#ff0000",
      use: true
    },
    {
      id: this.setId(),
      color: "#00ff00",
      use: true
    },
    {
      id: this.setId(),
      color: "#0000ff",
      use: true
    },
    {
      id: this.setId(),
      color: "#ffff00",
      use: true
    },
    {
      id: this.setId(),
      color: "#ffffff",
      use: true
    },
    {
      id: this.setId(),
      color: "#000000",
      use: true
    },
    {
      id: this.setId(),
      color: "#990000",
      use: false
    },
    //transparent
    {
      id: this.setId(),
      color: "#00000000",
      use: false
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
      id: this.setId(),
      color: color,
      use: true
    }

    this.palette.push(newColor);
  }

  setId(): number {
    return PaletteService.idIncrement++;
  }

  setQuantityPixels(object) {
    this.palette.forEach(color => {
      if (object[color.color]) {
        color.quantity = object[color.color];
      } else{
        color.quantity = 0;
      }
    })
    // console.table(this.palette)
  }
}
