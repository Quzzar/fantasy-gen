if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const c=e=>s(e,o),l={module:{uri:o},exports:t,require:c};i[o]=Promise.all(n.map((e=>l[e]||c(e)))).then((e=>(r(...e),t)))}}define(["./workbox-27b29e6f"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-d45ed4cb.js",revision:null},{url:"assets/index-e3b0c442.css",revision:null},{url:"index.html",revision:"41b433e4f753463e818b96575b07383c"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"apple-icon-180.png",revision:"9e8fa39e47e36726d1f0bebff4ce31b9"},{url:"maskable_icon.png",revision:"7a3c6c9c54b9e304fb2e19f44233988d"},{url:"maskable_icon-512.png",revision:"0580cd549a8c88624e6ba149ceb94f94"},{url:"manifest.webmanifest",revision:"a4b36622126ec8bcf99f9d6faf560ef6"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
