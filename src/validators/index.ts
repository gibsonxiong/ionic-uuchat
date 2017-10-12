import { Injectable } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import {each, format} from '../utils/utils';

function isEmptyInputValue(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
  }

var regs = {
    mobile : /^1[3|4|5|8]\d{9}$/
};

var defulatErrorMsgFuncMap = {
	required(args){
		return format('{label}不能为空',args);
    },
    
    mobile(args){
        return format('{label}不正确',args);
    }

};

@Injectable()
export class myValidators {

	constructor(
	) {

	}

	static mobile(control)  {
        if (isEmptyInputValue(control.value)) {
            return null;
          }

        return !regs.mobile.test(control.value) ? {mobile:true} : null;

	}
}




export function getErrorMsgByFormControl(control, label, errorMsgFuncMap ={}){
    var msg;
    var errorMsgFunc;
	
    each(control.errors,(validatorName,result)=>{
        if(typeof result !== 'object'){
            result = {};
        }

        result.label = label;
        
        errorMsgFunc = errorMsgFuncMap[validatorName] || defulatErrorMsgFuncMap[validatorName];
        msg = errorMsgFunc && errorMsgFunc(result);
        
        return false;

    });

	return msg;
}

export function getErrorMsgByFormGroup(form, labelMap = {}, errorMsgFuncMap ={}){
    var msg;
    var errorMsgFunc;
    
	each(form.controls,(name,control)=>{
        
        var label = labelMap[name] || name;
        msg = getErrorMsgByFormControl(control,label,errorMsgFuncMap);

		if(msg) return false;
	});

	return msg;
}

