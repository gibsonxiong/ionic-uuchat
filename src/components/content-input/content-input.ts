import { Component, ViewChild, Renderer, forwardRef, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'cy-content-input',
	templateUrl: 'content-input.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ContentInputComponent), multi: true }
	  ]
})
export class ContentInputComponent implements ControlValueAccessor {

	private lastEditRange;
	private _onChange = (value)=>{}

	@ViewChild('input') input;

	@Output('focus') focus = new EventEmitter();

	constructor(
		private renderer: Renderer
	) {

	}

	writeValue(value: any): void {
		this.renderer.setElementProperty(this.input.nativeElement, 'innerHTML', value);
	}

	registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: any): void {
	}

	saveLastEditRange(){
		try{
			// 获取选定对象
			var selection = getSelection();
			// 设置最后光标对象
			this.lastEditRange = selection.getRangeAt(0);
		}catch(e){
			console.log(e);
		}
		
	}

	onKeypress(e){
		if(e.keyCode==13){
			e.preventDefault();

			var event = new Event('submit');
			event.initEvent('submit',true,true);
			document.forms[0].dispatchEvent(event);
		}

	}

	onInput(e){
		this._onChange(e.target.innerHTML);
	}

	insertImg(src){
		// 获取编辑框对象
		var inputEl = this.input.nativeElement;
		//表情图片
		var img = new Image();
		img.src = src;

		var range = this.lastEditRange;

		// 判断是否有最后光标对象存在
		if (!range) {
			range = document.createRange();
			range.setStart(inputEl,0);
		}

		// 判断选定对象范围是编辑框还是文本节点
		if (range.startContainer.nodeName != '#text') {
			var childNodes = inputEl.childNodes;
			var anchorOffset = range.startOffset;
			var extentOffset = range.endOffset;

			//移除选中部分
			for (let i = anchorOffset; i < extentOffset; i++) {
				inputEl.removeChild(childNodes[i]);
				i--;
				extentOffset--;
			}

			// 如果文本框的子元素大于0，则表示有其他元素，则按照位置插入表情节点
			if (inputEl.childNodes.length > 0 && childNodes.length > anchorOffset) {

				for (let i = 0; i < childNodes.length; i++) {
					if (i == anchorOffset) {
						inputEl.insertBefore(img, childNodes[i]);
						break;
					}

				}
			} else {
				// 否则直接插入一个表情元素
				inputEl.appendChild(img);
			}
			// 创建新的光标对象
			range = document.createRange();
			// 光标位置定位在表情节点的最大长度
			range.setStart(inputEl, anchorOffset + 1);

		} else {
			// 获取光标对象的范围界定对象，一般就是textNode对象
			var textNode = <Text>range.startContainer;
			// 获取光标位置
			var rangeStartOffset = range.startOffset;
			//删除选择内容
			textNode.deleteData(range.startOffset, range.endOffset - range.startOffset);
			//分割文本节点
			var textNodeSplited = textNode.splitText(range.startOffset);
			//插入图片
			textNodeSplited.parentElement.insertBefore(img, textNodeSplited);

			// 光标移动到到原来的位置加上新内容的长度
			range.setStart(textNodeSplited, 0);
		}
		// 无论如何都要记录最后光标对象
		this.lastEditRange = range;

		this._onChange(inputEl.innerHTML);

		
	}



}
