// Minimal DOM shim + React render test of src/App.jsx
// Must run from /c/Users/korko/Documents/political-analysis-site (or with that as cwd)

class Event { constructor(t, o){ this.type=t; this.target=this; this.bubbles=o&&o.bubbles||false; this.cancelable=o&&o.cancelable||false; } preventDefault(){} stopPropagation(){} }
class MouseEvent extends Event { constructor(t,o){ super(t,o); this.button=0; } }
class KeyboardEvent extends Event { constructor(t,o){ super(t,o); this.key=o&&o.key!=null?o.key:t; } }
class HTMLElement {
  constructor(tag){ this.tagName=(tag||'div').toUpperCase(); this.className=''; this.children=[]; this.attributes=new Map(); this.style=new Map(); this.dataset={}; this.hidden=false; this.disabled=false; this.tabIndex=0; this.value=''; this.checked=false; this.files=[]; this.textContent=''; this.innerHTML=''; this._listeners={}; }
  addEventListener(t,fn){ (this._listeners[t]=this._listeners[t]||[]).push(fn); }
  removeEventListener(t,fn){ this._listeners[t]=this._listeners[t]||[]; this._listeners[t]=this._listeners[t].filter(f=>f!==fn); }
  dispatchEvent(e){ const l=this._listeners[e.type]||[]; l.forEach(f=>f(e)); return true; }
  setAttribute(k,v){ this.attributes.set(k,v); }
  getAttribute(k){ return this.attributes.has(k)?this.attributes.get(k):null; }
  querySelector(){ return null; }
  querySelectorAll(){ return []; }
  appendChild(c){ this.children.push(c); return c; }
  removeChild(c){ const i=this.children.indexOf(c); if(i>=0)this.children.splice(i,1); return c; }
  getBoundingClientRect(){ return {x:0,y:0,width:1,height:1}; }
}
class HTMLDivElement extends HTMLElement {}
class HTMLSpanElement extends HTMLElement {}
class HTMLScriptElement extends HTMLElement {}
class HTMLLinkElement extends HTMLElement {}
class HTMLMetaElement extends HTMLElement {}
class HTMLTitleElement extends HTMLElement {}
class HTMLBaseElement extends HTMLElement {}
class HTMLStyleElement extends HTMLElement {}
class HTMLInputElement extends HTMLElement { constructor(){ super('input'); this.type='text'; this.value=''; this.checked=false; } }
class HTMLTextAreaElement extends HTMLElement {}
class HTMLSelectElement extends HTMLElement {}
class HTMLOptionElement extends HTMLElement {}
class HTMLButtonElement extends HTMLElement {}
class HTMLFormElement extends HTMLElement {}
class HTMLLabelElement extends HTMLElement {}
class HTMLOListElement extends HTMLElement {}
class HTMLLiElement extends HTMLElement {}
class HTMLUListElement extends HTMLElement {}
class HTMLTableElement extends HTMLElement {}
class HTMLTableCellElement extends HTMLElement {}
class HTMLTableRowElement extends HTMLElement {}
class HTMLHeadElement extends HTMLElement {}
class HTMLBodyElement extends HTMLElement {}
class HTMLHtmlElement extends HTMLElement {}
class HTMLCanvasElement extends HTMLElement {}
class SVGElement extends HTMLElement {}
class SVGSVGElement extends SVGElement {}
class SVGPathElement extends SVGElement {}
class SVGCircleElement extends SVGElement {}
class SVGRectElement extends SVGElement {}
class SVGTitleElement extends SVGElement {}
class SVGTextElement extends SVGElement {}
class SVGGElement extends SVGElement {}
class SVGRadiusElement extends SVGElement {}

class Document {
  constructor(){
    this.documentElement=new HTMLHtmlElement();
    this.body=new HTMLBodyElement();
    this.head=new HTMLHeadElement();
    this.currentScript=null;
    this.styleSheets={};
    this._listeners={};
    this.children=[this.documentElement, this.body];
    this.doctype=null;
  }
  createElement(tag){ const c=new (globalThis[tag]||HTMLElement)(tag); c.ownerDocument=this; return c; }
  createElementNS(ns,tag){ return this.createElement(tag); }
  getElementById(id){ return this.documentElement.querySelector('#'+id)||null; }
  querySelector(sel){ return this.documentElement.querySelector(sel)||null; }
  querySelectorAll(sel){ return this.documentElement.querySelectorAll(sel)||[]; }
  addEventListener(){}
  removeEventListener(){}
}
class Location {
  constructor(){ this.href='http://localhost:3000/'; this.protocol='http:'; this.host='localhost:3000'; this.hostname='localhost'; this.port='3000'; this.pathname='/'; this.search=''; this.hash=''; this.origin='http://localhost:3000'; this.assign=()=>{}; this.replace=()=>{}; this.reload=()=>{}; }
}
class History {
  constructor(){ this.length=1; this.state={}; this.back=()=>{}; this.forward=()=>{}; this.go=()=>{}; }
  pushState(){}
  replaceState(){}
}

const win = new (class {
  constructor(){
    this.document=new Document();
    this.location=new Location();
    this.history=new History();
    this.navigator={userAgent:'Node',platform:'win32'};
    this.HTMLElement=HTMLElement; this.HTMLDivElement=HTMLDivElement; this.HTMLSpanElement=HTMLSpanElement;
    this.HTMLScriptElement=HTMLScriptElement; this.HTMLLinkElement=HTMLLinkElement; this.HTMLMetaElement=HTMLMetaElement;
    this.HTMLTitleElement=HTMLTitleElement; this.HTMLBaseElement=HTMLBaseElement; this.HTMLStyleElement=HTMLStyleElement;
    this.HTMLInputElement=HTMLInputElement; this.HTMLTextAreaElement=HTMLTextAreaElement; this.HTMLSelectElement=HTMLSelectElement;
    this.HTMLOptionElement=HTMLOptionElement; this.HTMLButtonElement=HTMLButtonElement; this.HTMLFormElement=HTMLFormElement;
    this.HTMLLabelElement=HTMLLabelElement; this.HTMLOListElement=HTMLOListElement; this.HTMLLiElement=HTMLLiElement;
    this.HTMLUListElement=HTMLUListElement; this.HTMLTableElement=HTMLTableElement; this.HTMLTableCellElement=HTMLTableCellElement;
    this.HTMLTableRowElement=HTMLTableRowElement; this.HTMLHeadElement=HTMLHeadElement; this.HTMLBodyElement=HTMLBodyElement;
    this.HTMLHtmlElement=HTMLHtmlElement; this.HTMLCanvasElement=HTMLCanvasElement; this.SVGElement=SVGElement;
    this.SVGSVGElement=SVGSVGElement; this.SVGPathElement=SVGPathElement; this.SVGCircleElement=SVGCircleElement;
    this.SVGRectElement=SVGRectElement; this.SVGTitleElement=SVGTitleElement; this.SVGTextElement=SVGTextElement;
    this.SVGRadiusElement=SVGRadiusElement; this.SVGGElement=SVGGElement;
    this.getComputedStyle=()=>({}); this.addEventListener=()=>{}; this.removeEventListener=()=>{};
    this.requestAnimationFrame=(cb)=>setTimeout(()=>cb(performance.now()),0);
    this.cancelAnimationFrame=clearTimeout; this.print=()=>{};
  }
})();

globalThis.window=win;
globalThis.document=win.document;
globalThis.HTMLElement=win.HTMLElement; globalThis.HTMLDivElement=win.HTMLDivElement; globalThis.HTMLSpanElement=win.HTMLSpanElement;
globalThis.HTMLScriptElement=win.HTMLScriptElement; globalThis.HTMLLinkElement=win.HTMLLinkElement; globalThis.HTMLMetaElement=win.HTMLMetaElement;
globalThis.HTMLTitleElement=win.HTMLTitleElement; globalThis.HTMLBaseElement=win.HTMLBaseElement; globalThis.HTMLStyleElement=win.HTMLStyleElement;
globalThis.HTMLInputElement=win.HTMLInputElement; globalThis.HTMLTextAreaElement=win.HTMLTextAreaElement; globalThis.HTMLSelectElement=win.HTMLSelectElement;
globalThis.HTMLOptionElement=win.HTMLOptionElement; globalThis.HTMLButtonElement=win.HTMLButtonElement; globalThis.HTMLFormElement=win.HTMLFormElement;
globalThis.HTMLLabelElement=win.HTMLLabelElement; globalThis.HTMLOListElement=win.HTMLOListElement; globalThis.HTMLLiElement=win.HTMLLiElement;
globalThis.HTMLUListElement=win.HTMLUListElement; globalThis.HTMLTableElement=win.HTMLTableElement; globalThis.HTMLTableCellElement=win.HTMLTableCellElement;
globalThis.HTMLTableRowElement=win.HTMLTableRowElement; globalThis.HTMLHeadElement=win.HTMLHeadElement; globalThis.HTMLBodyElement=win.HTMLBodyElement;
globalThis.HTMLHtmlElement=win.HTMLHtmlElement; globalThis.HTMLCanvasElement=win.HTMLCanvasElement; globalThis.SVGElement=win.SVGElement;
globalThis.SVGSVGElement=win.SVGSVGElement; globalThis.SVGPathElement=win.SVGPathElement; globalThis.SVGCircleElement=win.SVGCircleElement;
globalThis.SVGRectElement=win.SVGRectElement; globalThis.SVGTitleElement=win.SVGTitleElement; globalThis.SVGTextElement=win.SVGTextElement;
globalThis.SVGRadiusElement=win.SVGRadiusElement; globalThis.SVGGElement=win.SVGGElement;
globalThis.localStorage={ getItem:()=>null, setItem:()=>{}, removeItem:()=>{}, clear:()=>{} };
globalThis.sessionStorage=globalThis.localStorage;
globalThis.history=win.history; globalThis.location=win.location; if(typeof navigator==='object'){Object.defineProperty(globalThis,'navigator',{value:win.navigator,configurable:true});} else { globalThis.navigator=win.navigator; }
globalThis.matchMedia=()=>({matches:false,addListener(){},removeListener(){}});
globalThis.requestAnimationFrame=win.requestAnimationFrame;
globalThis.cancelAnimationFrame=win.cancelAnimationFrame;
globalThis.performance={ now:()=>Date.now() };
globalThis.Promise=globalThis.Promise||require('es6-promise').Promise;

// RENDER (bundle compiled by esbuild, CJS)
const React=require('react');
const ReactDOM=require('react-dom/client');
const App=require('./dom-bundle.cjs').default;

const rootEl=document.createElement('div');
rootEl.id='root';
document.body.appendChild(rootEl);
const root=ReactDOM.createRoot(rootEl);

let threw=null;
try {
  root.render(React.createElement(React.StrictMode,null,React.createElement(App)));
  console.log('RENDER OK: no throw');
} catch(e){ threw=e; console.log('RENDER THREW:', e.message); console.log(e.stack); }

setTimeout(()=>{
  if(threw){ process.exit(1); }
  const html=rootEl.innerHTML;
  console.log('=== RENDER SIZE:', html.length);
  console.log('=== FIRST 400:');
  console.log(html.slice(0,400));
  console.log('=== header:', html.includes('<header'), 'main:', html.includes('<main'), 'footer:', html.includes('<footer'));
  process.exit(0);
}, 3000);
