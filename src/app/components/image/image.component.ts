import { Component } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {

  imageSource: string = "";
  isImageLoaded: boolean = false;

  asd() {
    console.log(this.imageSource)
  }

  loadImage(input: any) {
    if (input.files && input.files[0]){
      const reader = new FileReader();

      reader.onload = (e) => {
        const displayImage: any = document.getElementById("img");
        displayImage.src = e.target?.result;
      }
      reader.readAsDataURL(input.files[0]);
      this.isImageLoaded = true;
    }
  }


}
