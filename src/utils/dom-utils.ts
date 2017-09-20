import $ from 'jquery';

export class DomUtils {

    static getStyle(dom, name) {
        return $(dom).css(name);
    }


    static getAttr(dom, name) {
        return $(dom).attr(name);
    }

    static getWidth(dom) {
        return $(dom).width();
    }

    static getHeight(dom) {
        return $(dom).height();
    }

    static getOffset(dom) {
        return $(dom).offset();
    }

    static getPosition(dom) {
        return $(dom).position();
    }

    static cloneDom(dom) {
        return $(dom).clone();
    }

}
