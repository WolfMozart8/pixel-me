import { Component } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {

  constructor(private imageService: ImageService){}

  imageSource: string = "";
  isImageLoaded: boolean = false;

  loadImage(input: any) {
    if (input.files && input.files[0]){
      const reader = new FileReader();

      reader.onload = (e) => {
        const displayImage: any = document.getElementById("img");
        this.imageService.imageSource = e.target.result;
        this.imageService.setImageSrc(e.target.result.toString())
        displayImage.src = e.target?.result;
      }
      reader.readAsDataURL(input.files[0]);
      this.isImageLoaded = true;
    }
  }


}
