!function(t,e){"function"==typeof define&&define.amd?define(function(){return e(t)}):e(t)}(this,function(c){var Vj,d=function(){function u(t){return null==t?String(t):R[z.call(t)]||"object"}function s(t){return"function"==u(t)}function o(t){return null!=t&&t==t.window}function a(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function r(t){return"object"==u(t)}function l(t){return r(t)&&!o(t)&&Object.getPrototypeOf(t)==Object.prototype}function h(t){var e=!!t&&"length"in t&&t.length,n=C.type(t);return"function"!=n&&!o(t)&&("array"==n||0===e||"number"==typeof e&&0<e&&e-1 in t)}function f(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function n(t){return t in e?e[t]:e[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function p(t,e){return"number"!=typeof e||O[f(t)]?e:e+"px"}function i(t){return"children"in t?N.call(t.children):C.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function d(t,e){var n,i=t?t.length:0;for(n=0;n<i;n++)this[n]=t[n];this.length=i,this.selector=e||""}function g(t,e){return null==e?C(t):C(t).filter(e)}function m(t,e,n,i){return s(e)?e.call(t,n,i):e}function j(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function y(t,e){var n=t.className||"",i=n&&n.baseVal!==x;return e===x?i?n.baseVal:n:void(i?n.baseVal=e:t.className=e)}function v(e){try{return e?"true"==e||"false"!=e&&("null"==e?null:+e+""==e?+e:/^[\[\{]/.test(e)?C.parseJSON(e):e):e}catch(t){return e}}var x,b,C,S,_,w,T=[],E=T.concat,M=T.filter,N=T.slice,k=c.document,P={},e={},O={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},$=/^\s*<(\w+|!)[^>]*>/,I=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,A=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,Q=/^(?:body|html)$/i,D=/([A-Z])/g,q=["val","css","html","text","data","width","height","offset"],t=k.createElement("table"),J=k.createElement("tr"),L={tr:k.createElement("tbody"),tbody:t,thead:t,tfoot:t,td:J,th:J,"*":k.createElement("div")},U=/complete|loaded|interactive/,V=/^[\w-]*$/,R={},z=R.toString,F={},H=k.createElement("div"),Z={tabindex:"tabIndex",readonly:"readOnly",for:"htmlFor",class:"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},W=Array.isArray||function(t){return t instanceof Array};return F.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.matches||t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var i,r=t.parentNode,o=!r;return o&&(r=H).appendChild(t),i=~F.qsa(r,e).indexOf(t),o&&H.removeChild(t),i},_=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},w=function(n){return M.call(n,function(t,e){return n.indexOf(t)==e})},F.fragment=function(t,e,n){var i,r,o;return I.test(t)&&(i=C(k.createElement(RegExp.$1))),i||(t.replace&&(t=t.replace(A,"<$1></$2>")),e===x&&(e=$.test(t)&&RegExp.$1),e in L||(e="*"),(o=L[e]).innerHTML=""+t,i=C.each(N.call(o.childNodes),function(){o.removeChild(this)})),l(n)&&(r=C(i),C.each(n,function(t,e){-1<q.indexOf(t)?r[t](e):r.attr(t,e)})),i},F.Z=function(t,e){return new d(t,e)},F.isZ=function(t){return t instanceof F.Z},F.init=function(t,e){var n,i;if(!t)return F.Z();if("string"==typeof t)if("<"==(t=t.trim())[0]&&$.test(t))n=F.fragment(t,RegExp.$1,e),t=null;else{if(e!==x)return C(e).find(t);n=F.qsa(k,t)}else{if(s(t))return C(k).ready(t);if(F.isZ(t))return t;if(W(t))i=t,n=M.call(i,function(t){return null!=t});else if(r(t))n=[t],t=null;else if($.test(t))n=F.fragment(t.trim(),RegExp.$1,e),t=null;else{if(e!==x)return C(e).find(t);n=F.qsa(k,t)}}return F.Z(n,t)},(C=function(t,e){return F.init(t,e)}).extend=function(e){var n,t=N.call(arguments,1);return"boolean"==typeof e&&(n=e,e=t.shift()),t.forEach(function(t){!function t(e,n,i){for(b in n)i&&(l(n[b])||W(n[b]))?(l(n[b])&&!l(e[b])&&(e[b]={}),W(n[b])&&!W(e[b])&&(e[b]=[]),t(e[b],n[b],i)):n[b]!==x&&(e[b]=n[b])}(e,t,n)}),e},F.qsa=function(t,e){var n,i="#"==e[0],r=!i&&"."==e[0],o=i||r?e.slice(1):e,s=V.test(o);return t.getElementById&&s&&i?(n=t.getElementById(o))?[n]:[]:1!==t.nodeType&&9!==t.nodeType&&11!==t.nodeType?[]:N.call(s&&!i&&t.getElementsByClassName?r?t.getElementsByClassName(o):t.getElementsByTagName(e):t.querySelectorAll(e))},C.contains=k.documentElement.contains?function(t,e){return t!==e&&t.contains(e)}:function(t,e){for(;e&&(e=e.parentNode);)if(e===t)return!0;return!1},C.type=u,C.isFunction=s,C.isWindow=o,C.isArray=W,C.isPlainObject=l,C.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},C.isNumeric=function(t){var e=Number(t),n=typeof t;return null!=t&&"boolean"!=n&&("string"!=n||t.length)&&!isNaN(e)&&isFinite(e)||!1},C.inArray=function(t,e,n){return T.indexOf.call(e,t,n)},C.camelCase=_,C.trim=function(t){return null==t?"":String.prototype.trim.call(t)},C.uuid=0,C.support={},C.expr={},C.noop=function(){},C.map=function(t,e){var n,i,r,o,s=[];if(h(t))for(i=0;i<t.length;i++)null!=(n=e(t[i],i))&&s.push(n);else for(r in t)null!=(n=e(t[r],r))&&s.push(n);return 0<(o=s).length?C.fn.concat.apply([],o):o},C.each=function(t,e){var n,i;if(h(t)){for(n=0;n<t.length;n++)if(!1===e.call(t[n],n,t[n]))return t}else for(i in t)if(!1===e.call(t[i],i,t[i]))return t;return t},C.grep=function(t,e){return M.call(t,e)},c.JSON&&(C.parseJSON=JSON.parse),C.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){R["[object "+e+"]"]=e.toLowerCase()}),C.fn={constructor:F.Z,length:0,forEach:T.forEach,reduce:T.reduce,push:T.push,sort:T.sort,splice:T.splice,indexOf:T.indexOf,concat:function(){var t,e,n=[];for(t=0;t<arguments.length;t++)e=arguments[t],n[t]=F.isZ(e)?e.toArray():e;return E.apply(F.isZ(this)?this.toArray():this,n)},map:function(n){return C(C.map(this,function(t,e){return n.call(t,e,t)}))},slice:function(){return C(N.apply(this,arguments))},ready:function(t){return U.test(k.readyState)&&k.body?t(C):k.addEventListener("DOMContentLoaded",function(){t(C)},!1),this},get:function(t){return t===x?N.call(this):this[0<=t?t:t+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(n){return T.every.call(this,function(t,e){return!1!==n.call(t,e,t)}),this},filter:function(e){return s(e)?this.not(this.not(e)):C(M.call(this,function(t){return F.matches(t,e)}))},add:function(t,e){return C(w(this.concat(C(t,e))))},is:function(t){return 0<this.length&&F.matches(this[0],t)},not:function(e){var n=[];if(s(e)&&e.call!==x)this.each(function(t){e.call(this,t)||n.push(this)});else{var i="string"==typeof e?this.filter(e):h(e)&&s(e.item)?N.call(e):C(e);this.forEach(function(t){i.indexOf(t)<0&&n.push(t)})}return C(n)},has:function(t){return this.filter(function(){return r(t)?C.contains(this,t):C(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!r(t)?t:C(t)},last:function(){var t=this[this.length-1];return t&&!r(t)?t:C(t)},find:function(t){var n=this;return t?"object"==typeof t?C(t).filter(function(){var e=this;return T.some.call(n,function(t){return C.contains(t,e)})}):1==this.length?C(F.qsa(this[0],t)):this.map(function(){return F.qsa(this,t)}):C()},closest:function(n,i){var r=[],o="object"==typeof n&&C(n);return this.each(function(t,e){for(;e&&!(o?0<=o.indexOf(e):F.matches(e,n));)e=e!==i&&!a(e)&&e.parentNode;e&&r.indexOf(e)<0&&r.push(e)}),C(r)},parents:function(t){for(var e=[],n=this;0<n.length;)n=C.map(n,function(t){return(t=t.parentNode)&&!a(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return g(e,t)},parent:function(t){return g(w(this.pluck("parentNode")),t)},children:function(t){return g(this.map(function(){return i(this)}),t)},contents:function(){return this.map(function(){return this.contentDocument||N.call(this.childNodes)})},siblings:function(t){return g(this.map(function(t,e){return M.call(i(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(e){return C.map(this,function(t){return t[e]})},show:function(){return this.each(function(){var t,e,n;"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=(t=this.nodeName,P[t]||(e=k.createElement(t),k.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),P[t]=n),P[t]))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(e){var n=s(e);if(this[0]&&!n)var i=C(e).get(0),r=i.parentNode||1<this.length;return this.each(function(t){C(this).wrapAll(n?e.call(this,t):r?i.cloneNode(!0):i)})},wrapAll:function(t){if(this[0]){C(this[0]).before(t=C(t));for(var e;(e=t.children()).length;)t=e.first();C(t).append(this)}return this},wrapInner:function(r){var o=s(r);return this.each(function(t){var e=C(this),n=e.contents(),i=o?r.call(this,t):r;n.length?n.wrapAll(i):e.append(i)})},unwrap:function(){return this.parent().each(function(){C(this).replaceWith(C(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var t=C(this);(e===x?"none"==t.css("display"):e)?t.show():t.hide()})},prev:function(t){return C(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return C(this.pluck("nextElementSibling")).filter(t||"*")},html:function(n){return 0 in arguments?this.each(function(t){var e=this.innerHTML;C(this).empty().append(m(this,n,t,e))}):0 in this?this[0].innerHTML:null},text:function(n){return 0 in arguments?this.each(function(t){var e=m(this,n,t,this.textContent);this.textContent=null==e?"":""+e}):0 in this?this.pluck("textContent").join(""):null},attr:function(e,n){var t;return"string"!=typeof e||1 in arguments?this.each(function(t){if(1===this.nodeType)if(r(e))for(b in e)j(this,b,e[b]);else j(this,e,m(this,n,t,this.getAttribute(e)))}):0 in this&&1==this[0].nodeType&&null!=(t=this[0].getAttribute(e))?t:x},removeAttr:function(t){return this.each(function(){1===this.nodeType&&t.split(" ").forEach(function(t){j(this,t)},this)})},prop:function(e,n){return e=Z[e]||e,1 in arguments?this.each(function(t){this[e]=m(this,n,t,this[e])}):this[0]&&this[0][e]},removeProp:function(t){return t=Z[t]||t,this.each(function(){delete this[t]})},data:function(t,e){var n="data-"+t.replace(D,"-$1").toLowerCase(),i=1 in arguments?this.attr(n,e):this.attr(n);return null!==i?v(i):x},val:function(e){return 0 in arguments?(null==e&&(e=""),this.each(function(t){this.value=m(this,e,t,this.value)})):this[0]&&(this[0].multiple?C(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value)},offset:function(o){if(o)return this.each(function(t){var e=C(this),n=m(this,o,t,e.offset()),i=e.offsetParent().offset(),r={top:n.top-i.top,left:n.left-i.left};"static"==e.css("position")&&(r.position="relative"),e.css(r)});if(!this.length)return null;if(k.documentElement!==this[0]&&!C.contains(k.documentElement,this[0]))return{top:0,left:0};var t=this[0].getBoundingClientRect();return{left:t.left+c.pageXOffset,top:t.top+c.pageYOffset,width:Math.round(t.width),height:Math.round(t.height)}},css:function(t,e){if(arguments.length<2){var n=this[0];if("string"==typeof t){if(!n)return;return n.style[_(t)]||getComputedStyle(n,"").getPropertyValue(t)}if(W(t)){if(!n)return;var i={},r=getComputedStyle(n,"");return C.each(t,function(t,e){i[e]=n.style[_(e)]||r.getPropertyValue(e)}),i}}var o="";if("string"==u(t))e||0===e?o=f(t)+":"+p(t,e):this.each(function(){this.style.removeProperty(f(t))});else for(b in t)t[b]||0===t[b]?o+=f(b)+":"+p(b,t[b])+";":this.each(function(){this.style.removeProperty(f(b))});return this.each(function(){this.style.cssText+=";"+o})},index:function(t){return t?this.indexOf(C(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return!!t&&T.some.call(this,function(t){return this.test(y(t))},n(t))},addClass:function(n){return n?this.each(function(t){if("className"in this){S=[];var e=y(this);m(this,n,t,e).split(/\s+/g).forEach(function(t){C(this).hasClass(t)||S.push(t)},this),S.length&&y(this,e+(e?" ":"")+S.join(" "))}}):this},removeClass:function(e){return this.each(function(t){if("className"in this){if(e===x)return y(this,"");S=y(this),m(this,e,t,S).split(/\s+/g).forEach(function(t){S=S.replace(n(t)," ")}),y(this,S.trim())}})},toggleClass:function(n,i){return n?this.each(function(t){var e=C(this);m(this,n,t,y(this)).split(/\s+/g).forEach(function(t){(i===x?!e.hasClass(t):i)?e.addClass(t):e.removeClass(t)})}):this},scrollTop:function(t){if(this.length){var e="scrollTop"in this[0];return t===x?e?this[0].scrollTop:this[0].pageYOffset:this.each(e?function(){this.scrollTop=t}:function(){this.scrollTo(this.scrollX,t)})}},scrollLeft:function(t){if(this.length){var e="scrollLeft"in this[0];return t===x?e?this[0].scrollLeft:this[0].pageXOffset:this.each(e?function(){this.scrollLeft=t}:function(){this.scrollTo(t,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),n=this.offset(),i=Q.test(e[0].nodeName)?{top:0,left:0}:e.offset();return n.top-=parseFloat(C(t).css("margin-top"))||0,n.left-=parseFloat(C(t).css("margin-left"))||0,i.top+=parseFloat(C(e[0]).css("border-top-width"))||0,i.left+=parseFloat(C(e[0]).css("border-left-width"))||0,{top:n.top-i.top,left:n.left-i.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||k.body;t&&!Q.test(t.nodeName)&&"static"==C(t).css("position");)t=t.offsetParent;return t})}},C.fn.detach=C.fn.remove,["width","height"].forEach(function(i){var r=i.replace(/./,function(t){return t[0].toUpperCase()});C.fn[i]=function(e){var t,n=this[0];return e===x?o(n)?n["inner"+r]:a(n)?n.documentElement["scroll"+r]:(t=this.offset())&&t[i]:this.each(function(t){(n=C(this)).css(i,m(this,e,t,n[i]()))})}}),["after","prepend","before","append"].forEach(function(e,s){var a=s%2;C.fn[e]=function(){var n,i,r=C.map(arguments,function(t){var e=[];return"array"==(n=u(t))?(t.forEach(function(t){return t.nodeType!==x?e.push(t):C.zepto.isZ(t)?e=e.concat(t.get()):void(e=e.concat(F.fragment(t)))}),e):"object"==n||null==t?t:F.fragment(t)}),o=1<this.length;return r.length<1?this:this.each(function(t,e){i=a?e:e.parentNode,e=0==s?e.nextSibling:1==s?e.firstChild:2==s?e:null;var n=C.contains(k.documentElement,i);r.forEach(function(t){if(o)t=t.cloneNode(!0);else if(!i)return C(t).remove();i.insertBefore(t,e),n&&function t(e,n){n(e);for(var i=0,r=e.childNodes.length;i<r;i++)t(e.childNodes[i],n)}(t,function(t){if(!(null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src)){var e=t.ownerDocument?t.ownerDocument.defaultView:c;e.eval.call(e,t.innerHTML)}})})})},C.fn[a?e+"To":"insert"+(s?"Before":"After")]=function(t){return C(t)[e](this),this}}),F.Z.prototype=d.prototype=C.fn,F.uniq=w,F.deserializeValue=v,C.zepto=F,C}();return c.Zepto=d,void 0===c.$&&(c.$=d),function(l){function h(t){return t._zid||(t._zid=e++)}function s(t,e,n,i){if((e=f(e)).ns)var r=(o=e.ns,new RegExp("(?:^| )"+o.replace(" "," .* ?")+"(?: |$)"));var o;return(S[h(t)]||[]).filter(function(t){return t&&(!e.e||t.e==e.e)&&(!e.ns||r.test(t.ns))&&(!n||h(t.fn)===h(n))&&(!i||t.sel==i)})}function f(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function p(t,e){return t.del&&!n&&t.e in i||!!e}function d(t){return _[t]||n&&i[t]||t}function g(r,t,e,o,s,a,u){var n=h(r),c=S[n]||(S[n]=[]);t.split(/\s/).forEach(function(t){if("ready"==t)return l(document).ready(e);var n=f(t);n.fn=e,n.sel=s,n.e in _&&(e=function(t){var e=t.relatedTarget;return!e||e!==this&&!l.contains(this,e)?n.fn.apply(this,arguments):void 0});var i=(n.del=a)||e;n.proxy=function(t){if(!(t=j(t)).isImmediatePropagationStopped()){t.data=o;var e=i.apply(r,t._args==v?[t]:[t].concat(t._args));return!1===e&&(t.preventDefault(),t.stopPropagation()),e}},n.i=c.length,c.push(n),"addEventListener"in r&&r.addEventListener(d(n.e),n.proxy,p(n,u))})}function m(e,t,n,i,r){var o=h(e);(t||"").split(/\s/).forEach(function(t){s(e,t,n,i).forEach(function(t){delete S[o][t.i],"removeEventListener"in e&&e.removeEventListener(d(t.e),t.proxy,p(t,r))})})}function j(i,r){return(r||!i.isDefaultPrevented)&&(r||(r=i),l.each(t,function(t,e){var n=r[t];i[t]=function(){return this[e]=a,n&&n.apply(r,arguments)},i[e]=w}),i.timeStamp||(i.timeStamp=Date.now()),(r.defaultPrevented!==v?r.defaultPrevented:"returnValue"in r?!1===r.returnValue:r.getPreventDefault&&r.getPreventDefault())&&(i.isDefaultPrevented=a)),i}function y(t){var e,n={originalEvent:t};for(e in t)r.test(e)||t[e]===v||(n[e]=t[e]);return j(n,t)}var v,e=1,x=Array.prototype.slice,b=l.isFunction,C=function(t){return"string"==typeof t},S={},o={},n="onfocusin"in c,i={focus:"focusin",blur:"focusout"},_={mouseenter:"mouseover",mouseleave:"mouseout"};o.click=o.mousedown=o.mouseup=o.mousemove="MouseEvents",l.event={add:g,remove:m},l.proxy=function(t,e){var n=2 in arguments&&x.call(arguments,2);if(b(t)){var i=function(){return t.apply(e,n?n.concat(x.call(arguments)):arguments)};return i._zid=h(t),i}if(C(e))return n?(n.unshift(t[e],t),l.proxy.apply(null,n)):l.proxy(t[e],t);throw new TypeError("expected function")},l.fn.bind=function(t,e,n){return this.on(t,e,n)},l.fn.unbind=function(t,e){return this.off(t,e)},l.fn.one=function(t,e,n,i){return this.on(t,e,n,i,1)};var a=function(){return!0},w=function(){return!1},r=/^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,t={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};l.fn.delegate=function(t,e,n){return this.on(e,t,n)},l.fn.undelegate=function(t,e,n){return this.off(e,t,n)},l.fn.live=function(t,e){return l(document.body).delegate(this.selector,t,e),this},l.fn.die=function(t,e){return l(document.body).undelegate(this.selector,t,e),this},l.fn.on=function(e,r,n,o,s){var a,u,i=this;return e&&!C(e)?(l.each(e,function(t,e){i.on(t,r,n,e,s)}),i):(C(r)||b(o)||!1===o||(o=n,n=r,r=v),(o===v||!1===n)&&(o=n,n=v),!1===o&&(o=w),i.each(function(t,i){s&&(a=function(t){return m(i,t.type,o),o.apply(this,arguments)}),r&&(u=function(t){var e,n=l(t.target).closest(r,i).get(0);return n&&n!==i?(e=l.extend(y(t),{currentTarget:n,liveFired:i}),(a||o).apply(n,[e].concat(x.call(arguments,1)))):void 0}),g(i,e,o,n,r,u||a)}))},l.fn.off=function(t,n,e){var i=this;return t&&!C(t)?(l.each(t,function(t,e){i.off(t,n,e)}),i):(C(n)||b(e)||!1===e||(e=n,n=v),!1===e&&(e=w),i.each(function(){m(this,t,e,n)}))},l.fn.trigger=function(t,e){return(t=C(t)||l.isPlainObject(t)?l.Event(t):j(t))._args=e,this.each(function(){t.type in i&&"function"==typeof this[t.type]?this[t.type]():"dispatchEvent"in this?this.dispatchEvent(t):l(this).triggerHandler(t,e)})},l.fn.triggerHandler=function(n,i){var r,o;return this.each(function(t,e){(r=y(C(n)?l.Event(n):n))._args=i,r.target=e,l.each(s(e,n.type||n),function(t,e){return o=e.proxy(r),!r.isImmediatePropagationStopped()&&void 0})}),o},"focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){l.fn[e]=function(t){return 0 in arguments?this.bind(e,t):this.trigger(e)}}),l.Event=function(t,e){C(t)||(t=(e=t).type);var n=document.createEvent(o[t]||"Events"),i=!0;if(e)for(var r in e)"bubbles"==r?i=!!e[r]:n[r]=e[r];return n.initEvent(t,i,!0),j(n)}}(d),function(Ch){function Eh(t,e,n,i){return t.global?(r=e||Vh,o=n,s=i,a=Ch.Event(o),Ch(r).trigger(a,s),!a.isDefaultPrevented()):void 0;var r,o,s,a}function Hh(t,e){var n=e.context;return!1!==e.beforeSend.call(n,t,e)&&!1!==Eh(e,n,"ajaxBeforeSend",[t,e])&&void Eh(e,n,"ajaxSend",[t,e])}function Ih(t,e,n,i){var r=n.context,o="success";n.success.call(r,t,o,e),i&&i.resolveWith(r,[t,o,e]),Eh(n,r,"ajaxSuccess",[e,n,t]),Kh(o,e,n)}function Jh(t,e,n,i,r){var o=i.context;i.error.call(o,n,e,t),r&&r.rejectWith(o,[n,e,t]),Eh(i,o,"ajaxError",[n,i,t||e]),Kh(e,n,i)}function Kh(t,e,n){var i,r=n.context;n.complete.call(r,e,t),Eh(n,r,"ajaxComplete",[e,n]),(i=n).global&&!--Ch.active&&Eh(i,null,"ajaxStop")}function Mh(){}function Oh(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function Qh(t,e,n,i){return Ch.isFunction(e)&&(i=n,n=e,e=void 0),Ch.isFunction(n)||(i=n,n=void 0),{url:t,data:e,success:n,dataType:i}}var Sh,Th,Uh=+new Date,Vh=c.document,Wh=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,Xh=/^(?:text|application)\/javascript/i,Yh=/^(?:text|application)\/xml/i,Zh="application/json",$h="text/html",_h=/^\s*$/,ai=Vh.createElement("a");ai.href=c.location.href,Ch.active=0,Ch.ajaxJSONP=function(n,i){if(!("type"in n))return Ch.ajax(n);var r,o,t=n.jsonpCallback,s=(Ch.isFunction(t)?t():t)||"Zepto"+Uh++,a=Vh.createElement("script"),u=c[s],e=function(t){Ch(a).triggerHandler("error",t||"abort")},l={abort:e};return i&&i.promise(l),Ch(a).on("load error",function(t,e){clearTimeout(o),Ch(a).off().remove(),"error"!=t.type&&r?Ih(r[0],l,n,i):Jh(null,e||"error",l,n,i),c[s]=u,r&&Ch.isFunction(u)&&u(r[0]),u=r=void 0}),!1===Hh(l,n)?e("abort"):(c[s]=function(){r=arguments},a.src=n.url.replace(/\?(.+)=\?/,"?$1="+s),Vh.head.appendChild(a),0<n.timeout&&(o=setTimeout(function(){e("timeout")},n.timeout))),l},Ch.ajaxSettings={type:"GET",beforeSend:Mh,success:Mh,error:Mh,complete:Mh,context:null,global:!0,xhr:function(){return new c.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:Zh,xml:"application/xml, text/xml",html:$h,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0,dataFilter:Mh},Ch.ajax=function(lj){var mj,nj,Mi,ki,oj=Ch.extend({},lj||{}),pj=Ch.Deferred&&Ch.Deferred();for(Sh in Ch.ajaxSettings)void 0===oj[Sh]&&(oj[Sh]=Ch.ajaxSettings[Sh]);(ki=oj).global&&0==Ch.active++&&Eh(ki,null,"ajaxStart"),oj.crossDomain||((mj=Vh.createElement("a")).href=oj.url,mj.href=mj.href,oj.crossDomain=ai.protocol+"//"+ai.host!=mj.protocol+"//"+mj.host),oj.url||(oj.url=c.location.toString()),-1<(nj=oj.url.indexOf("#"))&&(oj.url=oj.url.slice(0,nj)),(Mi=oj).processData&&Mi.data&&"string"!=Ch.type(Mi.data)&&(Mi.data=Ch.param(Mi.data,Mi.traditional)),!Mi.data||Mi.type&&"GET"!=Mi.type.toUpperCase()&&"jsonp"!=Mi.dataType||(Mi.url=Oh(Mi.url,Mi.data),Mi.data=void 0);var qj=oj.dataType,rj=/\?.+=\?/.test(oj.url);if(rj&&(qj="jsonp"),!1!==oj.cache&&(lj&&!0===lj.cache||"script"!=qj&&"jsonp"!=qj)||(oj.url=Oh(oj.url,"_="+Date.now())),"jsonp"==qj)return rj||(oj.url=Oh(oj.url,oj.jsonp?oj.jsonp+"=?":!1===oj.jsonp?"":"callback=?")),Ch.ajaxJSONP(oj,pj);var sj,tj=oj.accepts[qj],uj={},vj=function(t,e){uj[t.toLowerCase()]=[t,e]},wj=/^([\w-]+:)\/\//.test(oj.url)?RegExp.$1:c.location.protocol,xj=oj.xhr(),yj=xj.setRequestHeader;if(pj&&pj.promise(xj),oj.crossDomain||vj("X-Requested-With","XMLHttpRequest"),vj("Accept",tj||"*/*"),(tj=oj.mimeType||tj)&&(-1<tj.indexOf(",")&&(tj=tj.split(",",2)[0]),xj.overrideMimeType&&xj.overrideMimeType(tj)),(oj.contentType||!1!==oj.contentType&&oj.data&&"GET"!=oj.type.toUpperCase())&&vj("Content-Type",oj.contentType||"application/x-www-form-urlencoded"),oj.headers)for(Th in oj.headers)vj(Th,oj.headers[Th]);if(xj.setRequestHeader=vj,!(xj.onreadystatechange=function(){if(4==xj.readyState){xj.onreadystatechange=Mh,clearTimeout(sj);var Cj,Dj=!1;if(200<=xj.status&&xj.status<300||304==xj.status||0==xj.status&&"file:"==wj){if(qj=qj||((Ji=oj.mimeType||xj.getResponseHeader("content-type"))&&(Ji=Ji.split(";",2)[0]),Ji&&(Ji==$h?"html":Ji==Zh?"json":Xh.test(Ji)?"script":Yh.test(Ji)&&"xml")||"text"),"arraybuffer"==xj.responseType||"blob"==xj.responseType)Cj=xj.response;else{Cj=xj.responseText;try{Cj=function(t,e,n){if(n.dataFilter==Mh)return t;var i=n.context;return n.dataFilter.call(i,t,e)}(Cj,qj,oj),"script"==qj?eval(Cj):"xml"==qj?Cj=xj.responseXML:"json"==qj&&(Cj=_h.test(Cj)?null:Ch.parseJSON(Cj))}catch(t){Dj=t}if(Dj)return Jh(Dj,"parsererror",xj,oj,pj)}Ih(Cj,xj,oj,pj)}else Jh(xj.statusText||null,xj.status?"error":"abort",xj,oj,pj)}var Ji})===Hh(xj,oj))return xj.abort(),Jh(null,"abort",xj,oj,pj),xj;var zj=!("async"in oj)||oj.async;if(xj.open(oj.type,oj.url,zj,oj.username,oj.password),oj.xhrFields)for(Th in oj.xhrFields)xj[Th]=oj.xhrFields[Th];for(Th in uj)yj.apply(xj,uj[Th]);return 0<oj.timeout&&(sj=setTimeout(function(){xj.onreadystatechange=Mh,xj.abort(),Jh(null,"timeout",xj,oj,pj)},oj.timeout)),xj.send(oj.data?oj.data:null),xj},Ch.get=function(){return Ch.ajax(Qh.apply(null,arguments))},Ch.post=function(){var t=Qh.apply(null,arguments);return t.type="POST",Ch.ajax(t)},Ch.getJSON=function(){var t=Qh.apply(null,arguments);return t.dataType="json",Ch.ajax(t)},Ch.fn.load=function(t,e,n){if(!this.length)return this;var i,r=this,o=t.split(/\s/),s=Qh(t,e,n),a=s.success;return 1<o.length&&(s.url=o[0],i=o[1]),s.success=function(t){r.html(i?Ch("<div>").html(t.replace(Wh,"")).find(i):t),a&&a.apply(r,arguments)},Ch.ajax(s),this};var bi=encodeURIComponent;Ch.param=function(t,e){var n=[];return n.add=function(t,e){Ch.isFunction(e)&&(e=e()),null==e&&(e=""),this.push(bi(t)+"="+bi(e))},function n(i,t,r,o){var s,a=Ch.isArray(t),u=Ch.isPlainObject(t);Ch.each(t,function(t,e){s=Ch.type(e),o&&(t=r?o:o+"["+(u||"object"==s||"array"==s?t:"")+"]"),!o&&a?i.add(e.name,e.value):"array"==s||!r&&"object"==s?n(i,e,r,t):i.add(t,e)})}(n,t,e),n.join("&").replace(/%20/g,"+")}}(d),(Vj=d).fn.serializeArray=function(){var n,i,e=[],r=function(t){return t.forEach?t.forEach(r):void e.push({name:n,value:t})};return this[0]&&Vj.each(this[0].elements,function(t,e){i=e.type,(n=e.name)&&"fieldset"!=e.nodeName.toLowerCase()&&!e.disabled&&"submit"!=i&&"reset"!=i&&"button"!=i&&"file"!=i&&("radio"!=i&&"checkbox"!=i||e.checked)&&r(Vj(e).val())}),e},Vj.fn.serialize=function(){var e=[];return this.serializeArray().forEach(function(t){e.push(encodeURIComponent(t.name)+"="+encodeURIComponent(t.value))}),e.join("&")},Vj.fn.submit=function(t){if(0 in arguments)this.bind("submit",t);else if(this.length){var e=Vj.Event("submit");this.eq(0).trigger(e),e.isDefaultPrevented()||this.get(0).submit()}return this},function(){try{getComputedStyle(void 0)}catch(t){var n=getComputedStyle;c.getComputedStyle=function(t,e){try{return n(t,e)}catch(t){return null}}}}(),d}),$(function(){var r=navigator.userAgent,o={secret_key:"e00a05cf37305a22ba10fec428b4ab01",getPlatform:function(){for(var t=["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"],e="pc",n=0,i=t.length;n<i;n++)if(0<r.indexOf(t[n])){e="mobile";break}return e},isWX:function(){return!(!/(micromessenger)\/([\w\.]+)/i.test(r)||/miniprogram/i.test(r))},isWxMini:function(e){"micromessenger"==r.toLowerCase().match(/MicroMessenger/i)?wx.miniProgram.getEnv(function(t){t.miniprogram?e&&e(!0):e&&e(!1)}):e&&e(!1)},simpleMsg:function(t,e){t||e(!1);var n=$("#msg-model");n.find("span").html(t),n.show(),this.bindAnim(n,"bounceInDown"),this.$setTimeout=setTimeout(function(){n.hide(),clearTimeout(this.$setTimeout)},2e3),e&&e(!1)},getQueryString:function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),n=location.search.substr(1).match(e);if(null!=n){var i=n[2];try{i=decodeURIComponent(i)}catch(t){i=unescape(i)}return i}return null},createScript:function(t,e){if(t){var n=$("<script/>");n.one("load",e||emptyFn),n.attr("src",t),$("body").append(n)}},buryingPoint:function(e){Utils.getToken(function(t){$.ajax({url:lanh.apiHost.replace(/:\d+/g,"")+"user/behavior/burying/point?session_id="+t.session_id,type:"POST",contentType:"application/json",dataType:"json",headers:{session_id:t.session_id},data:JSON.stringify({manuscriptId:lanh.kid,type:e.type,targetUser:Utils.getQueryString("as_belong_user")||Utils.getQueryString("userId"),comment:e.comment,action:e.action,forwardingUser:e.forwardingUser,clientType:"wx"}),success:function(t){},error:function(t){}})})},getToken:function(t){var e=this.getQueryString("session_id"),n=/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;n.lastIndex=0;var i=(window.extend||$.extend)(!0,{userId:"00000000-0000-0000-0000-000000010001",phoneNumber:"18900010001",nickName:"kma mock user",id:"",session_id:""},e&&n.test(e)?{userId:this.getQueryString("userId"),phoneNumber:this.getQueryString("phoneNumber"),nickName:this.getQueryString("nickName"),id:this.getQueryString("id"),session_id:e}:{});return t&&t(i)}};"pc"!=o.getPlatform()&&o.isWxMini(function(t){var i=location.href,r="pc"==o.getPlatform()?"click":"touchend";t||3!=o.getQueryString("mtype")||(o.getQueryString("userId")?new Promise(function(i,t){o.getToken(function(t){$.ajax({url:lanh.apiHost.replace(/:\d+/g,"")+"manuscript/detail?id="+lanh.kid+"&session_id="+t.session_id,method:"get",dataType:"json",headers:{session_id:t.session_id},success:function(t,e,n){i(t.data)},error:function(t,e){rej("获取活动详情失败：err"+JSON.stringify(t))}})})}).then(function(n){o.getToken(function(t){$.ajax({url:lanh.apiHost.replace(/:\d+/g,"")+"manuscript/analysis/save?session_id="+t.session_id,type:"POST",contentType:"application/json",dataType:"json",headers:{session_id:t.session_id},data:JSON.stringify({as_from:"wx",as_type:"scan_access",as_belong_module:lanh.kid,as_user:o.getQueryString("userId"),as_belong_user:o.getQueryString("as_belong_user"),as_belong_id:n.businessInfo.businessId,secret_key:o.secret_key}),success:function(t){},error:function(t){}})}),o.getQueryString("as_belong_user")&&o.getQueryString("as_belong_user")!=o.getQueryString("userId")&&o.getQueryString("forward_id")!=o.getQueryString("userId")&&o.buryingPoint({type:"be_view_manu",comment:"查看转发活动",action:"查看",forwardingUser:o.getQueryString("forward_id")}),o.createScript("http://res.wx.qq.com/open/js/jweixin-1.4.0.js",function(){o.getToken(function(e){$.ajax({url:lanh.msHost.replace(/:\d+/g,"")+"api/identify_service/v1/openplatform/get_js_config?session_id="+e.session_id+"&secret_key="+o.secret_key+"&url="+encodeURIComponent(i),type:"GET",contentType:"application/json",dataType:"json",headers:{session_id:e.session_id},data:{},success:function(t){0==t.status&&(wx.config({debug:!1,appId:t.data.appId,timestamp:t.data.timestamp,nonceStr:t.data.nonceStr,signature:t.data.signature,jsApiList:["onMenuShareAppMessage","onMenuShareTimeline"]}),wx.ready(function(){function t(){o.getQueryString("as_belong_user")?o.buryingPoint({type:"be_forwarding_manu",comment:"转发活动",action:"转发",forwardingUser:o.getQueryString("userId")}):(o.buryingPoint({type:"be_share_manu",comment:"分享活动",action:"分享",forwardingUser:o.getQueryString("userId")}),$.ajax({url:lanh.apiHost.replace(/:\d+/g,"")+"manuscript/analysis/save?session_id="+e.session_id,type:"POST",contentType:"application/json",dataType:"json",headers:{session_id:e.session_id},data:JSON.stringify({as_from:"wx",as_type:"scan_share",as_belong_module:lanh.kid,as_belong_user:o.getQueryString("userId"),as_belong_id:n.businessInfo.businessId,secret_key:o.secret_key}),success:function(t){},error:function(t){}}))}wx.onMenuShareAppMessage({title:n.name||"未命名稿件",desc:n.description||"",link:n.url+"?id="+lanh.kid+"&as_belong_user="+(o.getQueryString("as_belong_user")||o.getQueryString("userId"))+"&forward_id="+o.getQueryString("userId"),imgUrl:n.cover,success:function(){t()},fail:function(t){o.simpleMsg("设置失败")}}),wx.onMenuShareTimeline({title:n.name||"未命名稿件",desc:n.description||"",link:n.url+"?id="+lanh.kid+"&as_belong_user="+(o.getQueryString("as_belong_user")||o.getQueryString("userId"))+"&forward_id="+o.getQueryString("userId"),imgUrl:n.cover,success:function(){t()},fail:function(t){o.simpleMsg("设置失败")}})}),wx.error(function(t){console.log("微信验证失败。"),console.error(t)}))}})})})}).catch(function(t){o.simpleMsg(t)}):o.getToken(function(t){function e(){window.location.href=lanh.msHost.replace(/:\d+/g,"")+"api/identify_service/v1/openauth/wx_authorize?secret_key="+o.secret_key+"&redirect_uri="+encodeURIComponent(i)}var n=$('                        <div style="position:absolute;top:0;left:0;width:100%;height:100vh;line-height:100vh;text-align:center;background-color:rgba(0,0,0,.5);z-index:2;">                            <button id="btn" style="width:4rem;height:1.5rem;border-radius:1.5rem;line-height:1.5rem;border:none;outline:none;color:#fff;background-color:#00bad0;font-size:0.5rem;">授权登陆</button>                        </div>');e(),setTimeout(function(){$("body").append(n)},2e3),n.find("#btn").on(r,function(){e()})}))})});