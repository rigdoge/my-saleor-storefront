if(!self.define){let e,s={};const c=(c,t)=>(c=new URL(c+".js",t).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(t,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let a={};const u=e=>c(e,n),r={module:{uri:n},exports:a,require:u};s[n]=Promise.all(t.map((e=>r[e]||u(e)))).then((e=>(i(...e),a)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"364aaf6701c2a85449f7017b58f887a0"},{url:"/_next/static/chunks/1246-615f717b04d652a8.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/1345-70fd1b0e2d7aa8b4.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/18-7e8d03502da04dd4.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/2807-bf085d72f4867e7e.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/2808-ce8586ae2a20f92f.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/2943-31be0d8e7a828d96.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/3013-627a1d9009523f18.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/3658-70c9fac1f078225a.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/3667-8f1a0ae1afdeff7c.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/3818-6792e88ea77b6ca6.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/3948-09af87478d1ba2c0.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/4284-e68b2d2491877fc0.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/4335-6df19f7e07b5e913.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/4657-0d91d7674970bbd6.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/4694-a504406a16774ff8.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/5172-0c0cebdd26b2df96.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/5523-4f11e9b3e8876425.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/5579-a7570b2b944ab365.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/5600-b39e6158eacb0fcd.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/6164-defcee720e13d3d7.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/703-90b226829365e9de.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/7673-a01361ca729dfb14.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/7715-261f6d6203e256c7.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/80-e19268dd9d25ab87.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/8044-8652fb616b673840.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/8069-b0d6f09a8de4414a.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/8149-378521c200559a8e.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/848-23d1708723e16f7b.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/8850-9b1566ad1f562f7b.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/8939-6fd20dcfa138e0b0.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/_not-found-ac96ada50daf696a.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/about/page-d31d485989940a1e.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/account/favorites/page-ee7c9cc34782faa1.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/account/orders/%5Bid%5D/page-387f9a48c11de38d.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/account/orders/page-b4c6ab0dd5354886.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/account/page-82a2222e3aa54c9e.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/api-menu-demo/page-bb58c15129a583ef.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/categories/%5Bslug%5D/page-e2c28be20a18e4dc.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/categories/page-91341071bd178d25.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/demo/api-introspection/page-1ee3629ae5a978cf.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/demo/api-navigation/page-55037a0564b4281a.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/layout-0461890b8eca0505.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/login/page-dde77ab5164cb498.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/mega-menu-demo/page-d7f7642264346831.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/page-be0ad3472dda845d.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/products/%5Bslug%5D/page-ca6b4f81c6179368.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/products/page-ed369696003a0cdc.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/register/page-150701edcfeb6f02.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/app/search/page-47a31e22ae66afee.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/fc2f6fa8-d7fb56f02f1a5a42.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/fd9d1056-314fb114d841eb7e.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/main-795e3389aac842a0.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/main-app-5c3efc4f758181fb.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/pages/_app-57bdff7978360b1c.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/pages/_error-29037c284dd0eec6.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-11f87a8db93ffad7.js",revision:"uKQ-MXwtR9mZpTN70kcVU"},{url:"/_next/static/css/5ec56f681a1305c6.css",revision:"5ec56f681a1305c6"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/uKQ-MXwtR9mZpTN70kcVU/_buildManifest.js",revision:"2b54d7db375d2b4c0e6af318090bebea"},{url:"/_next/static/uKQ-MXwtR9mZpTN70kcVU/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/favicon.ico",revision:"8a4f32cab805f85cc42de09400a45cf4"},{url:"/icons/icon-128x128.png",revision:"bceedf8d7e40d416c06f604ced717305"},{url:"/icons/icon-144x144.png",revision:"682726f4dc922ab182ce050244b956de"},{url:"/icons/icon-152x152.png",revision:"45b47fe6df8bdf1d03ad93142b66e996"},{url:"/icons/icon-192x192.png",revision:"b5993400a66036180770a88e9e9852ca"},{url:"/icons/icon-384x384.png",revision:"4bfd546382e05928d0c39707d5611397"},{url:"/icons/icon-512x512.png",revision:"76b926a257e7e979a2d5f2f7eb3038cd"},{url:"/icons/icon-72x72.png",revision:"8a4f32cab805f85cc42de09400a45cf4"},{url:"/icons/icon-96x96.png",revision:"043d9ed8380cc28b83457234dd1ffe6c"},{url:"/icons/logo.svg",revision:"fd552ffb9ef173b15a110cb714982156"},{url:"/images/auth-pattern.svg",revision:"4e4cd4c07a1539e615c746f9d1b28ed6"},{url:"/images/empty-cart.svg",revision:"28706329cc60a9555ead8b20ec2fdb9a"},{url:"/images/placeholder.svg",revision:"ed76c9c2e5891eadb58ba60c981f3580"},{url:"/images/product-template1.svg",revision:"cb01d0ea9b22f4bd3e770f2e4ec08d78"},{url:"/images/product-template2.svg",revision:"9c3f1384547291c0cd62819413092ce6"},{url:"/images/product-template3.svg",revision:"17a32cd10f77bfd44960c184cd16fdc2"},{url:"/images/product-template4.svg",revision:"367e710a1feee35b8ba47ae1f537187b"},{url:"/images/product-template5.svg",revision:"b84a92cfc6c234e066ce65c0fc68f76c"},{url:"/images/product-template6.svg",revision:"337372e88d4cb7f69da1b1a43164a03b"},{url:"/manifest.json",revision:"440da1e2c85b4e99f25b71063abebee6"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
