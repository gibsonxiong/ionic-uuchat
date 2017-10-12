// import { Directive, Input, Output, ElementRef,Renderer,HostListener } from '@angular/core';

// /*
//   Generated class for the Highlight directive.

//   See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
//   for more info on Angular 2 Directives.
// */
// @Directive({
//   selector: '[highlight]' // Attribute selector
// })
// export class Highlight {

//   defualt_color:string = '#fff';

//   @Input('highlight') highlightColor;

//   constructor(public elemRef:ElementRef, public render:Renderer) {

//   }

//   @HostListener('mouseenter',['$event'])
//   private _onMouseEnter(e):void{
//   	let color = this.highlightColor || this.defualt_color;
//   	this.setColor(color);
//   }

//   @HostListener('mouseleave',['$event'])
//   private _onMouseLeave(e):void{
//   	this.setColor('#fff');
//   }

//   private setColor(color?) :void{
//   	this.render.setElementStyle(this.elemRef.nativeElement,'background-color',color);
//   }

// }
