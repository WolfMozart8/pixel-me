import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { BORDER } from 'src/app/models/ENUM_BORDER';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-pixel-image',
  templateUrl: './pixel-image.component.html',
  styleUrls: ['./pixel-image.component.scss'],
})
export class PixelImageComponent implements AfterViewInit, OnChanges {
  @ViewChild('imageCanvas')
  canvas: ElementRef<HTMLCanvasElement>;

  @Input() num: number = 5;
  @Input() palette = [];

  @Input() borderType: BORDER = BORDER.NONE;

  imageSource: string = '';

  pixelsX: number = 0;
  pixelsY: number = 0;

  isZoomIn: boolean = false;

  constructor(private imageService: ImageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.updateImage();
    console.log(changes)
  }

  updateImage() {
    const image = new Image();

    image.onload = () => {
      //TODO: make dinamyc width/heigth
      this.canvas.nativeElement.width = image.width;
      this.canvas.nativeElement.height = image.height;
      this.toPixel(image, this.num);
    };

    image.src = this.imageSource;
  }

  ngAfterViewInit(): void {
    this.imageService.imageSource$.subscribe({
      next: (imgSrc) => {
        // const context = this.canvas.nativeElement.getContext('2d');

        this.imageSource = imgSrc;
        this.updateImage();
      },
    });
  }

  downloadImage() {
    const dataURL = this.canvas.nativeElement.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "pixel_image.png";

    link.click();
  }
  toPixel(image, number) {
    const canvasW = this.canvas.nativeElement.width;
    const canvasH = this.canvas.nativeElement.height;

    const blockSize = number;
    const context = this.canvas.nativeElement.getContext('2d', {willReadFrequently: true});

    const NumBlocksX = canvasW / blockSize;
    const NumBlocksY = canvasH / blockSize;


    //text for pixels
    this.pixelsX = Math.round(NumBlocksX);
    this.pixelsY = Math.round(NumBlocksY);

    //Draw the pixelated image
    context.drawImage(image, 0, 0, canvasW, canvasH);

    //Iterate trought the blocks and apply pixelation
    for (let x = 0; x < NumBlocksX; x++) {
      for (let y = 0; y < NumBlocksY; y++) {
        //Get the data of average color of the block
        const blockX = x * blockSize;
        const blocky = y * blockSize;
        const imageData = context.getImageData(
          blockX,
          blocky,
          blockSize,
          blockSize
        );

        // Calculate the block's average color
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;

        for (let i = 0; i < imageData.data.length; i += 4) {
          sumR += imageData.data[i];
          sumG += imageData.data[i + 1];
          sumB += imageData.data[i + 2];
        }

        const averageR = sumR / (blockSize * blockSize);
        const averageG = sumG / (blockSize * blockSize);
        const averageB = sumB / (blockSize * blockSize);

        // Fill blocks with average color
        // context.fillStyle = `rgb(${averageR}, ${averageG}, ${averageB})`;
        // context.fillRect(blockX, blocky, blockSize, blockSize);

        const avgColor = {
          r: averageR,
          g: averageG,
          b: averageB,
        };

        //TODO: make dynamic
        const closeColor = this.findCloserColor(
          this.rgbToHex(avgColor),
          this.palette
        );

        //TODO: make dinamically change between dots and squares
        // blocks
        context.fillStyle = closeColor;
        context.fillRect(blockX, blocky, blockSize, blockSize);

        if (this.borderType != 0){

        const borderWidth = 1;

        if (this.borderType === BORDER.BLACK){
          context.strokeStyle = '#000000';
        }
        else if (this.borderType === BORDER.WHITE){
          context.strokeStyle = '#ffffff';
        }
        else if (this.borderType === BORDER.MIX){

          if (closeColor === "#000000") {

            context.strokeStyle = '#ffffff';
          }else {

            context.strokeStyle = '#000000'; // Color del borde (negro en este caso)
          }
        }


        context.lineWidth = borderWidth;
        context.strokeRect(
          blockX + borderWidth / 2,
          blocky + borderWidth / 2,
          blockSize - borderWidth,
          blockSize - borderWidth
        );
        }

        // circles
        context.fillStyle = closeColor;
        // context.beginPath();
        // context.arc(blockX, blocky, blockSize / 2, 0, 2 * Math.PI);
        // context.fill();
      }
    }

  }

  private findCloserColor(color, pallete) {
    let closerColor = pallete[0];
    let minDistance = this.caclDistanceColor(color, closerColor);

    for (let i = 1; i < pallete.length; i++) {
      const distance = this.caclDistanceColor(color, pallete[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closerColor = pallete[i];
      }
    }

    return closerColor;
  }

  private caclDistanceColor(color1, color2) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    return Math.sqrt(
      Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
    );
  }

  private rgbToHex(color) {
    const r = Math.round(color.r);
    const g = Math.round(color.g);
    const b = Math.round(color.b);

    return `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  paletaDeColores = [
    '#FF0000', // Rojo
    '#00FF00', // Verde
    '#0000FF', // Azul
    '#FFFF00', // Amarillo
    '#ffffff',
    '#000000',
    // Agrega más colores según tus preferencias
  ];
}
