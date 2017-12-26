export function each(elements, callback, hasOwnProperty = false) {
    if (!elements) {
        return this;
    }
    if (typeof elements.length === 'number') {
        [].every.call(elements, function (el, idx) {
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

export function clone(obj) {
    var isArray = obj.constructor === Array;
    var str;
    var newobj = isArray ? [] : {};

    if (typeof obj === 'object') {
        if (typeof JSON !== 'undefined') {
            str = JSON.stringify(obj);
            newobj = JSON.parse(str);

        } else {
            if (isArray) {
                newobj = [];
                for (var i = 0; i < obj.length; i++) {
                    newobj[i] = typeof obj[i] === 'object' ? clone(obj[i]) : obj[i];
                }

            } else {
                newobj = {};
                for (var key in obj) {
                    newobj[key] = typeof obj[i] === 'object' ? clone(obj[key]) : obj[key];
                }
            }
        }

        return newobj;
    } else {

        return obj;
    }
}

export function createFormData(obj): FormData {
    var formData = new FormData();

    for (var name in obj) {
        if (obj.hasOwnProperty(name)) {
            formData.append(name, obj[name]);
        }
    }
    return formData;
}

export function getDiff(date) {
    var time = new Date(date);
    var timeStamp = time.getTime();
    var currTime = Date.now();
    var diff = currTime - timeStamp;

    return diff;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
export function formatDate(date, fmt) { //author: meizz
    date = new Date(date);

    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}