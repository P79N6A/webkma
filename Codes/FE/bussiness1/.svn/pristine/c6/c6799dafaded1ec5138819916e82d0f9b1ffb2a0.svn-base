
import httConfig from '../config/http';

const createStyle = function (href) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href)
    head.appendChild(link);
}

const createScript = function (src) {
    var body = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', src)
    body.appendChild(script);
}
const createPreviewWindow = function createPreviewWindow(url, id) {
    url += (url.indexOf('?') != -1 ? '&' : '?') + 'session_id=' + localStorage.getItem('sessionId')+'&id='+id;
    openPreviewWindow(httConfig.apiHost, url, id);
}
export {
    createStyle,
    createScript,
    createPreviewWindow
};
