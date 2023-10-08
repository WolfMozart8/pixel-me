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
    },
    //transparent
    {
      color: "#00000000",
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
    this.palette.forEach(color => {
      if (object[color.color]) {
        color.quantity = object[color.color];
      } else{
        color.quantity = 0;
      }
    })
    console.table(this.palette)
  }
}
