
import jquery from 'jquery';
let tpl = `<span style=" position: absolute;bottom: 0;
right: 0;height: 22px;width: 22px;text-align: right;background:linear-gradient(to right,transparent 0% ,#fff 40%,#fff);">...</span> `
export default{
        name:'multiline-text-clip',
        inserted(el, binding) {
            let $el = jquery(el);
            let value = binding.value;
            let hg = parseFloat(value.height) * value.line;
            if ($el.height() > hg) {
                $el.parent().css({ 'position': 'relative', height: hg, overflow: 'hidden' });
                $el.append(jquery(tpl).css({ height: value.height, widht: value.width }));
            }
        }
    }

    






