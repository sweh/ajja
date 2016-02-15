/*!
 * Knockout Mapping plugin v2.5.0
 * (c) 2013 Steven Sanderson, Roy Jacobs - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
!function(e){"use strict";if("function"==typeof require&&"object"==typeof exports&&"object"==typeof module)e(require("knockout"),exports);else if("function"==typeof define&&define.amd)define(["knockout","exports"],e);else{if("undefined"==typeof ko)throw new Error("Knockout is required, please ensure it is loaded before loading this mapping plug-in");e(ko,ko.mapping={})}}(function(e,r){"use strict";function t(){for(var e,r,t,n=arguments,a=n.length,i={},u=[];a--;)for(t=n[a],e=t.length;e--;)r=t[e],i[r]||(i[r]=1,u.push(r));return u}function n(e,a){var i;for(var u in a)if(a.hasOwnProperty(u)&&a[u])if(i=r.getType(e[u]),u&&e[u]&&"array"!==i&&"string"!==i)n(e[u],a[u]);else{var o="array"===r.getType(e[u])&&"array"===r.getType(a[u]);e[u]=o?t(e[u],a[u]):a[u]}}function a(e,r){var t={};return n(t,e),n(t,r),t}function i(e,r){for(var t=a({},e),n=T.length-1;n>=0;n--){var i=T[n];t[i]&&(t[""]instanceof Object||(t[""]={}),t[""][i]=t[i],delete t[i])}return r&&(t.ignore=u(r.ignore,t.ignore),t.include=u(r.include,t.include),t.copy=u(r.copy,t.copy),t.observe=u(r.observe,t.observe)),t.ignore=u(t.ignore,I.ignore),t.include=u(t.include,I.include),t.copy=u(t.copy,I.copy),t.observe=u(t.observe,I.observe),t.mappedProperties=t.mappedProperties||{},t.copiedProperties=t.copiedProperties||{},t}function u(t,n){return"array"!==r.getType(t)&&(t="undefined"===r.getType(t)?[]:[t]),"array"!==r.getType(n)&&(n="undefined"===r.getType(n)?[]:[n]),e.utils.arrayGetDistinctValues(t.concat(n))}function o(r,t){var n=e.dependentObservable;e.dependentObservable=function(t,n,a){a=a||{},t&&"object"==typeof t&&(a=t);var i=a.deferEvaluation,u=!1,o=function(t){var n=e.dependentObservable;e.dependentObservable=w;var a=e.isWriteableObservable(t);e.dependentObservable=n;var i=w({read:function(){return u||(e.utils.arrayRemoveItem(r,t),u=!0),t.apply(t,arguments)},write:a&&function(e){return t(e)},deferEvaluation:!0});return i.__DO=t,i};a.deferEvaluation=!0;var s=w(t,n,a);return i||(s=o(s),r.push(s)),s},e.dependentObservable.fn=w.fn,e.computed=e.dependentObservable;var a=t();return e.dependentObservable=n,e.computed=e.dependentObservable,a}function s(t,n,i,u,l,b,y){var g="array"===r.getType(e.utils.unwrapObservable(n));if(b=b||"",r.isMapped(t)){var w=e.utils.unwrapObservable(t)[m];i=a(w,i)}var k={data:n,parent:y||l},T=function(){return i[u]&&i[u].create instanceof Function},j=function(r){return o(O,function(){return i[u].create(e.utils.unwrapObservable(l)instanceof Array?{data:r||k.data,parent:k.parent,skip:x}:{data:r||k.data,parent:k.parent})})},I=function(){return i[u]&&i[u].update instanceof Function},E=function(r,t){var n={data:t||k.data,parent:k.parent,target:e.utils.unwrapObservable(r)};return e.isWriteableObservable(r)&&(n.observable=r),i[u].update(n)},P=h.get(n);if(P)return P;if(u=u||"",g){var J=[],_=!1,W=function(e){return e};i[u]&&i[u].key&&(W=i[u].key,_=!0),e.isObservable(t)||(t=e.observableArray([]),t.mappedRemove=function(e){var r="function"==typeof e?e:function(r){return r===W(e)};return t.remove(function(e){return r(W(e))})},t.mappedRemoveAll=function(r){var n=c(r,W);return t.remove(function(r){return-1!==e.utils.arrayIndexOf(n,W(r))})},t.mappedDestroy=function(e){var r="function"==typeof e?e:function(r){return r===W(e)};return t.destroy(function(e){return r(W(e))})},t.mappedDestroyAll=function(r){var n=c(r,W);return t.destroy(function(r){return-1!==e.utils.arrayIndexOf(n,W(r))})},t.mappedIndexOf=function(r){var n=c(t(),W),a=W(r);return e.utils.arrayIndexOf(n,a)},t.mappedGet=function(e){return t()[t.mappedIndexOf(e)]},t.mappedCreate=function(r){if(-1!==t.mappedIndexOf(r))throw new Error("There already is an object with the key that you specified.");var n=T()?j(r):r;if(I()){var a=E(n,r);e.isWriteableObservable(n)?n(a):n=a}return t.push(n),n});var D=c(e.utils.unwrapObservable(t),W).sort(),S=c(n,W);_&&S.sort();var A,N,M,C=e.utils.compareArrays(D,S),q={},F=e.utils.unwrapObservable(n),R={},$=!0;for(A=0,N=F.length;N>A;A++){if(M=W(F[A]),void 0===M||M instanceof Object){$=!1;break}R[M]=F[A]}var G,K,V=[],z=0;for(A=0,N=C.length;N>A;A++){M=C[A];var B,H=b+"["+A+"]";switch(M.status){case"added":G=$?R[M.value]:f(e.utils.unwrapObservable(n),M.value,W),B=s(void 0,G,i,u,t,H,l),T()||(B=e.utils.unwrapObservable(B)),K=p(e.utils.unwrapObservable(n),G,q),B===x?z++:V[K-z]=B,q[K]=!0;break;case"retained":G=$?R[M.value]:f(e.utils.unwrapObservable(n),M.value,W),B=f(t,M.value,W),s(B,G,i,u,t,H,l),K=p(e.utils.unwrapObservable(n),G,q),V[K]=B,q[K]=!0;break;case"deleted":B=f(t,M.value,W)}J.push({event:M.status,item:B})}t(V),i[u]&&i[u].arrayChanged&&e.utils.arrayForEach(J,function(e){i[u].arrayChanged(e.event,e.item)})}else if(d(n)){if(t=e.utils.unwrapObservable(t),!t){if(T()){var L=j();return I()&&(L=E(L)),L}if(I())return E();t={}}if(I()&&(t=E(t)),h.save(n,t),I())return t;v(n,function(a){var u=b.length?b+"."+a:a;if(-1===e.utils.arrayIndexOf(i.ignore,u)){if(-1!==e.utils.arrayIndexOf(i.copy,u))return void(t[a]=n[a]);if("object"!=typeof n[a]&&"array"!==r.getType(n[a])&&i.observe.length>0&&-1===e.utils.arrayIndexOf(i.observe,u))return t[a]=n[a],void(i.copiedProperties[u]=!0);var o=h.get(n[a]),p=s(t[a],n[a],i,a,t,u,t),l=o||p;if(i.observe.length>0&&-1===e.utils.arrayIndexOf(i.observe,u))return t[a]=e.utils.unwrapObservable(l),void(i.copiedProperties[u]=!0);e.isWriteableObservable(t[a])?(l=e.utils.unwrapObservable(l),t[a]()!==l&&t[a](l)):(l=void 0===t[a]?l:e.utils.unwrapObservable(l),t[a]=l),i.mappedProperties[u]=!0}})}else switch(r.getType(n)){case"function":I()?e.isWriteableObservable(n)?(n(E(n)),t=n):t=E(n):t=n;break;default:if(e.isWriteableObservable(t)){var Q;return I()?(Q=E(t),t(Q),Q):(Q=e.utils.unwrapObservable(n),t(Q),Q)}var U=T()||I();if(t=T()?j():e.observable(e.utils.unwrapObservable(n)),I()&&t(E(t)),U)return t}return t}function p(e,r,t){for(var n=0,a=e.length;a>n;n++)if(t[n]!==!0&&e[n]===r)return n;return null}function l(t,n){var a;return n&&(a=n(t)),"undefined"===r.getType(a)&&(a=t),e.utils.unwrapObservable(a)}function f(r,t,n){r=e.utils.unwrapObservable(r);for(var a=0,i=r.length;i>a;a++){var u=r[a];if(l(u,n)===t)return u}throw new Error("When calling ko.update*, the key '"+t+"' was not found!")}function c(r,t){return e.utils.arrayMap(e.utils.unwrapObservable(r),function(e){return t?l(e,t):e})}function v(e,t){if("array"===r.getType(e))for(var n=0;n<e.length;n++)t(n);else for(var a in e)e.hasOwnProperty(a)&&t(a)}function d(e){var t=r.getType(e);return("object"===t||"array"===t)&&null!==e}function b(e,t,n){var a=e||"";return"array"===r.getType(t)?e&&(a+="["+n+"]"):(e&&(a+="."),a+=n),a}function y(){var r=[],t=[];this.save=function(n,a){var i=e.utils.arrayIndexOf(r,n);i>=0?t[i]=a:(r.push(n),t.push(a))},this.get=function(n){var a=e.utils.arrayIndexOf(r,n),i=a>=0?t[a]:void 0;return i}}function g(){var e={},r=function(r){var t;try{t=r}catch(n){t="$$$"}var a=e[t];return void 0===a&&(a=new y,e[t]=a),a};this.save=function(e,t){r(e).save(e,t)},this.get=function(e){return r(e).get(e)}}e.mapping=r;var O,h,m="__ko_mapping__",w=e.dependentObservable,k=0,T=["create","update","key","arrayChanged"],x={},j={include:["_destroy"],ignore:[],copy:[],observe:[]},I=j;r.isMapped=function(r){var t=e.utils.unwrapObservable(r);return t&&t[m]},r.fromJS=function(e){if(0===arguments.length)throw new Error("When calling ko.fromJS, pass the object you want to convert.");try{k||(O=[],h=new g),k++;var r,t;2===arguments.length&&(arguments[1][m]?t=arguments[1]:r=arguments[1]),3===arguments.length&&(r=arguments[1],t=arguments[2]),t&&(r=a(r,t[m])),r=i(r);var n=s(t,e,r);if(t&&(n=t),!--k)for(;O.length;){var u=O.pop();u&&(u(),u.__DO.throttleEvaluation=u.throttleEvaluation)}return n[m]=a(n[m],r),n}catch(o){throw k=0,o}},r.fromJSON=function(t){var n=Array.prototype.slice.call(arguments,0);return n[0]=e.utils.parseJson(t),r.fromJS.apply(this,n)},r.toJS=function(t,n){if(I||r.resetDefaultOptions(),0===arguments.length)throw new Error("When calling ko.mapping.toJS, pass the object you want to convert.");if("array"!==r.getType(I.ignore))throw new Error("ko.mapping.defaultOptions().ignore should be an array.");if("array"!==r.getType(I.include))throw new Error("ko.mapping.defaultOptions().include should be an array.");if("array"!==r.getType(I.copy))throw new Error("ko.mapping.defaultOptions().copy should be an array.");return n=i(n,t[m]),r.visitModel(t,function(r){return e.utils.unwrapObservable(r)},n)},r.toJSON=function(t,n){var a=r.toJS(t,n);return e.utils.stringifyJson(a)},r.defaultOptions=function(){return arguments.length>0?void(I=arguments[0]):I},r.resetDefaultOptions=function(){I={include:j.include.slice(0),ignore:j.ignore.slice(0),copy:j.copy.slice(0),observe:j.observe.slice(0)}},r.getType=function(e){if(e&&"object"==typeof e){if(e.constructor===Date)return"date";if(e.constructor===Array)return"array"}return typeof e},r.visitModel=function(t,n,a){a=a||{},a.visitedObjects=a.visitedObjects||new g;var u,o=e.utils.unwrapObservable(t);if(!d(o))return n(t,a.parentName);a=i(a,o[m]),n(t,a.parentName),u="array"===r.getType(o)?[]:{},a.visitedObjects.save(t,u);var s=a.parentName;return v(o,function(t){if(!a.ignore||-1===e.utils.arrayIndexOf(a.ignore,t)){var i=o[t];if(a.parentName=b(s,o,t),-1!==e.utils.arrayIndexOf(a.copy,t)||-1!==e.utils.arrayIndexOf(a.include,t)||!o[m]||!o[m].mappedProperties||o[m].mappedProperties[t]||!o[m].copiedProperties||o[m].copiedProperties[t]||"array"===r.getType(o))switch(r.getType(e.utils.unwrapObservable(i))){case"object":case"array":case"undefined":var p=a.visitedObjects.get(i);u[t]="undefined"!==r.getType(p)?p:r.visitModel(i,n,a);break;default:u[t]=n(i,a.parentName)}}}),u}});
//# sourceMappingURL=knockout.mapping.min.js.map