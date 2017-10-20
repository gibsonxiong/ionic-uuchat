import { Component, Input, Renderer, ElementRef, HostBinding, ViewChild, HostListener } from '@angular/core';
import { DomUtils } from '../../utils/dom-utils';

@Component({
	selector: 'cy-img',
	templateUrl: 'img.html'
})
export class ImgComponent {

	private naturalWidth: number = 0;
	private naturalHeight: number = 0;
	private naturalRatio: number = 0;

	@Input('src') src: string;

	@Input('width') get width() {
		return DomUtils.getWidth(this.elemRef.nativeElement);
	}

	set width(value) {
		this.renderer.setElementStyle(this.elemRef.nativeElement, 'width', value);
	}

	@Input('height') get height() {
		return DomUtils.getHeight(this.elemRef.nativeElement);
	}

	set height(value) {
		this.renderer.setElementStyle(this.elemRef.nativeElement, 'height', value);
	}

	@Input('zoom') zoom:boolean = false;

	@ViewChild('img') img: ElementRef;

	constructor(
		private elemRef: ElementRef,
		private renderer: Renderer
	) {
		
	}

	ngOnInit() {
		this.renderer.setElementStyle(this.img.nativeElement, 'display', 'none');

		this.img.nativeElement.onload = () => {
			this.onLoaded();
		}

		this.img.nativeElement.onerror = () => {
			console.log('img onerror');
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

		this.renderer.setElementStyle(this.img.nativeElement, 'display', '');
	}

	resize() {
		var elem = this.elemRef.nativeElement;
		var width = DomUtils.getWidth(elem);
		var height = DomUtils.getHeight(elem);

		if (!width && !height) {
			this.width = this.naturalWidth + 'px';
			this.height = this.naturalHeight + 'px';

		} else if (width && !height) {
			this.width = width;
			this.height = (this.width / this.naturalRatio) + 'px';

		} else if (!width && height) {
			this.height = height;
			this.width = (this.height * this.naturalRatio) + 'px';

		} else {
			this.width = width;
			this.height = height;
		}

		var ratio = this.width / this.height;

		//0-全屏填充, 1-适应填充
		var fillMode = 0;

		if (ratio > this.naturalRatio) {
			if (fillMode == 0) {
				this.renderer.setElementClass(elem, 'img-portrait', true);
				this.renderer.setElementClass(elem, 'img-landscape', false);

			} else if (fillMode == 1) {
				this.renderer.setElementClass(elem, 'img-landscape', true);
				this.renderer.setElementClass(elem, 'img-portrait', false);
			}
		} else {
			if (fillMode == 0) {
				this.renderer.setElementClass(elem, 'img-landscape', true);
				this.renderer.setElementClass(elem, 'img-portrait', false);

			} else if (fillMode == 1) {
				this.renderer.setElementClass(elem, 'img-portrait', true);
				this.renderer.setElementClass(elem, 'img-landscape', false);
			}
		}
	}

	@HostListener('window:resize')
	onResize(){
		this.resize();
	}

	@HostListener('click')
	onClick() {
		if(!this.zoom) return;

		var overlay = document.createElement('div');
		overlay.className = 'cy-img-overlay';
		overlay.addEventListener('click', ()=>{
			if(!this.zoom) return;
			zoomOut();
		});
		var elem = this.elemRef.nativeElement;
		var offset = DomUtils.getOffset(elem);
		var clone = DomUtils.cloneDom(elem).css({
			minWidth:'initial',
			maxWidth:'initial',
			minHeight:'initial',
			maxHeight:'initial'
		});

		document.body.appendChild(overlay);
		overlay.appendChild(clone[0]);

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
				})
				.animate({
					top: endTop,
					left: endLeft,
					width: endWidth,
					height: endHeight
				}, 200,function(){
					//显示原图
					var src = clone.children('img').attr('src');
					clone.children('img').attr('src',src.substring(0,src.lastIndexOf('@')) );
				});

			
		}

		function zoomOut() {
			clone.animate({
				top: beginTop,
				left: beginLeft,
				width: beginWidth,
				height: beginHeight
			}, 200,function(){
				document.body.removeChild(overlay);
			});

			
		}

		
	}

}
