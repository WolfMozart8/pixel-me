import { Injectable , OnInit} from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService implements OnInit{

  imageSource: string | ArrayBuffer = "";
  private _imgSource :BehaviorSubject<string> = new BehaviorSubject<string>("");
  imageSource$: Observable<string> = this._imgSource.asObservable();

  constructor() { }

  ngOnInit(): void {
    console.log("hola")
  }
  setImageSrc(value: string) {
    this._imgSource.next(value);
  }
  a(asd) {
    console.log("adios")
    console.log(asd)
  }
}
