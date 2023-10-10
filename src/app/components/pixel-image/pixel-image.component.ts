import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { ColorHex } from 'src/app/models/Color';
import { BORDER } from 'src/app/models/ENUM_BORDER';
import { ImageService } from 'src/app/services/image.service';
import { PaletteService } from 'src/app/services/palette.service';

@Component({
  selector: 'app-pixel-image',
  templateUrl: './pixel-image.component.html',
  styleUrls: ['./pixel-image.component.scss'],
})
export class PixelImageComponent implements AfterViewInit, OnChanges, OnInit {
  @ViewChild('imageCanvas')
  canvas: ElementRef<HTMLCanvasElement>;
  // @ViewChild('imageCanvas2')
  // canvas2: ElementRef<HTMLCanvasElement>;

  @Input() pixelLevel: number;
  @Input() resolution: number = 0.5;
  @Input() palette = [];

  @Input() gridType: BORDER = BORDER.NONE;

  imageSource: string = '';
  colorUsed = {};

  readonly gridWidth: number = 0.5;

  totalPixels: number = 0;

  pixelsX: number = 0;
  pixelsY: number = 0;

  zoomLevel: number = 1; // 0 = width: 50%; 1 = width: 100% ...
  isZoomIn: boolean = false;
  isLoading: boolean = false;

  @Input() isSmooth: boolean = true;
  // @Input() smooth: ImageSmoothingQuality = "low";

  @Input() circleBlockMode: boolean = false;
  bgColorForCircleMode: string = "grey";

  hamaSmall: number = 0.266;
  hamaBig: number = 0.5

  constructor(
    private imageService: ImageService,
    private paletteService: PaletteService
  ) {}
  ngOnInit(): void {
    this.resolution = 0.5;
    this.pixelLevel = 5;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateImage();
  }

  updateImage() {
    this.isLoading = true;
    const image = new Image();

    // reset array
    this.colorUsed = {};

    image.onload = () => {
      this.canvas.nativeElement.width = image.width * this.resolution;
      this.canvas.nativeElement.height = image.height * this.resolution;
      // this.canvas.nativeElement.width = 600;
      // this.canvas.nativeElement.height = 400;
      this.toPixel(image, this.pixelLevel, this.circleBlockMode);
      this.isLoading = false;
      this.totalPixels = this.getTotalPixels(this.colorUsed);

      this.setQuntity();
    };
    image.src = this.imageSource;
  }

  ngAfterViewInit(): void {
    this.imageService.imageSource$.subscribe({
      next: (imgSrc) => {
        this.imageSource = imgSrc;
        this.updateImage();
      },
    });
    this.isLoading = false;
  }

  downloadImage() {
    const dataURL = this.canvas.nativeElement.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'pixel_image.png';

    link.click();
  }
  toPixel(image, number, mode) {
    const canvasW = this.canvas.nativeElement.width;
    const canvasH = this.canvas.nativeElement.height;

    const blockSize = number;
    const context = this.canvas.nativeElement.getContext('2d', {
      willReadFrequently: true,
    });

    //TODO:
    context.imageSmoothingEnabled = this.isSmooth;

    const NumBlocksX = canvasW / blockSize;
    const NumBlocksY = canvasH / blockSize;

    //text for pixels
    this.pixelsX = Math.round(NumBlocksX);
    this.pixelsY = Math.round(NumBlocksY);

    //Draw the pixelated image
    context.drawImage(image, 0, 0, canvasW, canvasH);
    //TODO: choose selected area from the original image
    // context.drawImage(image,100, 120, 140, 180, 0, 0, canvasW, canvasH);

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
        let sumA = 0;

        for (let i = 0; i < imageData.data.length; i += 4) {
          sumR += imageData.data[i];
          sumG += imageData.data[i + 1];
          sumB += imageData.data[i + 2];
          sumA += imageData.data[i + 3];
        }

        const averageR = sumR / (blockSize * blockSize);
        const averageG = sumG / (blockSize * blockSize);
        const averageB = sumB / (blockSize * blockSize);
        const averageA = sumA / (blockSize * blockSize);

        // Fill blocks with average color
        // context.fillStyle = `rgb(${averageR}, ${averageG}, ${averageB})`;
        // context.fillRect(blockX, blocky, blockSize, blockSize);

        const avgColor = {
          r: averageR,
          g: averageG,
          b: averageB,
          a: averageA,
        };

        //TODO: make dynamic
        const closeColor = this.findCloserColor(
          this.rgbToHex(avgColor),
          this.palette
        );

        //TODO: make dinamically change between dots and squares
        context.fillStyle = closeColor;

        // circles
        if (mode){
        // first paint the block using bgColorForCircleMode color to avoid showing original image
        context.fillStyle = this.bgColorForCircleMode;
        context.fillRect(blockX, blocky, blockSize, blockSize);
        // then fill with the circle with closeColor
        context.fillStyle = closeColor;
        context.beginPath();
        context.arc(blockX, blocky, blockSize / 2, 0, 2 * Math.PI);
        context.fill();
        }
        // blocks
        else {
          context.fillRect(blockX, blocky, blockSize, blockSize);
        }

        // sum every related color
        this.sumColor(closeColor);

        // add border to blocks to emulate a grid
        // grid only works in blocks mode
        if (this.gridType != 0 && !mode) {
          const borderWidth = this.gridWidth;

          if (this.gridType === BORDER.BLACK) {
            context.strokeStyle = '#000000';
          } else if (this.gridType === BORDER.WHITE) {
            context.strokeStyle = '#ffffff';
          } else if (this.gridType === BORDER.MIX) {
            if (closeColor === '#000000') {
              context.strokeStyle = '#ffffff';
            } else {
              context.strokeStyle = '#000000';
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
      }
    }
  }

  private findCloserColor(color: ColorHex, pallete: ColorHex[]): ColorHex {
    // if transparent return not color
    if (color === '#null') {
      return '#00000000';
    }

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

  private rgbToHex(color): ColorHex {
    const r = Math.round(color.r);
    const g = Math.round(color.g);
    const b = Math.round(color.b);
    const a = Math.round(color.a);

    if (a === 0) {
      const noColor: ColorHex = `#null`;
      return noColor;
    }

    const convertedColor: ColorHex = `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return convertedColor;
  }

  /**
   * Add + 1 to a color every time is used, if null it creates a new color and is
   * added to colorUsed.
   *
   * Example: {"#ff0000": 50}
   * @param color Hex color (#ff0000)
   */
  private sumColor(color: ColorHex): void {
    if (!this.colorUsed[color]) {
      this.colorUsed[color] = 0;
    }

    this.colorUsed[color]++;
  }

  private resetPrioSum(): void {
    this.palette.forEach((color) => {
      // color.
    });
  }

  private getTotalPixels(object): number {
    let sum: number = 0;

    for (let color in object) {
      // if not transparent
      if (color != "#00000000"){
        sum += object[color];
      }
    }
    return sum;
  }

  setQuntity() {
    this.paletteService.setQuantityPixels(this.colorUsed);
  }

  zoomIn(): void {
    this.zoomLevel++;
  }
  zoomOut(): void {
    this.zoomLevel--;
  }
  getZoomLevel(): string {
    if (this.zoomLevel === 0) {
      return 'w-[50%]';
    } else if (this.zoomLevel === 1) {
      return 'w-[100%]';
    } else if (this.zoomLevel === 2) {
      return 'w-[150%]';
    } else if (this.zoomLevel === 3) {
      return 'w-[200%]';
    } else if (this.zoomLevel === 4) {
      return 'w-[300%]';
    } else if (this.zoomLevel === 5) {
      return 'w-[400%]';
    } else if (this.zoomLevel === 6) {
      return 'w-[600%]';
    } else {
      return 'w-[100%]';
    }
  }
}
