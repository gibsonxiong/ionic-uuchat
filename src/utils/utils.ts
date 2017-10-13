export function each(elements, callback, hasOwnProperty = false) {
    if (!elements) {
        return this;
    }
    if (typeof elements.length === 'number') {
        [].every.call(elements, function(el, idx) {
            return callback.call(el, idx, el) !== false;
        });
    } else {
        for (var key in elements) {
            if (hasOwnProperty) {
                if (elements.hasOwnProperty(key)) {
                    if (callback.call(elements[key], key, elements[key]) === false) return elements;
                }
            } else {
                if (callback.call(elements[key], key, elements[key]) === false) return elements;
            }
        }
    }
    return this;
};

export function format(str, obj) {
    var result = str;
    var args = Array.prototype.slice.call(arguments, 1);
    var reg;
    if (arguments.length > 1) {
        if (arguments.length == 2 && typeof obj == "object") {
            for (var key in obj) {
                if (obj[key] !== undefined) {
                    reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, obj[key]);
                }
            }
        }
        else {
            for (var i = 0; i < args.length; i++) {
                if (args[i] !== undefined) {
                    reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, args[i]);
                }
            }
        }
    }
    return result;
}

export function clone(obj){
    var isArray = obj.constructor === Array;
    var str;
    var newobj = isArray ? [] : {};

    if(typeof obj === 'object'){
        if(typeof JSON !== 'undefined'){
            str = JSON.stringify(obj);
            newobj = JSON.parse(str); 

        }else{
            if(isArray){
                newobj= [];
                for(var i =0 ; i < obj.length; i++ ){
                    newobj[i] = typeof obj[i] === 'object' ? clone(obj[i]) : obj[i]; 
                }

            }else{
                newobj = {};
                for(var key in obj){
                    newobj[key] = typeof obj[i] === 'object' ? clone(obj[key]) : obj[key]; 
                }
            }
        }

        return newobj;
    } else{

        return obj;
    }
}

export function createFormData(obj):FormData{
    var formData = new FormData();
    
	for(var name in obj){
        if(obj.hasOwnProperty(name)){
            formData.append(name,obj[name]);
        }
    }
    return formData;
}

export function getDiff(date){
	var time = new Date(date);
	var timeStamp = time.getTime();
	var currTime = Date.now();
	var diff = currTime - timeStamp;

	return diff;
}