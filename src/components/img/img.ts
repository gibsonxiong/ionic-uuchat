import { Component, Input, Renderer, ElementRef, HostBinding, ViewChild, HostListener } from '@angular/core';
import { DomUtils } from '../../utils/dom-utils';

@Component({
  selector: 'cy-img',
  templateUrl: 'img.html'
})
export class ImgComponent {

  @Input('src') src: string;
  @Input('width') w: any;
  @Input('height') h: any;

  private _width = 0;
  private _height = 0;

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
    this.renderer.setElementStyle(this.elemRef.nativeElement, 'width', value + '');
  }

  get height() {
    return this._height;
  }

  set height(value) {
    this._height = value;
    this.renderer.setElementStyle(this.elemRef.nativeElement, 'height', value + '');
  }

  private ratio: number = 0;

  @ViewChild('img')
  private img: ElementRef;

  private naturalWidth: number = 0;
  private naturalHeight: number = 0;
  private naturalRatio: number = 0;

  constructor(
    private elemRef: ElementRef,
    private renderer: Renderer
  ) {

  }

  ngOnInit() {
    this.img.nativeElement.onload = () => {
      this.onLoaded();
    }

  }

  onLoaded() {
    var position = DomUtils.getStyle(this.elemRef.nativeElement, 'position');
    //图片初始大小
    this.naturalWidth = this.img.nativeElement.naturalWidth;
    this.naturalHeight = this.img.nativeElement.naturalHeight;
    this.naturalRatio = this.naturalWidth / this.naturalHeight;

    if (position === 'static') this.renderer.setElementStyle(this.elemRef.nativeElement, 'position', 'relative');

    this.resize();
  }

  resize() {
    var elem = this.elemRef.nativeElement;
    var styleWidth = elem.style.width;
    var styleHeight = elem.style.height;


    // if (!this.w && !this.h) {
    //   this.width = naturalWidth;
    //   this.height = naturalHeight;

    // } else if (this.w && !this.h) {
    //   this.width = this.w;
    //   var width = elem.width;
    //   this.height = width / naturalRatio;

    // } else if (!this.w && this.h) {
    //   this.height = this.h;
    //   var height = elem.width;
    //   this.width = height * naturalRatio;

    // } else {
    //   this.width = this.w;
    //   this.height = this.h;
    // }

    // var width = this.width = DomUtils.getWidth(elem);
    // var height = this.height = DomUtils.getWidth(elem);
    // var ratio = this.ratio = width / height;

    // //0-全屏填充, 1-适应填充
    // var fillMode = 0;

    // if (ratio > naturalRatio) {
    //   if (fillMode == 0) {
    //     this.renderer.setElementClass(elem, 'img-portrait', true);
    //     this.renderer.setElementClass(elem, 'img-landscape', false);

    //   } else if (fillMode == 1) {
    //     this.renderer.setElementClass(elem, 'img-landscape', true);
    //     this.renderer.setElementClass(elem, 'img-portrait', false);
    //   }
    // } else {
    //   if (fillMode == 0) {
    //     this.renderer.setElementClass(elem, 'img-landscape', true);
    //     this.renderer.setElementClass(elem, 'img-portrait', false);
    //   } else if (fillMode == 1) {
    //     this.renderer.setElementClass(elem, 'img-portrait', true);
    //     this.renderer.setElementClass(elem, 'img-landscape', false);
    //   }
    // }
  }

  @HostListener('click')
  onClick() {
    var overlay;
    var elem = this.elemRef.nativeElement;
    var offset = DomUtils.getOffset(elem);
    var clone = DomUtils.cloneDom(elem);
    var overlayWidth = DomUtils.getWidth(overlay);
    var overlayHeight = DomUtils.getHeight(overlay);

    var beginWidth = this.width;
    var beginHeight = this.height;
    var beginTop = offset.top;
    var beginLeft = offset.left;

    var endWidth = overlayWidth;
    var endHeight = endWidth / this.naturalRatio;
    var endTop = (overlayHeight - endHeight) / 2;
    var endLeft = 0;

    if (endTop < 0) endTop = 0;


    zoomIn();

    function zoomIn() {
      clone
        .css({
          position: 'absolute',
          top: beginTop,
          left: beginLeft,
          width: beginWidth,
          height: beginHeight
        });

        this.renderer

      overlay.append(clone);

      clone.animate({
        top: endTop,
        left: endLeft,
        width: endWidth,
        height: endHeight
      }, 200);
    }

    function zoomOut() {
      overlay.animate({
        'background-color': '#fff'
      }, 200, function () {
        overlay.remove();
      });

      clone.animate({
        top: beginTop,
        left: beginLeft,
        width: beginWidth,
        height: beginHeight
      }, 200);
    }
  }

}
