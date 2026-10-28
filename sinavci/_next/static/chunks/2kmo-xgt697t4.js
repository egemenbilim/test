(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,82488,t=>{"use strict";var e=t.i(56866);t.s(["FolderOpen",()=>e.RiFolderOpenFill])},92240,t=>{"use strict";var e=t.i(56866);t.s(["Save",()=>e.RiSaveLine])},80751,t=>{"use strict";var e=t.i(43476),i=t.i(95088);t.s(["AlanEtiketi",0,({alan:t,ad:a,className:r=""})=>{let{ad:n,ikon:s}=(0,i.alanKimligi)(t);return(0,e.jsxs)("span",{"data-alan-etiketi":t,className:`inline-flex min-w-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-bold ${r}`,style:{backgroundColor:"var(--alan-zemin)",borderColor:"var(--alan)",color:"var(--alan-yazi)"},children:[(0,e.jsx)(s,{className:"h-4 w-4 shrink-0",style:{color:"var(--alan)"},"aria-hidden":"true"}),(0,e.jsx)("span",{className:"truncate",children:a??n})]})}])},79382,t=>{"use strict";var e=t.i(71645);let i={},a;function r(t={}){i={animate:!0,allowClose:!0,overlayClickBehavior:"close",overlayOpacity:.7,smoothScroll:!1,disableActiveInteraction:!1,showProgress:!1,stagePadding:10,stageRadius:5,popoverOffset:10,showButtons:["next","previous","close"],disableButtons:[],overlayColor:"#000",...t}}function n(t){return t?i[t]:i}let s={};function o(t){var e;null==(e=s[t])||e.call(s)}function l(t,e,i,a){return(t/=a/2)<1?i/2*t*t+e:-i/2*(--t*(t-2)-1)+e}function d(t){let e='a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';return t.flatMap(t=>{let i=t.matches(e),a=Array.from(t.querySelectorAll(e));return[...i?[t]:[],...a]}).filter(t=>{var e;return"none"!==getComputedStyle(t).pointerEvents&&!!((e=t).offsetWidth||e.offsetHeight||e.getClientRects().length)})}function c(t){let e;if(!t||(e=t.getBoundingClientRect()).top>=0&&e.left>=0&&e.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&e.right<=(window.innerWidth||document.documentElement.clientWidth))return;let i=n("smoothScroll"),a=t.offsetHeight>window.innerHeight;t.scrollIntoView({behavior:!i||function(t){if(!t||!t.parentElement)return;let e=t.parentElement;return e.scrollHeight>e.clientHeight}(t)?"auto":"smooth",inline:"center",block:a?"start":"center"})}let h={};function u(t){return t?h[t]:h}function p(t){if(!t)return;let e=t.getBoundingClientRect(),i={x:e.x,y:e.y,width:e.width,height:e.height};h.__activeStagePosition=i,g(i)}function g(t){let e=u("__overlaySvg");if(!e){var i;let e,a,r,s;return void(i=t,e=window.innerWidth,a=window.innerHeight,(r=document.createElementNS("http://www.w3.org/2000/svg","svg")).classList.add("driver-overlay","driver-overlay-animated"),r.setAttribute("viewBox",`0 0 ${e} ${a}`),r.setAttribute("xmlSpace","preserve"),r.setAttribute("xmlnsXlink","http://www.w3.org/1999/xlink"),r.setAttribute("version","1.1"),r.setAttribute("preserveAspectRatio","xMinYMin slice"),r.style.fillRule="evenodd",r.style.clipRule="evenodd",r.style.strokeLinejoin="round",r.style.strokeMiterlimit="2",r.style.zIndex="10000",r.style.position="fixed",r.style.top="0",r.style.left="0",r.style.width="100%",r.style.height="100%",(s=document.createElementNS("http://www.w3.org/2000/svg","path")).setAttribute("d",k(i)),s.style.fill=n("overlayColor")||"rgb(0,0,0)",s.style.opacity=`${n("overlayOpacity")}`,s.style.pointerEvents="auto",s.style.cursor="auto",r.appendChild(s),document.body.appendChild(r),b(r,t=>{"path"===t.target.tagName&&o("overlayClick")}),h.__overlaySvg=r)}let a=e.firstElementChild;if((null==a?void 0:a.tagName)!=="path")throw Error("no path element found in stage svg");a.setAttribute("d",k(t))}function k(t){let e=window.innerWidth,i=window.innerHeight,a=n("stagePadding")||0,r=n("stageRadius")||0,s=t.width+2*a,o=t.height+2*a,l=Math.floor(Math.max(Math.min(r,s/2,o/2),0)),d=t.x-a+l,c=t.y-a,h=s-2*l,u=o-2*l;return`M${e},0L0,0L0,${i}L${e},${i}L${e},0Z
    M${d},${c} h${h} a${l},${l} 0 0 1 ${l},${l} v${u} a${l},${l} 0 0 1 -${l},${l} h-${h} a${l},${l} 0 0 1 -${l},-${l} v-${u} a${l},${l} 0 0 1 ${l},-${l} z`}function f(t){let{element:e}=t,i="function"==typeof e?e():"string"==typeof e?document.querySelector(e):e;i||(i=function(){let t=document.getElementById("driver-dummy-element");if(t)return t;let e=document.createElement("div");return e.id="driver-dummy-element",e.style.width="0",e.style.height="0",e.style.pointerEvents="none",e.style.opacity="0",e.style.position="fixed",e.style.top="50%",e.style.left="50%",document.body.appendChild(e),e}()),function(t,e){var i;let r,s=Date.now(),o=u("__activeStep"),d=u("__activeElement")||t,k=!d||d===t,f="driver-dummy-element"===t.id,y="driver-dummy-element"===d.id,m=n("animate"),v=e.onHighlightStarted||n("onHighlightStarted"),x=(null==e?void 0:e.onHighlighted)||n("onHighlighted"),b=(null==o?void 0:o.onDeselected)||n("onDeselected"),z=n(),A=u();!k&&b&&b(y?void 0:d,o,{config:z,state:A,driver:a}),v&&v(f?void 0:t,e,{config:z,state:A,driver:a});let S=!k&&m,E=!1;(r=u("popover"))&&(r.wrapper.style.display="none"),h.previousStep=o,h.previousElement=d,h.activeStep=e,h.activeElement=t;let M=()=>{var i;let r,c,k,y,m;if(u("__transitionCallback")!==M)return;let v=Date.now()-s,b=400-v<=200;e.popover&&b&&!E&&S&&(w(t,e),E=!0),n("animate")&&v<400?(c=(r=u("__activeStagePosition"))||d.getBoundingClientRect(),k=t.getBoundingClientRect(),y=l(v,c.x,k.x-c.x,400),m=l(v,c.y,k.y-c.y,400),g(r={x:y,y:m,width:l(v,c.width,k.width-c.width,400),height:l(v,c.height,k.height-c.height,400)}),i=r,h.__activeStagePosition=i):(p(t),x&&x(f?void 0:t,e,{config:n(),state:u(),driver:a}),h.__transitionCallback=void 0,h.__previousStep=o,h.__previousElement=d,h.__activeStep=e,h.__activeElement=t),window.requestAnimationFrame(M)};h.__transitionCallback=M,window.requestAnimationFrame(M),c(t),!S&&e.popover&&w(t,e),d.classList.remove("driver-active-element","driver-no-interaction"),d.removeAttribute("aria-haspopup"),d.removeAttribute("aria-expanded"),d.removeAttribute("aria-controls"),(null!=(i=e.disableActiveInteraction)?i:n("disableActiveInteraction"))&&t.classList.add("driver-no-interaction"),t.classList.add("driver-active-element"),t.setAttribute("aria-haspopup","dialog"),t.setAttribute("aria-expanded","true"),t.setAttribute("aria-controls","driver-popover-content")}(i,t)}function y(){let t=u("__activeElement"),e=u("__activeStep");t&&(p(t),function(){let t=u("__activeStagePosition"),e=u("__overlaySvg");if(!t)return;if(!e)return console.warn("No stage svg found.");let i=window.innerWidth,a=window.innerHeight;e.setAttribute("viewBox",`0 0 ${i} ${a}`)}(),E(t,e))}function m(){var t;let e=u("__resizeTimeout");e&&window.cancelAnimationFrame(e),t=window.requestAnimationFrame(y),h.__resizeTimeout=t}function v(t){var e;if(!u("isInitialized")||"Tab"!==t.key&&9!==t.keyCode)return;let i=u("__activeElement"),a=null==(e=u("popover"))?void 0:e.wrapper,r=d([...a?[a]:[],...i?[i]:[]]),n=r[0],s=r[r.length-1];if(t.preventDefault(),t.shiftKey){let t=r[r.indexOf(document.activeElement)-1]||s;null==t||t.focus()}else{let t=r[r.indexOf(document.activeElement)+1]||n;null==t||t.focus()}}function x(t){var e;(null==(e=n("allowKeyboardControl"))||e)&&("Escape"===t.key?o("escapePress"):"ArrowRight"===t.key?o("arrowRightPress"):"ArrowLeft"===t.key&&o("arrowLeftPress"))}function b(t,e,i){let a=(e,a)=>{let r=e.target;t.contains(r)&&((!i||i(r))&&(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation()),null==a||a(e))};document.addEventListener("pointerdown",a,!0),document.addEventListener("mousedown",a,!0),document.addEventListener("pointerup",a,!0),document.addEventListener("mouseup",a,!0),document.addEventListener("click",t=>{a(t,e)},!0)}function w(t,e){var i,r,s;let l,p,g,k,f,y,m,v,x,w,z=u("popover");z&&document.body.removeChild(z.wrapper),(l=document.createElement("div")).classList.add("driver-popover"),(p=document.createElement("div")).classList.add("driver-popover-arrow"),(g=document.createElement("header")).id="driver-popover-title",g.classList.add("driver-popover-title"),g.style.display="none",g.innerText="Popover Title",(k=document.createElement("div")).id="driver-popover-description",k.classList.add("driver-popover-description"),k.style.display="none",k.innerText="Popover description is here",(f=document.createElement("button")).type="button",f.classList.add("driver-popover-close-btn"),f.setAttribute("aria-label","Close"),f.innerHTML="&times;",(y=document.createElement("footer")).classList.add("driver-popover-footer"),(m=document.createElement("span")).classList.add("driver-popover-progress-text"),m.innerText="",(v=document.createElement("span")).classList.add("driver-popover-navigation-btns"),(x=document.createElement("button")).type="button",x.classList.add("driver-popover-prev-btn"),x.innerHTML="&larr; Previous",(w=document.createElement("button")).type="button",w.classList.add("driver-popover-next-btn"),w.innerHTML="Next &rarr;",v.appendChild(x),v.appendChild(w),y.appendChild(m),y.appendChild(v),l.appendChild(f),l.appendChild(p),l.appendChild(g),l.appendChild(k),l.appendChild(y),z={wrapper:l,arrow:p,title:g,description:k,footer:y,previousButton:x,nextButton:w,closeButton:f,footerButtons:v,progress:m},document.body.appendChild(z.wrapper);let{title:A,description:S,showButtons:M,disableButtons:C,showProgress:P,nextBtnText:L=n("nextBtnText")||"Next &rarr;",prevBtnText:I=n("prevBtnText")||"&larr; Previous",progressText:D=n("progressText")||"{current} of {total}"}=e.popover||{};z.nextButton.innerHTML=L,z.previousButton.innerHTML=I,z.progress.innerHTML=D,A?(z.title.innerHTML=A,z.title.style.display="block"):z.title.style.display="none",S?(z.description.innerHTML=S,z.description.style.display="block"):z.description.style.display="none";let R=M||n("showButtons"),T=P||n("showProgress")||!1,B=(null==R?void 0:R.includes("next"))||(null==R?void 0:R.includes("previous"))||T;z.closeButton.style.display=R.includes("close")?"block":"none",B?(z.footer.style.display="flex",z.progress.style.display=T?"block":"none",z.nextButton.style.display=R.includes("next")?"block":"none",z.previousButton.style.display=R.includes("previous")?"block":"none"):z.footer.style.display="none";let H=C||n("disableButtons")||[];null!=H&&H.includes("next")&&(z.nextButton.disabled=!0,z.nextButton.classList.add("driver-popover-btn-disabled")),null!=H&&H.includes("previous")&&(z.previousButton.disabled=!0,z.previousButton.classList.add("driver-popover-btn-disabled")),null!=H&&H.includes("close")&&(z.closeButton.disabled=!0,z.closeButton.classList.add("driver-popover-btn-disabled"));let K=z.wrapper;K.style.display="block",K.style.left="",K.style.top="",K.style.bottom="",K.style.right="",K.id="driver-popover-content",K.setAttribute("role","dialog"),K.setAttribute("aria-labelledby","driver-popover-title"),K.setAttribute("aria-describedby","driver-popover-description"),z.arrow.className="driver-popover-arrow";let O=(null==(i=e.popover)?void 0:i.popoverClass)||n("popoverClass")||"";K.className=`driver-popover ${O}`.trim(),b(z.wrapper,i=>{var r,s,l;let d=i.target,c=(null==(r=e.popover)?void 0:r.onNextClick)||n("onNextClick"),h=(null==(s=e.popover)?void 0:s.onPrevClick)||n("onPrevClick"),p=(null==(l=e.popover)?void 0:l.onCloseClick)||n("onCloseClick");return d.closest(".driver-popover-next-btn")?c?c(t,e,{config:n(),state:u(),driver:a}):o("nextClick"):d.closest(".driver-popover-prev-btn")?h?h(t,e,{config:n(),state:u(),driver:a}):o("prevClick"):d.closest(".driver-popover-close-btn")?p?p(t,e,{config:n(),state:u(),driver:a}):o("closeClick"):void 0},t=>!(null!=z&&z.description.contains(t))&&!(null!=z&&z.title.contains(t))&&"string"==typeof t.className&&t.className.includes("driver-popover")),s=z,h.popover=s;let F=(null==(r=e.popover)?void 0:r.onPopoverRender)||n("onPopoverRender");F&&F(z,{config:n(),state:u(),driver:a}),E(t,e),c(K);let Y=d([K,...t.classList.contains("driver-dummy-element")?[]:[t]]);Y.length>0&&Y[0].focus()}function z(){let t=u("popover");if(!(null!=t&&t.wrapper))return;let e=t.wrapper.getBoundingClientRect(),i=n("stagePadding")||0,a=n("popoverOffset")||0;return{width:e.width+i+a,height:e.height+i+a,realWidth:e.width,realHeight:e.height}}function A(t,e){let{elementDimensions:i,popoverDimensions:a,popoverPadding:r,popoverArrowDimensions:n}=e;return"start"===t?Math.max(Math.min(i.top-r,window.innerHeight-a.realHeight-n.width),n.width):"end"===t?Math.max(Math.min(i.top-(null==a?void 0:a.realHeight)+i.height+r,window.innerHeight-(null==a?void 0:a.realHeight)-n.width),n.width):"center"===t?Math.max(Math.min(i.top+i.height/2-(null==a?void 0:a.realHeight)/2,window.innerHeight-(null==a?void 0:a.realHeight)-n.width),n.width):0}function S(t,e){let{elementDimensions:i,popoverDimensions:a,popoverPadding:r,popoverArrowDimensions:n}=e;return"start"===t?Math.max(Math.min(i.left-r,window.innerWidth-a.realWidth-n.width),n.width):"end"===t?Math.max(Math.min(i.left-(null==a?void 0:a.realWidth)+i.width+r,window.innerWidth-(null==a?void 0:a.realWidth)-n.width),n.width):"center"===t?Math.max(Math.min(i.left+i.width/2-(null==a?void 0:a.realWidth)/2,window.innerWidth-(null==a?void 0:a.realWidth)-n.width),n.width):0}function E(t,e){let i=u("popover");if(!i)return;let{align:a="start",side:r="left"}=(null==e?void 0:e.popover)||{},s="driver-dummy-element"===t.id?"over":r,o=n("stagePadding")||0,l=z(),d=i.arrow.getBoundingClientRect(),c=t.getBoundingClientRect(),h=c.top-l.height,p=h>=0,g=window.innerHeight-(c.bottom+l.height),k=g>=0,f=c.left-l.width,y=f>=0,m=window.innerWidth-(c.right+l.width),v=m>=0,x=!p&&!k&&!y&&!v,b=s;if("top"===s&&p?v=y=k=!1:"bottom"===s&&k?v=y=p=!1:"left"===s&&y?v=p=k=!1:"right"===s&&v&&(y=p=k=!1),"over"===s){let t=window.innerWidth/2-l.realWidth/2,e=window.innerHeight/2-l.realHeight/2;i.wrapper.style.left=`${t}px`,i.wrapper.style.right="auto",i.wrapper.style.top=`${e}px`,i.wrapper.style.bottom="auto"}else if(x){let t=window.innerWidth/2-(null==l?void 0:l.realWidth)/2;i.wrapper.style.left=`${t}px`,i.wrapper.style.right="auto",i.wrapper.style.bottom="10px",i.wrapper.style.top="auto"}else if(y){let t=Math.min(f,window.innerWidth-(null==l?void 0:l.realWidth)-d.width),e=A(a,{elementDimensions:c,popoverDimensions:l,popoverPadding:o,popoverArrowDimensions:d});i.wrapper.style.left=`${t}px`,i.wrapper.style.top=`${e}px`,i.wrapper.style.bottom="auto",i.wrapper.style.right="auto",b="left"}else if(v){let t=Math.min(m,window.innerWidth-(null==l?void 0:l.realWidth)-d.width),e=A(a,{elementDimensions:c,popoverDimensions:l,popoverPadding:o,popoverArrowDimensions:d});i.wrapper.style.right=`${t}px`,i.wrapper.style.top=`${e}px`,i.wrapper.style.bottom="auto",i.wrapper.style.left="auto",b="right"}else if(p){let t=Math.min(h,window.innerHeight-l.realHeight-d.width),e=S(a,{elementDimensions:c,popoverDimensions:l,popoverPadding:o,popoverArrowDimensions:d});i.wrapper.style.top=`${t}px`,i.wrapper.style.left=`${e}px`,i.wrapper.style.bottom="auto",i.wrapper.style.right="auto",b="top"}else if(k){let t=Math.min(g,window.innerHeight-(null==l?void 0:l.realHeight)-d.width),e=S(a,{elementDimensions:c,popoverDimensions:l,popoverPadding:o,popoverArrowDimensions:d});i.wrapper.style.left=`${e}px`,i.wrapper.style.bottom=`${t}px`,i.wrapper.style.top="auto",i.wrapper.style.right="auto",b="bottom"}x?i.arrow.classList.add("driver-popover-arrow-none"):function(t,e,i){let a=u("popover");if(!a)return;let r=i.getBoundingClientRect(),s=z(),o=a.arrow,l=s.width,d=window.innerWidth,c=r.width,h=r.left,p=s.height,g=window.innerHeight,k=r.top,f=r.height;o.className="driver-popover-arrow";let y=e,m=t;if("top"===e?(h+c<=0?(y="right",m="end"):h+c-l<=0&&(y="top",m="start"),h>=d?(y="left",m="end"):h+l>=d&&(y="top",m="end")):"bottom"===e?(h+c<=0?(y="right",m="start"):h+c-l<=0&&(y="bottom",m="start"),h>=d?(y="left",m="start"):h+l>=d&&(y="bottom",m="end")):"left"===e?(k+f<=0?(y="bottom",m="end"):k+f-p<=0&&(y="left",m="start"),k>=g?(y="top",m="end"):k+p>=g&&(y="left",m="end")):"right"===e&&(k+f<=0?(y="bottom",m="start"):k+f-p<=0&&(y="right",m="start"),k>=g?(y="top",m="start"):k+p>=g&&(y="right",m="end")),y){o.classList.add(`driver-popover-arrow-side-${y}`),o.classList.add(`driver-popover-arrow-align-${m}`);let t=i.getBoundingClientRect(),r=o.getBoundingClientRect(),s=n("stagePadding")||0,l=t.left-s<window.innerWidth&&t.right+s>0&&t.top-s<window.innerHeight&&t.bottom+s>0;"bottom"===e&&l&&(r.x>t.x&&r.x+r.width<t.x+t.width?a.wrapper.style.transform="translateY(0)":(o.classList.remove(`driver-popover-arrow-align-${m}`),o.classList.add("driver-popover-arrow-none"),a.wrapper.style.transform=`translateY(-${s/2}px)`))}else o.classList.add("driver-popover-arrow-none")}(a,b,t)}let M=t=>`foyevi.tur.${t}`,C={sinav:[{element:'[data-tur="havuz-sekmesi"]',popover:{title:"Sorularınız burada",description:"PDF’ten kırptığınız ve kendi yazdığınız sorular. Seçip kâğıda ekleyin."}},{element:'[data-ayar-bolumu="once-bunlar"]',popover:{title:"Önce bunlar",description:"Başlık, sınıf, ders ve sütun sayısı. Değişiklik kâğıtta anında görünür."}},{element:'button[title="Belgeyi dosyaya kaydet"]',popover:{title:"Kaydet",description:"Belgeyi bilgisayarınıza dosya olarak saklar; sonra Menü’den açarsınız."}},{element:"[data-indir-menu]",popover:{title:"İndir",description:"PDF, Word ya da görsel olarak indirin. Yazdır da hemen yanında."}},{element:"[data-editor-menu]",popover:{title:"Menü",description:"Yeni belge, kayıtlı belge, Marka Kimliğim ve görünüm burada. Bu turu da buradan yeniden açabilirsiniz."}}],foy:[{element:"[data-blok-ekle-liste]",popover:{title:"Blok ekleyin",description:"Anlatım, örnek, “Sıra Sizde” ve görsel blokları föye buradan eklenir."}},{element:'button[title^="PDF\'ten kırp"]',popover:{title:"PDF’ten kırp",description:"Kitaptan soru ya da şekil kırpıp föyün sonuna ekler."}},{element:'button[title="Belgeyi dosyaya kaydet"]',popover:{title:"Kaydet",description:"Föyü bilgisayarınıza dosya olarak saklar."}},{element:"[data-indir-menu]",popover:{title:"İndir",description:"PDF, Word ya da görsel olarak indirin."}},{element:"[data-editor-menu]",popover:{title:"Menü",description:"Yeni belge, kayıtlı belge, Marka Kimliğim ve görünüm burada."}}],havuz:[{element:"[data-kaynak-yukle]",popover:{title:"Dosya yükleyin",description:"PDF, kitap sayfası fotoğrafı ya da ekran görüntüsü. Dosya tarayıcınızda kalır, sunucuya gitmez."}},{element:'[data-havuz-paneli="dar"]',popover:{title:"Soru havuzu",description:"Kırptığınız sorular burada birikir. “Bütün sorularım” ile tamamını süzüp seçersiniz."}},{element:"[data-olustur]",popover:{title:"Oluştur",description:"Havuzdaki sorulardan test, yazılı, deneme, föy ya da akıllı tahta oluşturun."}}]};function P(t){let e=C[t].filter(t=>document.querySelector(t.element));0===e.length||(function(t={}){function e(){n("allowClose")&&k()}function i(){let t=n("overlayClickBehavior");n("allowClose")&&"close"===t?k():"nextStep"===t&&o()}function o(){let t=u("activeIndex"),e=n("steps")||[];if(void 0===t)return;let i=t+1;e[i]?g(i):k()}function l(){let t=u("activeIndex"),e=n("steps")||[];if(void 0===t)return;let i=t-1;e[i]?g(i):k()}function d(){var t;if(u("__transitionCallback"))return;let e=u("activeIndex"),i=u("__activeStep"),r=u("__activeElement");if(void 0===e||void 0===i||void 0===u("activeIndex"))return;let s=(null==(t=i.popover)?void 0:t.onPrevClick)||n("onPrevClick");if(s)return s(r,i,{config:n(),state:u(),driver:a});l()}function c(){var t;if(u("__transitionCallback"))return;let e=u("activeIndex"),i=u("__activeStep"),r=u("__activeElement");if(void 0===e||void 0===i)return;let s=(null==(t=i.popover)?void 0:t.onNextClick)||n("onNextClick");if(s)return s(r,i,{config:n(),state:u(),driver:a});o()}function p(){u("isInitialized")||(h.isInitialized=!0,document.body.classList.add("driver-active",n("animate")?"driver-fade":"driver-simple"),window.addEventListener("keyup",x,!1),window.addEventListener("keydown",v,!1),window.addEventListener("resize",m),window.addEventListener("scroll",m),s.overlayClick=i,s.escapePress=e,s.arrowLeftPress=d,s.arrowRightPress=c)}function g(t=0){var e,i,a,r,s,o,l,d,c;let u=n("steps");if(!u){console.error("No steps to drive through"),k();return}if(!u[t])return void k();c=document.activeElement,h.__activeOnDestroyed=c,h.activeIndex=t;let p=u[t],y=u[t+1],m=u[t-1],v=(null==(e=p.popover)?void 0:e.doneBtnText)||n("doneBtnText")||"Done",x=n("allowClose"),b=void 0!==(null==(i=p.popover)?void 0:i.showProgress)?null==(a=p.popover)?void 0:a.showProgress:n("showProgress"),w=((null==(r=p.popover)?void 0:r.progressText)||n("progressText")||"{{current}} of {{total}}").replace("{{current}}",`${t+1}`).replace("{{total}}",`${u.length}`),z=(null==(s=p.popover)?void 0:s.showButtons)||n("showButtons"),A=["next","previous",...x?["close"]:[]].filter(t=>!(null!=z&&z.length)||z.includes(t)),S=(null==(o=p.popover)?void 0:o.onNextClick)||n("onNextClick"),E=(null==(l=p.popover)?void 0:l.onPrevClick)||n("onPrevClick"),M=(null==(d=p.popover)?void 0:d.onCloseClick)||n("onCloseClick");f({...p,popover:{showButtons:A,nextBtnText:y?void 0:v,disableButtons:[...m?[]:["previous"]],showProgress:b,progressText:w,onNextClick:S||(()=>{y?g(t+1):k()}),onPrevClick:E||(()=>{g(t-1)}),onCloseClick:M||(()=>{k()}),...(null==p?void 0:p.popover)||{}}})}function k(t=!0){var e,i;let r,o,l=u("__activeElement"),d=u("__activeStep"),c=u("__activeOnDestroyed"),p=n("onDestroyStarted");if(t&&p)return void p(l&&(null==l?void 0:l.id)!=="driver-dummy-element"?l:void 0,d,{config:n(),state:u(),driver:a});let g=(null==d?void 0:d.onDeselected)||n("onDeselected"),f=n("onDestroyed");if(document.body.classList.remove("driver-active","driver-fade","driver-simple"),window.removeEventListener("keyup",x),window.removeEventListener("resize",m),window.removeEventListener("scroll",m),(r=u("popover"))&&(null==(e=r.wrapper.parentElement)||e.removeChild(r.wrapper)),null==(i=document.getElementById("driver-dummy-element"))||i.remove(),document.querySelectorAll(".driver-active-element").forEach(t=>{t.classList.remove("driver-active-element","driver-no-interaction"),t.removeAttribute("aria-haspopup"),t.removeAttribute("aria-expanded"),t.removeAttribute("aria-controls")}),(o=u("__overlaySvg"))&&o.remove(),s={},h={},l&&d){let t="driver-dummy-element"===l.id;g&&g(t?void 0:l,d,{config:n(),state:u(),driver:a}),f&&f(t?void 0:l,d,{config:n(),state:u(),driver:a})}c&&c.focus()}r(t);let y={isActive:()=>u("isInitialized")||!1,refresh:m,drive:(t=0)=>{p(),g(t)},setConfig:r,setSteps:t=>{h={},r({...n(),steps:t})},getConfig:n,getState:u,getActiveIndex:()=>u("activeIndex"),isFirstStep:()=>0===u("activeIndex"),isLastStep:()=>{let t=n("steps")||[],e=u("activeIndex");return void 0!==e&&e===t.length-1},getActiveStep:()=>u("activeStep"),getActiveElement:()=>u("activeElement"),getPreviousElement:()=>u("previousElement"),getPreviousStep:()=>u("previousStep"),moveNext:o,movePrevious:l,moveTo:function(t){(n("steps")||[])[t]?g(t):k()},hasNextStep:()=>{let t=n("steps")||[],e=u("activeIndex");return void 0!==e&&!!t[e+1]},hasPreviousStep:()=>{let t=n("steps")||[],e=u("activeIndex");return void 0!==e&&!!t[e-1]},highlight:t=>{p(),f({...t,popover:t.popover?{showButtons:[],showProgress:!1,progressText:"",...t.popover}:void 0})},destroy:()=>{k(!1)}};return a=y,y})({showProgress:!0,progressText:"{{current}} / {{total}}",nextBtnText:"Sonraki",prevBtnText:"Geri",doneBtnText:"Tamam",popoverClass:"foyevi-tur",overlayOpacity:.6,stagePadding:6,stageRadius:10,allowClose:!0,steps:e,onDestroyed:()=>{try{localStorage.setItem(M(t),"1")}catch{}}}).drive()}t.s(["KisaTur",0,({alan:t,hazir:i=!0})=>((0,e.useEffect)(()=>{if(!i)return;let e=()=>P(t);window.addEventListener("foyevi:tur",e);let a=!0;try{a="1"===localStorage.getItem("foyevi-tur-gosterildi")||"1"===localStorage.getItem(M(t))}catch{a=!0}navigator.webdriver&&(a=!0);let r=window.matchMedia("(min-width: 1024px)").matches,n=!a&&r?setTimeout(()=>P(t),1500):null;return()=>{window.removeEventListener("foyevi:tur",e),n&&clearTimeout(n)}},[t,i]),null),"turuAc",0,()=>window.dispatchEvent(new Event("foyevi:tur"))],79382)},11605,t=>{"use strict";let e='stroke="currentColor" stroke-width="2.4" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"',i='stroke="currentColor" stroke-width="1.3" vector-effect="non-scaling-stroke" stroke-linecap="round"',a='stroke="currentColor" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-dasharray="5 4"',r='fill="currentColor" fill-opacity=".1"',n='fill="none"',s=(t,i=!0)=>`<polygon points="${(t=>{let e=[];for(let i=0;i<t.length;i+=2)e.push(t[i]+","+t[i+1]);return e.join(" ")})(t)}" ${i?r:n} ${e}/>`,o=(t,i,a,r,n=e)=>`<line x1="${t}" y1="${i}" x2="${a}" y2="${r}" ${n}/>`,l=(t,i=`${n} ${e}`)=>`<path d="${t}" ${i}/>`,d=(t,e,i=2.6)=>`<circle cx="${t}" cy="${e}" r="${i}" fill="currentColor"/>`,c=(t,i,a,r=9)=>{let s=a*Math.PI/180,o=e=>[+(t-r*Math.cos(s+e)).toFixed(2),+(i-r*Math.sin(s+e)).toFixed(2)],[l,d]=o(.45),[c,h]=o(-.45);return`<polyline points="${l},${d} ${t},${i} ${c},${h}" ${n} ${e}/>`},h=(t,e,a,r,s=9)=>l(`M${t+a*s} ${e} L${t+a*s} ${e+r*s} L${t} ${e+r*s}`,`${n} ${i}`),u=(t,e=50,i=52,a=44,r=-90)=>{let n=[];for(let s=0;s<t;s++){let o=(r+360/t*s)*Math.PI/180;n.push(+(e+a*Math.cos(o)).toFixed(2),+(i+a*Math.sin(o)).toFixed(2))}return n},p=(t,e,a,r,s)=>{let o=i=>[t+a*Math.cos(i*Math.PI/180),e-a*Math.sin(i*Math.PI/180)],[d,c]=o(r),[h,u]=o(s),p=+(Math.abs(s-r)>180);return l(`M${d.toFixed(2)} ${c.toFixed(2)} A${a} ${a} 0 ${p} 0 ${h.toFixed(2)} ${u.toFixed(2)}`,`${n} ${i}`)},g=(t,e,i,a=9,r="")=>`<text x="${t}" y="${e}" font-size="${a}" text-anchor="middle" fill="currentColor" font-family="Segoe UI,DejaVu Sans,sans-serif" ${r}>${i}</text>`,k=[],f=(t,e,i,a,r,n,s=!1)=>k.push({k:e,ad:i,kat:t,en:a,boy:r,svg:n,sabit:s});{let t="Üçgenler";f(t,"ucgen-eskenar","Eşkenar üçgen",100,90,s([50,6,94,84,6,84])),f(t,"ucgen-ikizkenar","İkizkenar üçgen",100,100,s([50,5,80,94,20,94])),f(t,"ucgen-dik","Dik üçgen",100,100,s([12,8,12,92,90,92])+h(12,92,1,-1,10)),f(t,"ucgen-cesitkenar","Çeşitkenar üçgen",110,90,s([30,8,104,82,6,70])),f(t,"ucgen-genis","Geniş açılı üçgen",130,70,s([6,62,124,62,34,10])),f(t,"ucgen-yukseklik","Yüksekliği çizilmiş üçgen",100,90,s([50,6,94,84,6,84])+o(50,6,50,84,a)+h(50,84,1,-1,8))}{let t="Dörtgenler";f(t,"kare","Kare",100,100,`<rect x="8" y="8" width="84" height="84" ${r} ${e}/>`),f(t,"dikdortgen","Dikdörtgen",160,100,`<rect x="8" y="12" width="144" height="76" ${r} ${e}/>`),f(t,"paralelkenar","Paralelkenar",160,100,s([44,14,154,14,116,86,6,86])),f(t,"eskenar-dortgen","Eşkenar dörtgen",100,110,s([50,5,94,55,50,105,6,55])),f(t,"yamuk","Yamuk",160,100,s([46,14,114,14,154,86,6,86])),f(t,"dik-yamuk","Dik yamuk",160,100,s([12,14,104,14,152,86,12,86])+h(12,86,1,-1,9)),f(t,"deltoid","Deltoid",100,120,s([50,5,88,42,50,115,12,42]))}{let t="Çokgen ve daire";f(t,"besgen","Düzgün beşgen",100,100,s(u(5,50,54,46))),f(t,"altigen","Düzgün altıgen",100,100,s(u(6,50,50,46,0))),f(t,"sekizgen","Düzgün sekizgen",100,100,s(u(8,50,50,46,22.5))),f(t,"daire","Daire",100,100,`<circle cx="50" cy="50" r="44" ${r} ${e}/>`),f(t,"cember","Çember ve merkez",100,100,`<circle cx="50" cy="50" r="44" ${n} ${e}/>`+d(50,50)),f(t,"cember-yaricap","Yarıçap",100,100,`<circle cx="50" cy="50" r="44" ${n} ${e}/>`+d(50,50)+o(50,50,94,50)+g(72,45,"r",11,'font-style="italic"')),f(t,"cember-cap","Çap",100,100,`<circle cx="50" cy="50" r="44" ${n} ${e}/>`+d(50,50)+o(6,50,94,50)+d(6,50)+d(94,50)),f(t,"yarim-daire","Yarım daire",100,54,l("M6 50 A44 44 0 0 1 94 50 Z",`${r} ${e}`)),f(t,"daire-dilimi","Daire dilimi",100,100,l("M50 50 L94 50 A44 44 0 0 0 72 11.9 Z",`${r} ${e}`)+`<circle cx="50" cy="50" r="44" ${n} ${a}/>`),f(t,"elips","Elips",150,90,`<ellipse cx="75" cy="45" rx="68" ry="38" ${r} ${e}/>`),f(t,"halka","Halka",100,100,l("M50 6a44 44 0 1 0 0.01 0Z M50 28a22 22 0 1 1 -0.01 0Z",`fill="currentColor" fill-opacity=".1" fill-rule="evenodd" ${e}`))}{let t="Uzay cisimleri";f(t,"kup","Küp",110,110,l("M8 30 H78 V100 H8 Z M8 30 L36 8 H106 L78 30 M106 8 V78 L78 100")+l("M8 100 L36 78 H106 M36 78 V8",`${n} ${a}`)),f(t,"prizma","Dikdörtgenler prizması",150,100,l("M6 34 H112 V94 H6 Z M6 34 L38 8 H144 L112 34 M144 8 V68 L112 94")+l("M6 94 L38 68 H144 M38 68 V8",`${n} ${a}`)),f(t,"ucgen-prizma","Üçgen prizma",140,100,l("M8 92 H96 L52 50 Z M8 92 L44 70 M96 92 L132 70 L88 28 L52 50 M88 28 L52 50")+l("M44 70 H132 M44 70 L88 28",`${n} ${a}`)),f(t,"silindir","Silindir",100,120,`<ellipse cx="50" cy="18" rx="42" ry="12" ${n} ${e}/>`+l("M8 18 V102 M92 18 V102 M8 102 A42 12 0 0 0 92 102")+l("M8 102 A42 12 0 0 1 92 102",`${n} ${a}`)),f(t,"koni","Koni",100,120,l("M50 6 L8 102 M50 6 L92 102 M8 102 A42 12 0 0 0 92 102")+l("M8 102 A42 12 0 0 1 92 102",`${n} ${a}`)+o(50,6,50,102,a)),f(t,"kure","Küre",100,100,`<circle cx="50" cy="50" r="44" ${r} ${e}/>`+l("M6 50 A44 13 0 0 0 94 50")+l("M6 50 A44 13 0 0 1 94 50",`${n} ${a}`)+d(50,50,2)),f(t,"piramit","Kare piramit",120,110,l("M60 6 L8 96 H86 L112 76 L60 6 M60 6 L86 96")+l("M8 96 L34 76 H112 M34 76 L60 6",`${n} ${a}`)),f(t,"ucgen-piramit","Üçgen piramit",110,100,l("M55 6 L8 92 L72 96 Z M55 6 L102 70 L72 96")+l("M8 92 L102 70",`${n} ${a}`))}{let t="Doğru ve açı";f(t,"dogru","Doğru",200,40,o(10,20,190,20)+c(10,20,180)+c(190,20,0)+d(60,20)+d(140,20)),f(t,"isin","Işın",200,40,o(12,20,190,20)+c(190,20,0)+d(12,20,3.2)),f(t,"dogru-parcasi","Doğru parçası",200,40,o(14,20,186,20)+d(14,20,3.2)+d(186,20,3.2)),f(t,"paralel","Paralel doğrular",200,80,o(10,22,190,22)+c(10,22,180)+c(190,22,0)+o(10,60,190,60)+c(10,60,180)+c(190,60,0)),f(t,"dik-dogrular","Dik kesişen doğrular",120,120,o(8,60,112,60)+o(60,8,60,112)+h(60,60,1,-1,11)),f(t,"kesisen","Kesişen doğrular",120,100,o(8,90,112,10)+o(8,20,112,80)+d(60,50)),f(t,"aci-dar","Dar açı",120,90,l("M110 80 L10 80 L84 14")+p(10,80,26,0,41.7)),f(t,"aci-dik","Dik açı",100,100,l("M92 90 L10 90 L10 8")+h(10,90,1,-1,14)),f(t,"aci-genis","Geniş açı",140,80,l("M132 72 L66 72 L14 14")+p(66,72,22,0,131.8)),f(t,"aci-dogru","Doğru açı",160,60,o(8,46,152,46)+d(80,46)+p(80,46,20,0,180))}{let t="Sayı doğrusu",e=(t,e,i,a=30,r=8)=>{let n="";for(let s=0;s<=i;s++){let l=+(t+(e-t)*s/i).toFixed(2);n+=o(l,a-r,l,a+r)}return n};f(t,"sayi-iki-centikli","İki yönü açık (çentikli)",400,60,o(10,30,390,30)+c(10,30,180,11)+c(390,30,0,11)+e(40,360,10)),f(t,"sayi-iki-duz","İki yönü açık (düz)",400,60,o(10,30,390,30)+c(10,30,180,11)+c(390,30,0,11)),f(t,"sayi-tek-centikli","Tek yönü açık (çentikli)",400,60,o(20,30,390,30)+c(390,30,0,11)+e(20,340,10)+d(20,30,3.2)),f(t,"sayi-tek-duz","Tek yönü açık (düz)",400,60,o(20,30,390,30)+c(390,30,0,11)+d(20,30,3.2)),f(t,"sayi-sik","Sık çentikli (20 aralık)",400,60,o(10,30,390,30)+c(10,30,180,11)+c(390,30,0,11)+e(30,370,20,30,6));{let a="";for(let t=0;t<=10;t++){let e=40+32*t;a+=`<rect x="${e-11}" y="44" width="22" height="18" rx="2" ${n} ${i}/>`}f(t,"sayi-kutulu","Kutucuklu (yazmak için)",400,70,o(10,24,390,24)+c(10,24,180,11)+c(390,24,0,11)+e(40,360,10,24,7)+a)}f(t,"sayi-dikey","Dikey sayı doğrusu",60,300,o(30,290,30,10)+c(30,10,-90,11)+c(30,290,90,11)+(()=>{let t="";for(let e=0;e<=10;e++)t+=o(22,30+24*e,38,30+24*e);return t})())}{let t="Grafik ve tablo",a=(t,e,i,a,r,n='stroke="currentColor" stroke-opacity=".35" stroke-width="1" vector-effect="non-scaling-stroke"')=>{let s="";for(let o=0;o<=i;o++)s+=`<line x1="${t+r*o}" y1="${e}" x2="${t+r*o}" y2="${e+r*a}" ${n}/>`;for(let o=0;o<=a;o++)s+=`<line x1="${t}" y1="${e+r*o}" x2="${t+r*i}" y2="${e+r*o}" ${n}/>`;return s};f(t,"koordinat","Koordinat düzlemi",200,200,a(10,10,18,18,10)+o(4,100,196,100)+o(100,196,100,4)+c(196,100,0,8)+c(100,4,-90,8)+c(4,100,180,8)+c(100,196,90,8)+g(190,92,"x",10,'font-style="italic"')+g(108,12,"y",10,'font-style="italic"')),f(t,"koordinat-1","Birinci bölge",200,200,a(20,10,17,17,10)+o(20,180,196,180)+o(20,180,20,4)+c(196,180,0,8)+c(20,4,-90,8)+g(190,194,"x",10,'font-style="italic"')+g(10,12,"y",10,'font-style="italic"')),f(t,"kareli","Kareli alan",200,140,a(10,10,18,12,10));{let e="";for(let t=0;t<=9;t++)for(let i=0;i<=6;i++)e+=`<circle cx="${10+20*t}" cy="${10+20*i}" r="2" fill="currentColor"/>`;f(t,"noktali","Noktalı kâğıt (geometri tahtası)",200,140,e)}{let a=(t,a,r=200,s=140)=>{let l=(r-8)/t,d=(s-8)/a,c=`<rect x="4" y="4" width="${r-8}" height="${s-8}" ${n} ${e}/><rect x="4" y="4" width="${r-8}" height="${d}" fill="currentColor" fill-opacity=".1"/>`;for(let e=1;e<t;e++)c+=o(4+l*e,4,4+l*e,s-4,i);for(let t=1;t<a;t++)c+=o(4,4+d*t,r-4,4+d*t,i);return c};f(t,"tablo-2x4","Tablo (2 sütun)",200,140,a(2,5)),f(t,"tablo-3x4","Tablo (3 sütun)",200,140,a(3,5)),f(t,"tablo-5x3","Tablo (5 sütun)",240,110,a(5,3,240,110))}f(t,"sutun-grafik","Sütun grafiği ekseni",200,150,o(20,135,194,135)+o(20,135,20,6)+c(194,135,0,8)+c(20,6,-90,8)+a(20,15,17,12,10,'stroke="currentColor" stroke-opacity=".18" stroke-width="1" vector-effect="non-scaling-stroke"')),f(t,"venn-2","Venn şeması (2 küme)",200,130,`<rect x="4" y="4" width="192" height="122" rx="6" ${n} ${i}/><circle cx="78" cy="66" r="48" ${r} ${e}/><circle cx="122" cy="66" r="48" ${r} ${e}/>`+g(14,20,"E",11)),f(t,"venn-3","Venn şeması (3 küme)",200,180,`<rect x="4" y="4" width="192" height="172" rx="6" ${n} ${i}/><circle cx="76" cy="70" r="48" ${r} ${e}/><circle cx="124" cy="70" r="48" ${r} ${e}/><circle cx="100" cy="112" r="48" ${r} ${e}/>`+g(14,20,"E",11)),f(t,"agac","Ağaç şeması",200,130,o(100,18,50,66)+o(100,18,150,66)+o(50,66,24,112)+o(50,66,76,112)+o(150,66,124,112)+o(150,66,176,112)+[[100,18],[50,66],[150,66],[24,112],[76,112],[124,112],[176,112]].map(([t,i])=>`<circle cx="${t}" cy="${i}" r="9" fill="#fff" ${e}/>`).join(""))}{let t="Kesir ve sayı",a=t=>{let i=`<circle cx="50" cy="50" r="44" ${n} ${e}/>`;for(let e=0;e<t;e++){let a=(-90+360/t*e)*Math.PI/180;i+=o(50,50,+(50+44*Math.cos(a)).toFixed(2),+(50+44*Math.sin(a)).toFixed(2))}return i};for(let e of[2,3,4,5,6,8,10])f(t,"daire-"+e,`Daire (${e} eş par\xe7a)`,100,100,a(e));let r=t=>{let i=`<rect x="4" y="8" width="232" height="34" ${n} ${e}/>`;for(let e=1;e<t;e++)i+=o(+(4+232*e/t).toFixed(2),8,+(4+232*e/t).toFixed(2),42);return i};for(let e of[2,3,4,5,6,8,10])f(t,"serit-"+e,`Şerit (${e} eş par\xe7a)`,240,50,r(e));let s='fill="#93c5fd" stroke="#1e40af" stroke-width="1.2" vector-effect="non-scaling-stroke"';f(t,"birlik","Birlik küp",40,40,`<rect x="5" y="5" width="30" height="30" ${s}/>`,!0);{let e="";for(let t=0;t<10;t++)e+=`<rect x="5" y="${5+20*t}" width="20" height="20" ${s}/>`;f(t,"onluk","Onluk çubuk",30,210,e,!0)}{let e="";for(let t=0;t<10;t++)for(let i=0;i<10;i++)e+=`<rect x="${5+20*t}" y="${5+20*i}" width="20" height="20" ${s}/>`;f(t,"yuzluk","Yüzlük kare",210,210,e,!0)}{let i=`<rect x="4" y="4" width="232" height="92" ${n} ${e}/>`+o(4,50,236,50);for(let t=1;t<5;t++)i+=o(4+46.4*t,4,4+46.4*t,96);f(t,"onluk-cerceve","Onluk çerçeve",240,100,i)}{let a=`<rect x="6" y="6" width="228" height="128" rx="8" ${n} ${e}/>`;for(let t=0;t<5;t++)a+=o(30+45*t,14,30+45*t,126,i);f(t,"abakus","Abaküs",240,140,a+=o(6,46,234,46))}{let a=`<circle cx="60" cy="60" r="54" fill="#fff" ${e}/>`;for(let t=0;t<60;t++){let r=6*t*Math.PI/180,n=t%5==0?44:49;a+=o(+(60+n*Math.sin(r)).toFixed(2),+(60-n*Math.cos(r)).toFixed(2),+(60+53*Math.sin(r)).toFixed(2),+(60-53*Math.cos(r)).toFixed(2),t%5==0?e:i)}for(let t=1;t<=12;t++){let e=30*t*Math.PI/180;a+=g(+(60+35*Math.sin(e)).toFixed(2),+(64-35*Math.cos(e)).toFixed(2),String(t),11)}f(t,"saat","Saat (akrep ve yelkovansız)",120,120,a+=d(60,60,3))}}{let t="Ölçme araçları";{let e='<rect x="2" y="2" width="316" height="56" rx="4" fill="#fef3c7" fill-opacity=".85" stroke="#92400e" stroke-width="1.4" vector-effect="non-scaling-stroke"/>';for(let t=0;t<=150;t++){let i=10+2*t,a=t%10==0?18:t%5==0?12:7;e+=`<line x1="${i}" y1="2" x2="${i}" y2="${2+a}" stroke="#78350f" stroke-width="${t%10==0?1.2:.7}" vector-effect="non-scaling-stroke"/>`,t%10==0&&(e+=`<text x="${i}" y="34" font-size="9" text-anchor="middle" fill="#78350f" font-family="Segoe UI,DejaVu Sans,sans-serif">${t/10}</text>`)}f(t,"cetvel","Cetvel (15 cm)",320,60,e+='<text x="300" y="52" font-size="7" text-anchor="end" fill="#78350f" font-family="Segoe UI,DejaVu Sans,sans-serif">cm</text>',!0)}{let e='<path d="M6 116 A114 114 0 0 1 234 116 Z" fill="#dbeafe" fill-opacity=".8" stroke="#1e3a8a" stroke-width="1.4" vector-effect="non-scaling-stroke"/>';for(let t=0;t<=180;t++){let i=t*Math.PI/180,a=112-(t%10==0?14:t%5==0?9:5);e+=`<line x1="${(120-112*Math.cos(i)).toFixed(2)}" y1="${(116-112*Math.sin(i)).toFixed(2)}" x2="${(120-a*Math.cos(i)).toFixed(2)}" y2="${(116-a*Math.sin(i)).toFixed(2)}" stroke="#1e3a8a" stroke-width="${t%10==0?1.1:.6}" vector-effect="non-scaling-stroke"/>`,t%10==0&&(e+=`<text x="${(120-90*Math.cos(i)).toFixed(2)}" y="${(119-90*Math.sin(i)).toFixed(2)}" font-size="7.5" text-anchor="middle" fill="#1e3a8a" font-family="Segoe UI,DejaVu Sans,sans-serif">${t}</text>`)}f(t,"iletki","İletki (açıölçer)",240,122,e+='<line x1="6" y1="116" x2="234" y2="116" stroke="#1e3a8a" stroke-width="1.2" vector-effect="non-scaling-stroke"/><circle cx="120" cy="116" r="3" fill="#1e3a8a"/>',!0)}f(t,"gonye","Gönye",160,160,'<path d="M6 6 V154 H154 Z M28 60 V132 H100 Z" fill="#dcfce7" fill-opacity=".85" fill-rule="evenodd" stroke="#166534" stroke-width="1.4" vector-effect="non-scaling-stroke"/>',!0);{let a=`<rect x="40" y="6" width="20" height="150" rx="10" fill="#fff" ${e}/><circle cx="50" cy="168" r="16" fill="#ef4444" fill-opacity=".85" ${e}/><rect x="46" y="70" width="8" height="90" fill="#ef4444" fill-opacity=".85"/>`;for(let t=0;t<=12;t++)a+=o(60,16+11*t,t%2?66:72,16+11*t,i);f(t,"termometre","Termometre",100,190,a)}}{let t="İşaretler";f(t,"dogru-isareti","Doğru işareti",100,100,'<path d="M14 54 L40 80 L88 20" fill="none" stroke="#16a34a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>',!0),f(t,"yanlis-isareti","Yanlış işareti",100,100,'<path d="M20 20 L80 80 M80 20 L20 80" fill="none" stroke="#dc2626" stroke-width="7" stroke-linecap="round" vector-effect="non-scaling-stroke"/>',!0),f(t,"yildiz","Yıldız",100,96,'<polygon points="50,4 62,36 96,37 69,58 79,92 50,72 21,92 31,58 4,37 38,36" fill="#facc15" stroke="#a16207" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>',!0),f(t,"ok-sag","Ok",160,70,l("M6 26 H104 V8 L154 35 L104 62 V44 H6 Z",`${r} ${e}`)),f(t,"ok-cift","Çift yönlü ok",180,70,l("M6 35 L52 8 V26 H128 V8 L174 35 L128 62 V44 H52 V62 Z",`${r} ${e}`)),f(t,"ok-kivrik","Kıvrık ok",140,100,l("M10 90 C10 30 60 20 110 26")+c(124,28,4,14)),f(t,"balon","Konuşma balonu",180,120,l("M20 8 H160 a14 14 0 0 1 14 14 V70 a14 14 0 0 1 -14 14 H70 L40 112 L46 84 H20 a14 14 0 0 1 -14 -14 V22 a14 14 0 0 1 14 -14 Z",`fill="#fff" ${e}`)),f(t,"dusunce","Düşünce balonu",180,130,`<ellipse cx="96" cy="50" rx="80" ry="42" fill="#fff" ${e}/><circle cx="40" cy="104" r="10" fill="#fff" ${e}/><circle cx="20" cy="122" r="5" fill="#fff" ${e}/>`),f(t,"cerceve","Vurgu çerçevesi",200,100,`<rect x="6" y="6" width="188" height="88" rx="14" ${n} ${e}/>`),f(t,"cerceve-elips","Vurgu halkası",200,100,`<ellipse cx="100" cy="50" rx="94" ry="44" ${n} ${e}/>`),f(t,"alti-cizili","Altı çizgi",200,30,l("M6 18 C50 10 150 26 194 14")),f(t,"parantez","Küme parantezi",60,200,l("M50 6 C30 6 30 20 30 50 V80 C30 96 22 100 10 100 C22 100 30 104 30 120 V150 C30 180 30 194 50 194"))}let y=t=>t.split(" ").filter(Boolean),m=[{ad:"İşlemler",ogeler:y("+ − × ÷ = ≠ · / ± ∓ ( ) [ ] { } % ‰ … ⋯")},{ad:"Karşılaştırma",ogeler:y("< > ≤ ≥ ≈ ≅ ≡ ≢ ∼ ∝ ≪ ≫ ≟")},{ad:"Kesir, üs, kök",ogeler:y("½ ⅓ ⅔ ¼ ¾ ⅕ ⅖ ⅗ ⅘ ⅙ ⅛ ⅜ ⅝ ⅞ ⅒ x² x³ xⁿ x⁻¹ aᵇ √ ∛ ∜ ² ³ ⁴ ⁿ ⁻ ⁺ ₀ ₁ ₂ ₃ ₙ")},{ad:"Geometri",ogeler:y("∠ ∡ ⊥ ∥ ∦ △ ▭ □ ○ ◯ ° ′ ″ ≅ ∼ ⌒ |AB| [AB] [AB ⟂ π r h a b c α β")},{ad:"Kümeler",ogeler:y("∈ ∉ ∋ ⊂ ⊄ ⊆ ⊇ ⊃ ∪ ∩ ∅ ∖ ℕ ℤ ℚ ℝ ℂ ℤ⁺ ℤ⁻ ℝ⁺ s(A) Aᶜ A′ E")},{ad:"Mantık",ogeler:y("∧ ∨ ¬ ⇒ ⇐ ⇔ ∀ ∃ ∄ ⊕ ⊻ ≡ ∴ ∵ p q 1 0")},{ad:"Analiz",ogeler:y("∞ lim → ∑ ∏ ∫ ∬ ∮ ∂ ∆ ∇ f(x) g(x) f′(x) f″(x) f⁻¹ dy/dx dx ln log e |x| ⌊x⌋ ⌈x⌉ n! P(n,r) C(n,r) (fog)(x) ∘")},{ad:"Trigonometri",ogeler:y("sin cos tan cot sec csc arcsin arccos arctan sin² cos² π rad ° θ α β")},{ad:"Yunan harfleri",ogeler:y("α β γ δ ε ζ η θ ι κ λ μ ν ξ π ρ σ τ υ φ χ ψ ω Γ Δ Θ Λ Ξ Π Σ Φ Ψ Ω")},{ad:"Oklar",ogeler:y("→ ← ↑ ↓ ↔ ↕ ⇒ ⇐ ⇔ ⇑ ⇓ ↗ ↘ ↙ ↖ ↺ ↻ ⟶ ⟵ ⇌ ⇄")},{ad:"Birimler",ogeler:y("mm cm dm m km cm² m² km² cm³ m³ dm³ mL L g kg t mg °C °F K s dk sa gün km/sa m/s N J W kW V A Ω Hz Pa ₺ kr")},{ad:"Fen",ogeler:y("H₂O CO₂ O₂ H₂ N₂ NaCl H⁺ OH⁻ e⁻ p⁺ n⁰ → ⇌ ↑ ↓ Δ λ ν ρ g F⃗ v⃗ a⃗ ⊕ ⊖ ⚡")},{ad:"İşaret ve noktalama",ogeler:y("✓ ✗ ★ ☆ ♥ ☺ ☹ ☀ ♪ ❶ ❷ ❸ ① ② ③ ? ! . , ; : “ ” ‘ ’ – — …")}],v={sec:'<path d="M4.04 4.69a.5.5 0 0 1 .65-.65l16 6.5a.5.5 0 0 1-.06.95l-6.13 1.58a2 2 0 0 0-1.43 1.43l-1.58 6.13a.5.5 0 0 1-.95.06z"/>',kalem:'<path d="M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/>',fosfor:'<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>',gecici:'<path d="M14.6 6.6 4 17.2V20h2.8L17.4 9.4"/><path d="m13 8 3 3"/><path d="M19 2v4"/><path d="M17 4h4"/><path d="M21 12v3"/><path d="M19.5 13.5h3"/>',lazer:'<circle cx="18" cy="6" r="2.5" fill="currentColor"/><path d="M3 21 15.5 8.5"/><path d="M14 2.5 15 4"/><path d="M21.5 9 20 8"/><path d="M22 4.5h-1.7"/>',silgi:'<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',geri:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',temizle:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',yazi:'<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>',sekiller:'<circle cx="8.5" cy="14.5" r="6"/><path d="M14 3 21.5 17H8.8"/>',semboller:'<path d="M18 5H6l6 7-6 7h12"/>',tahta:'<rect x="2" y="3" width="20" height="13" rx="1.5"/><path d="M12 16v3"/><path d="m8 21 4-2 4 2"/>',perde:'<path d="M3 3h18"/><path d="M20 7H8"/><path d="M20 11H8"/><path d="M10 19h10"/><path d="M8 15h12"/><path d="M4 3v14"/><circle cx="4" cy="19" r="2"/>',spot:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',sure:'<path d="M10 2h4"/><path d="m12 14 3-3"/><circle cx="12" cy="14" r="8"/>',buyut:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>',kucult:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/>',sayfalar:'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',cift:'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',ses:'<path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.4 18.4a9 9 0 0 0 0-12.8"/>',sessiz:'<path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',bilgi:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',tamekran:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',sol:'<path d="m15 18-6-6 6-6"/>',hizaSol:'<rect x="3" y="4" width="10" height="16" rx="1.5"/><path d="M16.5 8H21"/><path d="M16.5 12H21"/><path d="M16.5 16H21"/>',hizaOrta:'<rect x="7" y="4" width="10" height="16" rx="1.5"/><path d="M3 9v6"/><path d="M21 9v6"/>',hizaSag:'<rect x="11" y="4" width="10" height="16" rx="1.5"/><path d="M3 8h4.5"/><path d="M3 12h4.5"/><path d="M3 16h4.5"/>',sag:'<path d="m9 18 6-6-6-6"/>',kapat:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',goz:'<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',ampul:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',video:'<path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.87a.5.5 0 0 0-.75-.43L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',kamera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',dur:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',oynat:'<polygon points="6 3 20 12 6 21 6 3"/>',arti:'<path d="M12 5v14"/><path d="M5 12h14"/>',tepki:'<path d="M5.8 11.3 2 22l10.7-3.8"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.2.8a2.9 2.9 0 0 0-1.9 3.3c.1.6-.4 1.2-1 1.2h-.4c-.9 0-1.6.6-1.8 1.4L14 10"/><path d="m22 13-.8-.3c-.8-.3-1.7.1-2.1.9-.3.6-.9 1-1.6.9-.9-.1-1.7.6-1.7 1.5v.2"/><path d="M11 2l.3.8c.3.9-.1 1.8-.9 2.2-.6.3-1 .9-1 1.6v.4"/><path d="M11 13c1.9 1.9 2.8 4.1 2 4.9-.8.8-3-.1-4.9-2-1.9-1.9-2.8-4.1-2-4.9.8-.8 3 .1 4.9 2Z"/>',yer:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>'},x=t=>'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+v[t]+"</svg>",b=(t,e,i="")=>'<button type="button" class="arac" data-arac="'+t+'" '+i+">"+x(t)+"<span>"+e+"</span></button>",w=(t,e,i,a="")=>'<button type="button" class="kucuk" id="'+t+'" '+a+">"+x(e)+"<span>"+i+"</span></button>",z="Egemen's Testmaker yalnızca teknik bir araçtır; içeriğin ve kaynakların kullanımından doğan hukuki sorumluluk belgeyi hazırlayan ve kullanan kişiye aittir.",A="Bu dijital kitap, öğretmenin Egemen's Testmaker ile hazırladığı belgeden üretilmiştir. Egemen's Testmaker yalnızca bir hazırlama ve görüntüleme aracıdır; kitaptaki soruları, metinleri, görselleri ve kaynakları Egemen's Testmaker seçmez, denetlemez ve yayımlamaz. İçeriğin seçilmesinden, kaynaklardan alınmasından, çoğaltılmasından ve paylaşılmasından doğan her türlü hukuki sorumluluk (telif ve fikrî mülkiyet hakları dâhil) belgeyi hazırlayan ve kullanan kişiye aittir.",S=String.raw`
:root{
  --zemin:#1d2128; --zemin-2:#262b33; --kenar:#3a414c;
  --cubuk:#fbfaf7; --cubuk-yazi:#1f2329; --cubuk-soluk:#6b7280; --cubuk-kenar:#e4e1da;
  --turuncu:#f5811f; --turuncu-koyu:#c95f06; --lacivert:#1b4b7f;
  --dogru:#15803d; --alt:104px;
  color-scheme: light;
}
*{box-sizing:border-box}
[hidden]{display:none!important}
html,body{margin:0;height:100%;background:var(--zemin);overflow:hidden;
  font-family:"Segoe UI",Ubuntu,Cantarell,"Noto Sans","DejaVu Sans",system-ui,sans-serif;
  -webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
button{font:inherit;cursor:pointer;touch-action:manipulation}
button:focus-visible{outline:3px solid var(--turuncu);outline-offset:2px}
#zk{position:fixed;inset:0;display:flex;flex-direction:column}
.govde{flex:1;min-height:0;display:flex;flex-direction:column}
#zk[data-yer="sol"] .govde,#zk[data-yer="sag"] .govde{flex-direction:row}
#zk[data-yer="sol"] .alt{order:-1}
#zk[data-yer="sag"] .alt{margin-left:auto}
#zk[data-yer="alt"] .alt{margin-top:auto}
#zk-dis-kapat{display:none}
#zk[data-mod="soru"] #zk-dis-kapat{display:flex}
#zk[data-mod="soru"] #zk-alan,#zk[data-mod="soru"] .gec,#zk[data-mod="soru"] #zk-sayfano,#zk[data-mod="soru"] #zk-kucult,
#zk[data-mod="soru"] #zk-buyut,#zk[data-mod="soru"] #zk-cift,#zk[data-mod="soru"] #zk-ses-dugme,
#zk[data-mod="soru"] .arac[data-arac="sayfalar"],#zk[data-mod="soru"] #zk-soru-kapat,#zk[data-mod="soru"] .imza,
#zk[data-mod="soru"] .kitap-bilgisi{display:none!important}
#zk[data-mod="soru"] .govde{background:#fff}

/* ÜST ŞERİT */
.ust{position:relative;z-index:6;height:58px;flex:none;display:flex;align-items:center;gap:10px;padding:0 12px;
  background:var(--zemin-2);border-bottom:1px solid var(--kenar);color:#eef0f3}
.kimlik{display:flex;align-items:center;gap:10px;min-width:0;flex:1}
.kimlik svg{flex:none;background:#fff;border-radius:50%;padding:2px}
.kimlik b{display:block;font-size:17px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kimlik small{display:block;font-size:12.5px;color:#aab1bc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sayac{display:flex;align-items:center;gap:8px;padding:4px 6px 4px 14px;border-radius:999px;background:#0f1216;border:1px solid var(--kenar);color:#fff}
.sayac b{font-size:28px;font-variant-numeric:tabular-nums;letter-spacing:.02em;min-width:92px;text-align:center}
.sayac button{width:40px;height:40px;border-radius:50%;border:0;background:#2e343d;color:#fff;display:grid;place-items:center}
.sayac button svg{width:20px;height:20px}
.sayac.son b{color:#ff8a65}
.sayac.bitti{animation:yan .5s steps(2) 8;background:#7f1d1d}
@keyframes yan{50%{background:#dc2626}}
.sayfano{font-size:16px;color:#cfd4db;font-variant-numeric:tabular-nums;white-space:nowrap;padding:0 4px}
.ust .kucuk{height:44px;padding:0 11px;border-radius:10px;border:1px solid var(--kenar);background:#2e343d;color:#eef0f3;display:flex;align-items:center;gap:7px;font-size:13.5px;white-space:nowrap}
.ust .kucuk svg{width:19px;height:19px}
.ust .kucuk[aria-pressed="true"]{background:var(--turuncu);border-color:var(--turuncu);color:#fff}
@media (max-width:1300px){.ust .kucuk span{display:none}}

/* SAYFA ALANI */
#zk-alan{position:relative;flex:1;min-height:0;min-width:0;overflow:auto}
#zk-sayfalar{min-height:100%;min-width:100%;display:flex;align-items:center;justify-content:center;gap:18px;padding:16px 92px;width:max-content;margin:0 auto}
.sayfa{position:relative;background:#fff;container-type:size;overflow:hidden}
.sayfa.duz{flex:none;box-shadow:0 10px 30px rgba(0,0,0,.45)}
.sayfa > img{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;-webkit-user-drag:none}
.tuval{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;touch-action:none;z-index:3}
#zk[data-arac="kalem"] .tuval,#zk[data-arac="fosfor"] .tuval,#zk[data-arac="gecici"] .tuval,#zk[data-arac="silgi"] .tuval,#zk[data-arac="yazi"] .tuval{pointer-events:auto}
#zk[data-arac="kalem"] .tuval{cursor:var(--imlec-kalem)}
#zk[data-arac="fosfor"] .tuval{cursor:var(--imlec-fosfor)}
#zk[data-arac="gecici"] .tuval{cursor:var(--imlec-gecici)}
#zk[data-arac="silgi"] .tuval{cursor:var(--imlec-silgi)}
#zk[data-arac="yazi"] .tuval{cursor:text}
.bolge{position:absolute;border:0;padding:0;background:transparent;border-radius:6px;cursor:zoom-in;z-index:1}
.bolge:hover,.bolge:focus-visible{background:rgba(245,129,31,.08);outline:2px solid rgba(245,129,31,.75);outline-offset:2px}
.kitap{position:relative;flex:none}
.stf__parent{position:relative;display:block;box-sizing:border-box;transform:translateZ(0);touch-action:none}
.stf__wrapper{position:relative;width:100%;height:100%;box-sizing:border-box}
.stf__parent canvas{position:absolute;width:100%;height:100%;left:0;top:0}
.stf__block{position:absolute;width:100%;height:100%;box-sizing:border-box;perspective:2000px}
.stf__item{display:none;position:absolute;transform-style:preserve-3d}
.stf__outerShadow,.stf__innerShadow,.stf__hardShadow,.stf__hardInnerShadow{position:absolute;left:0;top:0}
.kitap .sayfa{box-shadow:inset 0 0 0 1px rgba(0,0,0,.04)}
.gec{position:fixed;top:50%;transform:translateY(-50%);width:68px;height:68px;border-radius:50%;
  border:1px solid var(--kenar);background:rgba(38,43,51,.92);color:#fff;display:grid;place-items:center;z-index:6}
.gec svg{width:36px;height:36px}
.gec[disabled]{opacity:.25;cursor:default}
.gec.onceki{left:calc(var(--sol,0px) + 12px)}.gec.sonraki{right:calc(var(--sag,0px) + 12px)}

/* NESNELER: şekil, sembol, yazı */
.nesneler{position:absolute;inset:0;z-index:2;pointer-events:none}
.nesne{position:absolute;pointer-events:auto;transform-origin:50% 50%;touch-action:none}
#zk:not([data-arac="sec"]) .nesne{pointer-events:none}
#zk[data-arac="sec"] .nesne{cursor:move}
.nesne svg{display:block;width:100%;height:100%;overflow:visible}
.nesne .yazi-ic{white-space:pre;line-height:1.15;font-family:"Cambria Math","STIX Two Math","Segoe UI Symbol","DejaVu Sans","Noto Sans Math",serif;padding:.05em .1em;outline:none;min-width:.6em}
.nesne.duzenleniyor .yazi-ic{background:rgba(255,255,255,.85);box-shadow:0 0 0 2px var(--turuncu);cursor:text;user-select:text;-webkit-user-select:text}
.nesne.secili{outline:2px dashed var(--turuncu);outline-offset:4px}
.tut{position:absolute;width:30px;height:30px;border-radius:50%;background:#fff;border:2px solid var(--turuncu);display:grid;place-items:center;
  box-shadow:0 2px 8px rgba(0,0,0,.3);touch-action:none;z-index:2;padding:0;color:var(--cubuk-yazi)}
.tut svg{width:16px;height:16px}
.tut-boyut{right:-19px;bottom:-19px;cursor:nwse-resize;border-radius:6px}
.tut-dondur{left:50%;top:-46px;margin-left:-15px;cursor:grab}
.tut-sil{right:-19px;top:-19px;background:#dc2626;border-color:#dc2626;color:#fff;cursor:pointer}

/* PERDE */
#zk-perde{position:fixed;left:var(--sol,0px);right:var(--sag,0px);bottom:var(--alt,0px);z-index:22;
  background:repeating-linear-gradient(90deg,#59616d 0 22px,#525a66 22px 44px);box-shadow:0 -6px 18px rgba(0,0,0,.35)}
#zk-perde .tutamak{position:absolute;left:50%;top:-26px;transform:translateX(-50%);height:52px;padding:0 22px;border-radius:26px;
  background:var(--cubuk);color:var(--cubuk-yazi);border:2px solid var(--turuncu);display:flex;align-items:center;gap:10px;
  font-size:15px;font-weight:600;cursor:ns-resize;touch-action:none;white-space:nowrap}
#zk-perde .tutamak i{width:28px;height:4px;border-radius:2px;background:var(--turuncu);box-shadow:0 7px 0 var(--turuncu),0 -7px 0 var(--turuncu)}

/* SPOT IŞIĞI */
#zk-spot{position:fixed;left:var(--sol,0px);right:var(--sag,0px);top:var(--sahne-ust,0px);bottom:var(--alt,0px);z-index:25;cursor:grab;touch-action:none}
#zk-spot .spot-kumanda{position:absolute;right:16px;top:12px;display:flex;gap:8px}
#zk-spot .spot-kumanda button{height:50px;padding:0 18px;border-radius:12px;border:0;background:var(--cubuk);color:var(--cubuk-yazi);font-size:15px;font-weight:600;display:flex;align-items:center;gap:8px}
#zk-spot .spot-kumanda svg{width:20px;height:20px}

/* LAZER */
/* Lazerde imleç küçük kırmızı nokta (sayfa, soru, tahta üstünde). */
#zk[data-arac="lazer"] .sayfa,#zk[data-arac="lazer"] .kagit,#zk[data-arac="lazer"] .tahta-zemin,#zk[data-arac="lazer"] .soru-govde,#zk[data-arac="lazer"] #zk-alan{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Ccircle cx='8' cy='8' r='5' fill='%23ff2a2a' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 8 8, crosshair}
#zk[data-arac="lazer"] .bolge{cursor:inherit}
/* width/height ŞART: tuval CSS boyutu almazsa kendi piksel boyunda (ekran × ölçek) durur;
   %150 ölçekli tahtada lazer noktası basılan yerden kayıyordu (kullanıcı bildirdi). */
#zk-lazer{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:40;pointer-events:none}
/* KAMERA (16 Eki 2026): öğretmenin görüntüsü, sorunun üstünde yuvarlak.
   Sahnenin (20) ve spotun (25) üstünde; lazerin (40), araç çubuğunun (50)
   ve panellerin (60) altında. */
#zk-kamera{position:fixed;z-index:30;border-radius:50%;overflow:hidden;background:#1d2128;border:4px solid #fff;
  box-shadow:0 10px 30px rgba(0,0,0,.35);touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}
#zk-kamera.surukleniyor{cursor:grabbing}
#zk-kamera video{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
#zk-kamera p{display:none;margin:0}
#zk-kamera.bekliyor p{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:14px;
  color:#fff;font-size:14px;text-align:center}
#zk-kamera.hata{border-radius:16px;width:320px!important;height:auto!important;background:var(--cubuk);color:var(--cubuk-yazi);
  border:1px solid var(--cubuk-kenar);cursor:default;padding:16px 52px 16px 16px}
#zk-kamera.hata video{display:none}
#zk-kamera.hata p{display:block;font-size:15px;line-height:1.45}
.kamera-dugmeler{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);display:flex;gap:8px;opacity:0;transition:opacity .2s}
#zk-kamera:hover .kamera-dugmeler,#zk-kamera.etkin .kamera-dugmeler{opacity:1}
.kamera-dugmeler button{width:40px;height:40px;border-radius:50%;border:0;background:rgba(20,24,30,.78);color:#fff;
  display:grid;place-items:center;cursor:pointer;padding:0}
.kamera-dugmeler svg{width:19px;height:19px}
#zk-kamera.hata .kamera-dugmeler{opacity:1;left:auto;right:8px;top:8px;bottom:auto;transform:none}
#zk-kamera.hata .kamera-dugmeler button{background:transparent;color:inherit}
#zk-kamera.hata #zk-kamera-boy{display:none}
/* TEPKİLER (kullanıcı, 15 Eki: "online derste konfeti patlatma, 100 yazısı,
   yanlışta yanlış sesi; çok karışık olmasın"). Ekranın üstünde 2–3 sn. */
#zk-efekt{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:45;pointer-events:none}
.damga{position:fixed;left:50%;top:46%;z-index:46;pointer-events:none;transform:translate(-50%,-50%);display:grid;place-items:center}
.damga svg{width:min(46vh,46vw);height:min(46vh,46vw);filter:drop-shadow(0 10px 24px rgba(0,0,0,.25))}
.damga.giris{animation:damgaGir .35s cubic-bezier(.2,1.6,.4,1) both, damgaCik .45s ease-in 1.9s forwards}
.damga.salla{animation:damgaGir .25s ease-out both, salla .5s ease-in-out .25s 1, damgaCik .4s ease-in 1.6s forwards}
@keyframes damgaGir{from{transform:translate(-50%,-50%) scale(2.2) rotate(-12deg);opacity:0}to{transform:translate(-50%,-50%) scale(1) rotate(-6deg);opacity:1}}
@keyframes damgaCik{to{transform:translate(-50%,-50%) scale(.9) rotate(-6deg);opacity:0}}
@keyframes salla{0%,100%{transform:translate(-50%,-50%)}20%{transform:translate(calc(-50% - 22px),-50%)}40%{transform:translate(calc(-50% + 22px),-50%)}60%{transform:translate(calc(-50% - 14px),-50%)}80%{transform:translate(calc(-50% + 10px),-50%)}}
/* Tepki BALONCUĞU (kullanıcı, 15 Eki: "büyük alan açılmasın; düğmenin hemen
   orada küçük bir kutucuk açılsın, sorunun üzerine gitmesin"). */
.baloncuk{position:fixed;z-index:60;background:var(--cubuk);border:1px solid var(--cubuk-kenar);border-radius:16px;padding:8px;box-shadow:0 12px 32px rgba(0,0,0,.35)}
.baloncuk::after{content:"";position:absolute;width:14px;height:14px;background:var(--cubuk);border:1px solid var(--cubuk-kenar);transform:rotate(45deg)}
.baloncuk.yon-alt::after{left:calc(50% - 7px);bottom:-8px;border-top:0;border-left:0}
.baloncuk.yon-sol::after{left:-8px;top:calc(50% - 7px);border-top:0;border-right:0}
.baloncuk.yon-sag::after{right:-8px;top:calc(50% - 7px);border-bottom:0;border-left:0}
.tepkiler{display:flex;gap:6px}
#zk[data-yer="sol"] .tepkiler,#zk[data-yer="sag"] .tepkiler{display:grid;grid-template-columns:repeat(2,64px)}
.tepkiler button{width:64px;height:64px;border-radius:12px;border:1px solid var(--cubuk-kenar);background:#fff;color:var(--cubuk-yazi);font-size:11px;font-weight:700;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:0}
.tepkiler button svg{width:34px;height:34px}
.tepkiler button:hover{border-color:var(--turuncu);background:#fff8f1}
#zk-silgi-iz{position:fixed;z-index:41;pointer-events:none;border-radius:50%;border:2px solid rgba(31,41,55,.7);background:rgba(255,255,255,.35);
  box-shadow:0 0 0 1px rgba(255,255,255,.8)}

/* ALT: ARAÇ ÇUBUĞU + İMZA */
.alt{position:relative;z-index:50;flex:none;background:var(--zemin)}
.araclar{display:flex;justify-content:center;padding:8px 10px 4px}
.cubuk{display:flex;align-items:stretch;gap:1px;padding:5px;border-radius:18px;background:var(--cubuk);border:1px solid var(--cubuk-kenar);
  box-shadow:0 8px 24px rgba(0,0,0,.35);max-width:100%;overflow-x:auto;scrollbar-width:thin}
.ayrac{width:1px;margin:6px 4px;background:var(--cubuk-kenar);flex:none}
.arac{min-width:58px;height:62px;padding:6px 5px 4px;border:0;border-radius:12px;background:transparent;color:var(--cubuk-yazi);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;flex:none}
.arac span{font-size:12px;font-weight:600;line-height:1;white-space:nowrap}
.arac:hover{background:#f0ede6}
/* 1366 px tahtalarda çubuk sığsın (18 araç). */
@media (max-width:1500px){#zk:not([data-yer="sol"]):not([data-yer="sag"]) .arac{min-width:50px;padding:6px 3px 4px}#zk:not([data-yer="sol"]):not([data-yer="sag"]) .arac span{font-size:11px}#zk:not([data-yer="sol"]):not([data-yer="sag"]) .renk{width:28px;height:28px}#zk:not([data-yer="sol"]):not([data-yer="sag"]) .renkler{gap:4px;padding:0 4px}#zk:not([data-yer="sol"]):not([data-yer="sag"]) .kalin{width:30px}}
.arac[aria-pressed="true"]{background:var(--turuncu);color:#fff}
.renkler{display:flex;align-items:center;gap:6px;padding:0 6px}
.renk{width:32px;height:32px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1px var(--cubuk-kenar);flex:none;padding:0}
.renk[aria-pressed="true"]{box-shadow:0 0 0 3px var(--cubuk-yazi)}
.kalinliklar{display:flex;align-items:center;gap:2px;padding:0 4px}
.kalin{width:34px;height:44px;border:0;border-radius:10px;background:transparent;display:grid;place-items:center;padding:0}
.kalin i{display:block;border-radius:50%;background:var(--cubuk-yazi)}
.kalin[aria-pressed="true"]{background:#efe7dc;box-shadow:inset 0 0 0 2px var(--turuncu)}
.imza{text-align:center;font-size:11px;line-height:1.3;color:#8b93a0;padding:2px 16px 6px;max-width:1100px;margin:0 auto}
/* DİKEY ÇUBUK (solda/sağda) — Akıllı Tahta'nın varsayılanı solda: kullanıcı
   "araç çizelgesi sorunun üzerine geliyor, taşınabilir olmalı, varsayılan
   solda olsun" demişti. Çubuk kendi sütununda, hiçbir şeyin üstüne binmiyor. */
#zk[data-yer="sol"] .alt,#zk[data-yer="sag"] .alt{display:flex;flex-direction:column;min-height:0;padding:6px 0}
#zk[data-yer="sol"] .araclar,#zk[data-yer="sag"] .araclar{flex:1;min-height:0;padding:4px 8px}
#zk[data-yer="sol"] .cubuk,#zk[data-yer="sag"] .cubuk{display:grid;grid-template-columns:repeat(2,66px);align-content:start;overflow-y:auto;overflow-x:hidden;max-height:100%}
#zk[data-yer="sol"] .arac,#zk[data-yer="sag"] .arac{min-width:0;height:64px;padding:5px 2px 4px}
#zk[data-yer="sol"] .arac span,#zk[data-yer="sag"] .arac span{white-space:normal;text-align:center;font-size:11.5px;line-height:1.05}
#zk[data-yer="sol"] .renkler,#zk[data-yer="sag"] .renkler,#zk[data-yer="sol"] .kalinliklar,#zk[data-yer="sag"] .kalinliklar{grid-column:span 2;flex-wrap:wrap;justify-content:center;padding:6px 2px}
#zk[data-yer="sol"] .ayrac,#zk[data-yer="sag"] .ayrac{grid-column:span 2;width:auto;height:1px;margin:4px 6px}
#zk[data-yer="sol"] .imza,#zk[data-yer="sag"] .imza{max-width:136px;font-size:9.5px;text-align:left;padding:4px 10px}

/* AÇILIR PANELLER */
.panel{position:fixed;z-index:60;left:calc(50% + (var(--sol,0px) - var(--sag,0px)) / 2);bottom:calc(var(--alt,0px) + 8px);transform:translateX(-50%);background:var(--cubuk);color:var(--cubuk-yazi);
  border-radius:18px;padding:14px 16px 16px;box-shadow:0 18px 50px rgba(0,0,0,.5);max-width:calc(100vw - 24px)}
.panel-bas{display:flex;align-items:center;gap:10px;margin:0 0 10px}
.panel-bas h2{margin:0;font-size:17px;flex:1}
.panel-bas .kapat{width:44px;height:44px;border-radius:12px;border:1px solid var(--cubuk-kenar);background:#fff;display:grid;place-items:center;color:var(--cubuk-yazi)}
.panel-bas .kapat svg{width:20px;height:20px}
.sureler{display:grid;grid-template-columns:repeat(5,minmax(72px,1fr));gap:8px}
.sureler button{height:60px;border-radius:12px;border:1px solid var(--cubuk-kenar);background:#fff;font-size:20px;font-weight:700;color:var(--cubuk-yazi)}
.sureler button small{display:block;font-size:11px;font-weight:600;color:var(--cubuk-soluk)}
.sureler .genis{grid-column:span 5;font-size:16px}
/* ELLE SÜRE (kullanıcı, 15 Eki: "öğretmen elle girebileceği bir alan"). Tahtada
   klavye zahmetli: büyük − / + düğmeleri; yazmak da mümkün. */
.elle-sure{margin-top:12px;padding-top:12px;border-top:1px solid var(--cubuk-kenar);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.elle-sure > span{font-size:15px;font-weight:700;margin-right:2px}
.sayi-kutu{display:flex;align-items:center;gap:4px}
.sayi-kutu button{width:48px;height:52px;border-radius:12px;border:1px solid var(--cubuk-kenar);background:#fff;font-size:26px;font-weight:700;color:var(--cubuk-yazi);line-height:1;padding:0}
.sayi-kutu input{width:64px;height:52px;border-radius:12px;border:2px solid var(--cubuk-kenar);text-align:center;font-family:inherit;font-size:26px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--cubuk-yazi);background:#fff;user-select:text;-webkit-user-select:text}
.sayi-kutu input:focus{outline:none;border-color:var(--turuncu)}
.sayi-kutu small{font-size:12px;font-weight:600;color:var(--cubuk-soluk);margin-left:2px}
.elle-sure .baslat{height:52px;padding:0 20px;border-radius:12px;border:0;background:var(--turuncu);color:#fff;font-size:17px;font-weight:700;margin-left:auto}
#zk-kucukler{width:min(620px,calc(100vw - 24px))}
/* TÜM SORULAR (kullanıcı, 16 Eki 2026): "Sayfalar"ın aynısı, soru kartlarıyla —
   öğretmen istediği soruya dokunup geçiyor. Sorular yatay: kartlar daha geniş. */
#zk-soru-listesi{width:min(980px,calc(100vw - 24px))}
.kucukler.soru-kartlari{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));max-height:min(56vh,520px)}
.soru-kartlari .kart{display:block;aspect-ratio:4/3;background:#fff;border-radius:6px;box-shadow:0 1px 5px rgba(0,0,0,.22);
  overflow:hidden;margin-bottom:4px;display:flex;align-items:flex-start;justify-content:center}
.soru-kartlari img{width:100%;height:100%;object-fit:contain;object-position:top;box-shadow:none;margin:0;border-radius:0}
.soru-kartlari span{font-size:13px;font-weight:600}
#zk-tum-sorular{flex:none}
@media (max-width:900px){#zk-tum-sorular span{display:none}}
.kucukler{display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:10px;max-height:min(46vh,420px);overflow:auto;padding:2px}
.kucukler button{border:2px solid transparent;border-radius:6px;padding:0 0 2px;background:none;color:var(--cubuk-yazi);font-size:12px}
.kucukler img{display:block;width:100%;border-radius:4px;box-shadow:0 1px 5px rgba(0,0,0,.22);margin-bottom:3px}
.kucukler button[aria-current="true"]{border-color:var(--turuncu)}
.genis-panel{width:min(920px,calc(100vw - 24px))}
.sekmeler{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.sekmeler button{height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--cubuk-kenar);background:#fff;color:var(--cubuk-yazi);font-size:14px;font-weight:600}
.sekmeler button[aria-pressed="true"]{background:var(--lacivert);border-color:var(--lacivert);color:#fff}
.kutular{display:grid;gap:10px;max-height:min(46vh,440px);overflow:auto;padding:2px}
.sekil-kutular{grid-template-columns:repeat(auto-fill,minmax(112px,1fr))}
.sekil-kutular button{height:112px;border-radius:12px;border:1px solid var(--cubuk-kenar);background:#fff;color:#1f2937;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px}
.sekil-kutular svg{width:100%;height:62px;overflow:visible}
.sekil-kutular span{font-size:11.5px;line-height:1.15;text-align:center;color:var(--cubuk-soluk)}
.sembol-kutular{grid-template-columns:repeat(auto-fill,minmax(68px,1fr))}
.sembol-kutular button{height:64px;border-radius:12px;border:1px solid var(--cubuk-kenar);background:#fff;color:#111827;font-size:26px;
  font-family:"Cambria Math","STIX Two Math","Segoe UI Symbol","DejaVu Sans","Noto Sans Math",serif;white-space:nowrap;overflow:hidden;padding:0 4px}
.sembol-kutular button.uzun{font-size:17px}
.sekil-kutular button:hover,.sembol-kutular button:hover{border-color:var(--turuncu);background:#fff8f1}
.ipucu{margin:10px 0 0;font-size:12.5px;color:var(--cubuk-soluk)}
#zk-bilgi{position:fixed;inset:0;z-index:70;background:rgba(10,12,16,.55);display:flex;align-items:center;justify-content:center;padding:16px}
#zk-bilgi .kutu{background:var(--cubuk);color:var(--cubuk-yazi);border-radius:18px;max-width:620px;width:100%;padding:18px 22px 20px;box-shadow:0 18px 50px rgba(0,0,0,.5);max-height:calc(100vh - 32px);overflow:auto;user-select:text;-webkit-user-select:text}
#zk-bilgi h3{margin:16px 0 6px;font-size:15px}
#zk-bilgi p,#zk-bilgi li{font-size:14px;line-height:1.55;margin:0 0 6px}
#zk-bilgi ul{margin:0;padding-left:20px}
#zk-bilgi .yasal{background:#fff;border:1px solid var(--cubuk-kenar);border-radius:12px;padding:10px 12px}
#zk-bilgi .tehlike{margin-top:14px;height:46px;padding:0 16px;border-radius:12px;border:1px solid #fecaca;background:#fff;color:#b91c1c;font-weight:600}

/* SORU SAHNESİ — düz beyaz zemin (kullanıcı: "soru sadece beyaz bir zemin üzerinde") */
.sahne{position:fixed;left:var(--sol,0px);right:var(--sag,0px);top:var(--sahne-ust,0px);bottom:var(--alt,0px);z-index:20;background:#fff;display:flex;flex-direction:column;color:var(--cubuk-yazi)}
.sahne-ust{height:62px;flex:none;display:flex;align-items:center;gap:10px;padding:0 16px;border-bottom:1px solid #eceae5}
.sahne-ust > b{font-size:22px;color:#1f2329}
.sahne-ust .sira{flex:1;font-size:16px;color:#6b7280;font-variant-numeric:tabular-nums;padding-left:6px}
.soru-not{flex:none;margin:0 24px 8px;padding:10px 14px;border-radius:12px;background:#fffbeb;border:1px solid #fde68a;color:#78350f;font-size:16px;line-height:1.45;max-height:22vh;overflow:auto;user-select:text;-webkit-user-select:text}
.soru-bekle{color:#9ca3af;font-size:18px}
.soru-govde{position:relative;flex:1;min-height:0;display:flex;gap:28px;padding:18px 24px 12px;align-items:center;justify-content:center}
/* EKRAN KATMANI (kullanıcı, 15 Eki: "kalem yalnız görselin alanına yazıyor; ekranın tamamını
   kullanabilmeliyim"). Sayfanın/sorunun dışına da yazılıyor. Seç aracında tıklamayı geçiriyor. */
.ekran-katmani{position:absolute;inset:0;z-index:5;pointer-events:none}
.soru-govde.dikey{flex-direction:column;gap:46px}
/* Soruyu sola/sağa yaslama: kâğıt bir yana, öbür yan boş yazı alanı. */
.soru-govde.hiza-sol .soru-kutu{justify-content:flex-start}
.soru-govde.hiza-sag .soru-kutu{justify-content:flex-end}
.hiza{display:flex;gap:3px;padding:3px;border-radius:12px;background:#f1efea;flex:none}
.hiza button{width:52px;height:46px;border:0;border-radius:9px;background:transparent;color:#6b7280;display:flex;align-items:center;justify-content:center;cursor:pointer}
.hiza button svg{width:24px;height:24px}
.hiza button[aria-pressed="true"]{background:#fff;color:var(--lacivert);box-shadow:0 1px 3px rgba(0,0,0,.18)}
.hiza button[disabled]{opacity:.35;cursor:default}
.soru-kutu{position:relative;flex:1;min-width:0;min-height:0;height:100%;display:flex;align-items:center;justify-content:center}
.soru-govde.dikey .soru-kutu{width:100%;height:auto}
.soru-govde.yanli .soru-kutu + .soru-kutu{border-left:2px dashed #e5e2dc;padding-left:28px}
.soru-govde.dikey .soru-kutu + .soru-kutu{border-left:0;padding-left:0;border-top:2px dashed #e5e2dc;padding-top:30px}
.kagit{position:relative;background:#fff;container-type:size}
.kagit > img{display:block;width:100%;height:100%;pointer-events:none;-webkit-user-drag:none}
.yan-baslik{position:absolute;left:0;top:-28px;color:#6b7280;font-size:15px;font-weight:700;letter-spacing:.02em}
.sahne-alt{flex:none;display:flex;justify-content:center;gap:10px;padding:10px 16px 14px;flex-wrap:wrap;border-top:1px solid #eceae5}
.buyuk{height:56px;padding:0 20px;border-radius:14px;border:1px solid #dcd8d0;background:#f6f4f0;color:var(--cubuk-yazi);font-size:17px;font-weight:600;
  display:flex;align-items:center;gap:10px}
.buyuk svg{width:24px;height:24px}
.buyuk.vurgu{background:var(--turuncu);border-color:var(--turuncu);color:#fff}
/* Alt şerit inceltildi (kullanıcı, 16 Eki 2026: "dikeyde fazla büyük,
   soru daha çok yer kaplasın"). 44 px parmakla basmanın alt sınırı. */
.sahne-alt{padding:6px 16px 8px;gap:8px}
.sahne-alt .buyuk{height:44px;padding:0 16px;border-radius:12px;font-size:15.5px}
.sahne-alt .buyuk svg{width:20px;height:20px}
.buyuk[aria-pressed="true"]{background:var(--lacivert);border-color:var(--lacivert);color:#fff}
.buyuk[disabled]{opacity:.35;cursor:default}
.cevap-rozet{position:absolute;right:-10px;top:-18px;z-index:4;display:flex;align-items:center;gap:12px;padding:10px 20px 10px 12px;border-radius:999px;
  background:var(--dogru);color:#fff;font-size:20px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.25);animation:belir .25s ease-out}
.cevap-rozet i{font-style:normal;width:56px;height:56px;border-radius:50%;background:#fff;color:var(--dogru);display:grid;place-items:center;font-size:32px;font-weight:800}
@keyframes belir{from{transform:scale(.6);opacity:0}}

/* BOŞ TAHTA */
.tahta-govde{flex:1;min-height:0;padding:12px}
.tahta-zemin{position:relative;width:100%;height:100%;border-radius:8px;border:1px solid #e4e1da;background-color:#fff;container-type:size;overflow:hidden}
.z-kareli{background-image:linear-gradient(#d5dde8 1px,transparent 1px),linear-gradient(90deg,#d5dde8 1px,transparent 1px);background-size:40px 40px}
.z-cizgili{background-image:repeating-linear-gradient(to bottom,transparent 0 47px,#b9c6d6 47px 48px)}
.z-noktali{background-image:radial-gradient(circle,#94a3b8 1.7px,transparent 2px);background-size:36px 36px}
.z-koordinat{background-image:linear-gradient(#475569,#475569),linear-gradient(#475569,#475569),linear-gradient(#d5dde8 1px,transparent 1px),linear-gradient(90deg,#d5dde8 1px,transparent 1px);
  background-size:100% 2px,2px 100%,40px 40px,40px 40px;background-position:0 50%,50% 0,50% 50%,50% 50%;background-repeat:no-repeat,no-repeat,repeat,repeat}
.zeminler{display:flex;gap:6px;flex-wrap:wrap}
.zeminler button,.tahta-gez button{height:44px;padding:0 14px;border-radius:12px;border:1px solid #dcd8d0;background:#f6f4f0;color:var(--cubuk-yazi);font-size:14px;font-weight:600;display:flex;align-items:center;gap:6px}
.zeminler button[aria-pressed="true"]{background:var(--lacivert);border-color:var(--lacivert);color:#fff}
.tahta-gez{display:flex;align-items:center;gap:6px}
.tahta-gez span{min-width:56px;text-align:center;font-variant-numeric:tabular-nums;font-weight:600}
.tahta-gez svg{width:20px;height:20px}

@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
@media print{#zk{display:none}body::after{content:"Bu dosya tahtada göstermek içindir; yazdırmak için Egemen's Testmaker'den PDF alın.";display:block;padding:40px;font:16px sans-serif}}
`,E=String.raw`
(function(){
'use strict';
function $(id){ return document.getElementById(id); }
function el(t, c){ var e = document.createElement(t); if (c) e.className = c; return e; }
function jsonOku(id){ return JSON.parse($(id).textContent); }
var Z = jsonOku('zk-veri'), SEK = jsonOku('zk-sekiller'), SEM = jsonOku('zk-semboller'), SIMGE = jsonOku('zk-simge');
var SEKMAP = {}; SEK.forEach(function(s){ SEKMAP[s.k] = s; });
var SORU_MODU = Z.mod === 'soru';
function disKaynak(){ try { return window.parent && window.parent !== window ? window.parent.__zkKaynak : null; } catch (e) { return null; } }
var kok = $('zk'), alan = $('zk-alan'), dizi = $('zk-sayfalar');
var n = Z.sayfalar.length;
var KALEM_RENK = ['#d32f2f', '#1d4ed8', '#111827', '#15803d', '#ea580c', '#7c3aed'];
var FOSFOR_RENK = ['#facc15', '#4ade80', '#f472b6', '#38bdf8', '#fb923c'];
var KALINLIK = [0.55, 1, 1.9];
var GECICI_BEKLE = 1800, GECICI_SON = 900;
var d = { sayfa: 0, cift: null, yakin: 1, arac: 'sec', renk: KALEM_RENK[0], fosfor: FOSFOR_RENK[0], kalin: 1,
  soru: -1, cevap: false, cozum: false, tahta: -1, ses: true, secili: null };
var cizimler = {}, nesneler = {}, tahtalar = [{ z: 'kareli' }];
var bagli = {};
var geriYigini = [];
var kitap = null;
var sonAnahtar = null;

/* ---------- kalıcılık: çizimler dosya kapatılıp açılınca yerinde ---------- */
var DEPO = Z.kimlik ? 'foyevi-zk:' + Z.kimlik : null;
try {
  if (!DEPO) throw 0;
  var kayitli = JSON.parse(localStorage.getItem(DEPO) || 'null');
  if (kayitli) {
    cizimler = kayitli.c || {}; nesneler = kayitli.n || {};
    if (kayitli.t && kayitli.t.length) tahtalar = kayitli.t;
    if (typeof kayitli.ses === 'boolean') d.ses = kayitli.ses;
  }
} catch (e) {}
var kayitZaman = null;
function kaydet(){
  clearTimeout(kayitZaman);
  kayitZaman = setTimeout(function(){
    try {
      if (!DEPO) return;
      var c = {};
      Object.keys(cizimler).forEach(function(a){
        c[a] = cizimler[a].filter(function(s){ return !s.g; }).map(function(s){
          return { a: s.a, r: s.r, k: s.k, p: s.p.map(function(v){ return Math.round(v * 1e4) / 1e4; }) };
        });
      });
      localStorage.setItem(DEPO, JSON.stringify({ c: c, n: nesneler, t: tahtalar, ses: d.ses }));
    } catch (e) {}
  }, 400);
}

/* ---------- geri al: yüzey başına anlık görüntü ---------- */
function anlik(anahtarlar){
  if (typeof anahtarlar === 'string') anahtarlar = [anahtarlar];
  geriYigini.push(anahtarlar.map(function(a){
    return { a: a, c: JSON.stringify(cizimler[a] || []), n: JSON.stringify(nesneler[a] || []) };
  }));
  if (geriYigini.length > 80) geriYigini.shift();
}
function geriAl(){
  var grup = geriYigini.pop();
  if (!grup) return;
  d.secili = null;
  grup.forEach(function(s){
    cizimler[s.a] = JSON.parse(s.c); nesneler[s.a] = JSON.parse(s.n);
    var y = bagli[s.a]; if (y) y.ciz();
  });
  tumNesneleriYenile();
  kaydet();
}

/* ---------- çizim yüzeyi: sayfa, soru, boş tahta ---------- */
function silgiYaricap(h){ return Math.max(14, h * 0.024); }
function Yuzey(kap, anahtar, ipucu){
  this.kap = kap; this.a = anahtar; this.ipucu = ipucu || null;
  this.katman = el('div', 'nesneler'); kap.appendChild(this.katman);
  this.c = el('canvas', 'tuval'); kap.appendChild(this.c);
  bagli[anahtar] = this;
  var s = this;
  /* Kitap kütüphanesi fare/dokunma olaylarını sayfadan dinliyor; kalemle
     yazarken sayfa bükülmesin diye olay tuvalde kalıyor. */
  ['mousedown', 'touchstart'].forEach(function(t){
    s.c.addEventListener(t, function(e){ e.stopPropagation(); }, { passive: true });
  });
  this.c.addEventListener('pointerdown', function(e){ s.bas(e); });
  this.c.addEventListener('pointermove', function(e){ s.surukle(e); });
  this.c.addEventListener('pointerup', function(e){ s.birak(e); });
  this.c.addEventListener('pointercancel', function(e){ s.birak(e); });
  this.c.addEventListener('pointerleave', function(){ if (!s.silgiliyor) silgiIzGizle(); });
  this.nesneleriKur();
}
Yuzey.prototype.liste = function(){ return cizimler[this.a] || (cizimler[this.a] = []); };
Yuzey.prototype.nl = function(){ return nesneler[this.a] || (nesneler[this.a] = []); };
Yuzey.prototype.boyut = function(){
  var w = this.kap.offsetWidth, h = this.kap.offsetHeight;
  if ((!w || !h) && this.ipucu) { w = this.ipucu.w; h = this.ipucu.h; }
  return { w: w, h: h };
};
Yuzey.prototype.nokta = function(e){
  var r = this.c.getBoundingClientRect();
  return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
};
Yuzey.prototype.bas = function(e){
  var a = d.arac;
  if (a === 'sec' || a === 'lazer') return;
  /* Ekran katmanı: basılan nokta bir sayfanın/sorunun üstündeyse çizgi
     ONA ait (sayfayla çevrilsin, soruyla kalsın); değilse katmana. */
  /* Yazı yönlendirilmiyor: şekil ve sembol gibi EKRANA konuyor (kullanıcı,
     15 Eki: "öğretmen yalnız görsele sıkışıp kalamaz; diğer alanlar çözüm
     alanı"). Çizgi ise başladığı sayfaya/soruya ait. */
  if (this.yonlendir && a !== 'yazi') {
    var l = this.yonlendir();
    for (var i = 0; i < l.length; i++) {
      var r = l[i].kap.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) { l[i].bas(e); return; }
    }
  }
  e.preventDefault();
  sonAnahtar = this.a;
  secimKaldir();
  if (a === 'yazi') { this.yaziEkle(this.nokta(e)); return; }
  try { this.c.setPointerCapture(e.pointerId); } catch (_) {}
  if (a === 'silgi') { anlik(this.a); this.silgiliyor = true; this.sil(this.nokta(e)); silgiIz(e, this); return; }
  if (a !== 'gecici') anlik(this.a);
  var p = this.nokta(e);
  this.cizgi = { a: a, r: a === 'fosfor' ? d.fosfor : d.renk, k: d.kalin, p: [p[0], p[1]] };
  if (a === 'gecici') this.cizgi.g = Date.now();
  this.liste().push(this.cizgi);
  this.ciz();
  if (a === 'gecici') geciciDongu();
};
Yuzey.prototype.surukle = function(e){
  if (d.arac === 'silgi') silgiIz(e, this);
  if (this.silgiliyor) { this.sil(this.nokta(e)); return; }
  if (!this.cizgi) return;
  var ol = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
  if (!ol || !ol.length) ol = [e];
  var q = this.cizgi.p, r = this.c.getBoundingClientRect();
  for (var i = 0; i < ol.length; i++) {
    var p = this.nokta(ol[i]);
    /* Ara noktalar 3 px'te bir: hızlı çizgide silgi aradan geçmesin. */
    var lx = q[q.length - 2], ly = q[q.length - 1];
    var dx = (p[0] - lx) * r.width, dy = (p[1] - ly) * r.height;
    var adim = Math.floor(Math.sqrt(dx * dx + dy * dy) / 3);
    for (var k = 1; k < adim; k++) q.push(lx + (p[0] - lx) * k / adim, ly + (p[1] - ly) * k / adim);
    q.push(p[0], p[1]);
  }
  if (this.cizgi.g) this.cizgi.g = Date.now();
  this.ciz();
};
Yuzey.prototype.birak = function(){
  if (this.cizgi || this.silgiliyor) kaydet();
  this.cizgi = null; this.silgiliyor = false;
  silgiIzGizle();
};
/* GERÇEK SİLGİ: yalnız sürtülen yer siliniyor; çizgi oradan ikiye bölünüyor. */
Yuzey.prototype.sil = function(p){
  var r = this.c.getBoundingClientRect(), R = silgiYaricap(r.height), l = this.liste(), yeni = [], degisti = false;
  for (var i = 0; i < l.length; i++) {
    var s = l[i], q = s.p, parca = [], parcalar = [], kesildi = false;
    for (var j = 0; j < q.length; j += 2) {
      var dx = (q[j] - p[0]) * r.width, dy = (q[j + 1] - p[1]) * r.height;
      if (dx * dx + dy * dy <= R * R) { kesildi = true; if (parca.length) { parcalar.push(parca); parca = []; } }
      else parca.push(q[j], q[j + 1]);
    }
    if (!kesildi) { yeni.push(s); continue; }
    degisti = true;
    if (parca.length) parcalar.push(parca);
    parcalar.forEach(function(pp){ if (pp.length >= 4) yeni.push({ a: s.a, r: s.r, k: s.k, g: s.g, p: pp }); });
  }
  if (degisti) { cizimler[this.a] = yeni; this.ciz(); }
};
Yuzey.prototype.olcu = function(){
  var o = window.devicePixelRatio || 1, b = this.boyut();
  var w = Math.max(1, Math.round(b.w * o)), h = Math.max(1, Math.round(b.h * o));
  if (this.c.width !== w || this.c.height !== h) { this.c.width = w; this.c.height = h; }
};
Yuzey.prototype.ciz = function(){
  this.olcu();
  var c = this.c, x = c.getContext('2d'), w = c.width, h = c.height, l = this.liste(), simdi = Date.now();
  var o = window.devicePixelRatio || 1;
  x.clearRect(0, 0, w, h);
  x.lineCap = 'round'; x.lineJoin = 'round';
  var taban = Math.min(w, h * 0.75);
  for (var i = 0; i < l.length; i++) {
    var s = l[i], p = s.p, k = s.k || 1, alfa = 1;
    if (s.g) { var gecen = simdi - s.g; alfa = gecen < GECICI_BEKLE ? 1 : Math.max(0, 1 - (gecen - GECICI_BEKLE) / GECICI_SON); }
    if (s.a === 'fosfor') {
      x.globalAlpha = 0.4; x.globalCompositeOperation = 'multiply'; x.lineWidth = taban * 0.024 * k; x.shadowBlur = 0;
    } else {
      x.globalAlpha = alfa; x.globalCompositeOperation = 'source-over'; x.lineWidth = Math.max(2, taban * 0.0042 * k);
      if (s.g) { x.shadowColor = s.r; x.shadowBlur = 14 * o; } else x.shadowBlur = 0;
    }
    x.strokeStyle = s.r;
    x.beginPath();
    x.moveTo(p[0] * w, p[1] * h);
    if (p.length === 2) x.lineTo(p[0] * w + 0.1, p[1] * h);
    for (var j = 2; j < p.length; j += 2) x.lineTo(p[j] * w, p[j + 1] * h);
    x.stroke();
  }
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.shadowBlur = 0;
};

/* ---------- geçici kalem: birkaç saniyede kendiliğinden siliniyor ---------- */
var geciciCalisiyor = false;
function geciciDongu(){
  if (geciciCalisiyor) return;
  geciciCalisiyor = true;
  requestAnimationFrame(function adim(){
    var simdi = Date.now(), kalan = false;
    Object.keys(bagli).forEach(function(a){
      var y = bagli[a], l = cizimler[a];
      if (!l) return;
      var var_ = false;
      for (var i = l.length - 1; i >= 0; i--) {
        if (!l[i].g) continue;
        if (y.cizgi === l[i]) { var_ = true; continue; }
        if (simdi - l[i].g > GECICI_BEKLE + GECICI_SON) l.splice(i, 1);
        var_ = true;
      }
      if (var_) { kalan = true; y.ciz(); }
    });
    if (kalan) requestAnimationFrame(adim); else geciciCalisiyor = false;
  });
}

/* ---------- silgi izi (dokunmatikte imleç görünmüyor) ---------- */
function silgiIz(e, y){
  var iz = $('zk-silgi-iz'), R = silgiYaricap(y.c.getBoundingClientRect().height);
  iz.hidden = false;
  iz.style.width = iz.style.height = (2 * R) + 'px';
  iz.style.left = (e.clientX - R) + 'px'; iz.style.top = (e.clientY - R) + 'px';
}
function silgiIzGizle(){ $('zk-silgi-iz').hidden = true; }

/* ---------- nesneler: şekil, sembol, yazı ---------- */
var sayac = 0;
function yeniId(){ sayac++; return 'n' + Date.now().toString(36) + sayac; }
Yuzey.prototype.nesneleriKur = function(){
  var s = this;
  this.katman.innerHTML = '';
  this.nl().forEach(function(o){ s.katman.appendChild(nesneEl(s, o)); });
};
function konumla(e, o){
  e.style.left = (o.x * 100) + '%'; e.style.top = (o.y * 100) + '%';
  if (o.t === 'sekil') { e.style.width = (o.w * 100) + '%'; e.style.height = (o.h * 100) + '%'; }
  else e.style.fontSize = (o.fs * 100) + 'cqh';
  e.style.transform = o.r ? 'rotate(' + o.r + 'deg)' : '';
}
function nesneEl(y, o){
  var e = el('div', 'nesne');
  e.setAttribute('data-nesne', o.id);
  konumla(e, o);
  if (o.t === 'sekil') {
    var sk = SEKMAP[o.s];
    if (sk) e.innerHTML = '<svg viewBox="0 0 ' + sk.en + ' ' + sk.boy + '" preserveAspectRatio="none">' + sk.svg + '</svg>';
    if (!sk || !sk.sabit) e.style.color = o.c;
  } else {
    var ic = el('div', 'yazi-ic'); ic.textContent = o.s; e.appendChild(ic); e.style.color = o.c;
  }
  if (d.secili && d.secili.id === o.id) tutamaklar(y, e, o);
  ['mousedown', 'touchstart'].forEach(function(t){
    e.addEventListener(t, function(ev){ if (d.arac === 'sec') ev.stopPropagation(); }, { passive: true });
  });
  e.addEventListener('pointerdown', function(ev){
    if (d.arac !== 'sec' || e.classList.contains('duzenleniyor')) return;
    ev.stopPropagation(); ev.preventDefault();
    if (!(d.secili && d.secili.id === o.id)) { d.secili = { a: y.a, id: o.id }; tumNesneleriYenile(); }
    tutBasla(y, o, ev, 'tasi');
  });
  e.addEventListener('dblclick', function(){ if (o.t === 'yazi' && d.arac === 'sec') yaziDuzenle(y, o); });
  return e;
}
function tutamaklar(y, e, o){
  e.classList.add('secili');
  var t1 = el('button', 'tut tut-sil'); t1.type = 'button'; t1.title = 'Sil'; t1.innerHTML = SIMGE.kapat;
  var t2 = el('button', 'tut tut-boyut'); t2.type = 'button'; t2.title = 'Büyüt / küçült';
  t2.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M21 21 13 13M21 21h-6M21 21v-6M3 3l8 8M3 3h6M3 3v6"/></svg>';
  var t3 = el('button', 'tut tut-dondur'); t3.type = 'button'; t3.title = 'Döndür';
  t3.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>';
  [t1, t2, t3].forEach(function(t){
    ['mousedown', 'touchstart'].forEach(function(ty){ t.addEventListener(ty, function(ev){ ev.stopPropagation(); }, { passive: true }); });
    e.appendChild(t);
  });
  t1.addEventListener('pointerdown', function(ev){ ev.stopPropagation(); });
  t1.addEventListener('click', function(ev){ ev.stopPropagation(); nesneSil(y, o); });
  t2.addEventListener('pointerdown', function(ev){ ev.stopPropagation(); ev.preventDefault(); tutBasla(y, o, ev, 'boyut'); });
  t3.addEventListener('pointerdown', function(ev){ ev.stopPropagation(); ev.preventDefault(); tutBasla(y, o, ev, 'dondur'); });
}
function nesneSil(y, o){
  anlik(y.a);
  var l = y.nl(), i = l.indexOf(o);
  if (i >= 0) l.splice(i, 1);
  d.secili = null; y.nesneleriKur(); kaydet();
}
function tutBasla(y, o, ev, tur){
  var r = y.kap.getBoundingClientRect();
  var dom = y.katman.querySelector('[data-nesne="' + o.id + '"]');
  var dr = dom.getBoundingClientRect();
  var bas = { x: ev.clientX, y: ev.clientY, o: JSON.parse(JSON.stringify(o)), h: dr.height, cx: dr.left + dr.width / 2, cy: dr.top + dr.height / 2 };
  var ilk = true;
  function hareket(e){
    var dx = (e.clientX - bas.x) / r.width, dy = (e.clientY - bas.y) / r.height;
    if (ilk) { if (Math.abs(e.clientX - bas.x) + Math.abs(e.clientY - bas.y) < 3) return; anlik(y.a); ilk = false; }
    /* Nesne sayfanın İÇİNDE kalıyor: dışarı taşınan şeklin tutamaçları
       sayfanın kenarında kesilip görünmez oluyordu. */
    var kenar = function(v, en){ return Math.max(0, Math.min(1 - en, v)); };
    if (tur === 'tasi') {
      if (o.t === 'sekil') { o.x = kenar(bas.o.x + dx, o.w); o.y = kenar(bas.o.y + dy, o.h); }
      else { o.x = kenar(bas.o.x + dx, 0.04); o.y = kenar(bas.o.y + dy, 0.04); }
    }
    else if (tur === 'boyut') {
      if (o.t === 'sekil') { o.w = Math.min(1 - o.x, Math.max(0.02, bas.o.w + dx)); o.h = Math.min(1 - o.y, Math.max(0.015, bas.o.h + dy)); }
      else o.fs = Math.max(0.01, bas.o.fs * Math.max(0.15, (bas.h + (e.clientY - bas.y)) / bas.h));
    } else {
      var aci = Math.atan2(e.clientY - bas.cy, e.clientX - bas.cx) * 180 / Math.PI + 90;
      var yuv = Math.round(aci / 15) * 15;
      o.r = Math.abs(aci - yuv) < 4 ? yuv : Math.round(aci);
    }
    konumla(dom, o);
  }
  function bitir(){
    window.removeEventListener('pointermove', hareket);
    window.removeEventListener('pointerup', bitir);
    window.removeEventListener('pointercancel', bitir);
    if (!ilk) kaydet();
  }
  window.addEventListener('pointermove', hareket);
  window.addEventListener('pointerup', bitir);
  window.addEventListener('pointercancel', bitir);
}
function tumNesneleriYenile(){ Object.keys(bagli).forEach(function(a){ bagli[a].nesneleriKur(); }); }
function secimKaldir(){ if (!d.secili) return; d.secili = null; tumNesneleriYenile(); }
function seciliNesne(){
  if (!d.secili) return null;
  var y = bagli[d.secili.a]; if (!y) return null;
  var o = y.nl().filter(function(x){ return x.id === d.secili.id; })[0];
  return o ? { y: y, o: o } : null;
}
Yuzey.prototype.yaziEkle = function(p){
  anlik(this.a);
  var o = { id: yeniId(), t: 'yazi', s: '', x: p[0], y: Math.max(0, p[1] - 0.025), fs: 0.04, r: 0, c: d.renk };
  this.nl().push(o);
  this.nesneleriKur();
  yaziDuzenle(this, o);
};
function yaziDuzenle(y, o){
  var e = y.katman.querySelector('[data-nesne="' + o.id + '"]');
  if (!e) return;
  var ic = e.querySelector('.yazi-ic');
  e.classList.add('duzenleniyor');
  ic.contentEditable = 'true';
  setTimeout(function(){
    ic.focus();
    try { var sec = window.getSelection(), rg = document.createRange(); rg.selectNodeContents(ic); sec.removeAllRanges(); sec.addRange(rg); } catch (_) {}
  }, 0);
  function bitir(){
    ic.removeEventListener('blur', bitir);
    ic.contentEditable = 'false';
    var t = (ic.innerText || '').replace(/\n+$/, '');
    if (!t.trim()) { var l = y.nl(), i = l.indexOf(o); if (i >= 0) l.splice(i, 1); }
    else o.s = t;
    y.nesneleriKur(); kaydet();
  }
  ic.addEventListener('blur', bitir);
  ic.addEventListener('keydown', function(ev){ ev.stopPropagation(); if (ev.key === 'Escape') ic.blur(); });
  ['mousedown', 'touchstart', 'pointerdown'].forEach(function(t){ ic.addEventListener(t, function(ev){ ev.stopPropagation(); }, { passive: true }); });
}
/* Şekil ve sembol nereye konur: EKRANIN TAMAMINA (soru ekranında soru alanı,
   kitapta açık çift sayfanın üstü ve kenarları). Yalnız büyütülmüş düz
   görünümde ekran katmanı yok; orada sayfaya. */
function hedefYuzey(){
  if (d.tahta >= 0) return bagli['t' + d.tahta];
  if (d.soru >= 0) return bagli[soruAnahtari(d.soru) + '~e'] || bagli[soruAnahtari(d.soru)];
  if (kitapKatmani) return kitapKatmani;
  var g = gorunenler();
  if (sonAnahtar && sonAnahtar.charAt(0) === 'p' && g.indexOf(+sonAnahtar.slice(1)) >= 0) return bagli[sonAnahtar];
  return bagli['p' + g[0]];
}
function sekilEkle(k){
  var y = hedefYuzey(), sk = SEKMAP[k];
  if (!y || !sk) return;
  var b = y.boyut(), oran = sk.en / sk.boy, A = Math.pow(Math.min(b.w, b.h) * 0.34, 2);
  var wpx = Math.sqrt(A * oran), hpx = Math.sqrt(A / oran);
  var sinir = Math.min(1, (b.w * 0.85) / wpx, (b.h * 0.85) / hpx);
  wpx *= sinir; hpx *= sinir;
  var o = { id: yeniId(), t: 'sekil', s: k, x: 0.5 - wpx / b.w / 2, y: 0.5 - hpx / b.h / 2, w: wpx / b.w, h: hpx / b.h, r: 0, c: d.renk };
  anlik(y.a); y.nl().push(o);
  d.secili = { a: y.a, id: o.id };
  aracSec('sec'); tumNesneleriYenile(); kaydet();
}
function sembolEkle(s){
  var y = hedefYuzey();
  if (!y) return;
  var o = { id: yeniId(), t: 'yazi', s: s, x: 0.45, y: 0.44, fs: 0.07, r: 0, c: d.renk };
  anlik(y.a); y.nl().push(o);
  d.secili = { a: y.a, id: o.id };
  aracSec('sec'); tumNesneleriYenile(); kaydet();
}

/* ---------- sayfa ---------- */
function sayfaElemani(si, duz){
  var s = Z.sayfalar[si];
  var k = el('div', 'sayfa' + (duz ? ' duz' : ''));
  k.setAttribute('data-sayfa', si + 1);
  var im = el('img'); im.alt = 'Sayfa ' + (si + 1); im.draggable = false; im.decoding = 'async'; im.src = s.g;
  k.appendChild(im);
  Z.sorular.forEach(function(q, qi){
    if (q.s !== si) return;
    var b = el('button', 'bolge'); b.type = 'button';
    b.style.left = (q.x * 100) + '%'; b.style.top = (q.y * 100) + '%';
    b.style.width = (q.w * 100) + '%'; b.style.height = (q.h * 100) + '%';
    b.setAttribute('aria-label', q.ad + ' — büyütmek için dokunun');
    b.setAttribute('data-soru', qi);
    b.addEventListener('click', function(){ if (d.arac === 'sec') soruAc(qi); });
    k.appendChild(b);
  });
  return k;
}
function olcu(){
  var s = Z.sayfalar[0];
  var H = alan.clientHeight - 32, W = alan.clientWidth - 184;
  var pw0 = H * s.en / s.boy;
  var cift = n > 1 && (d.cift === null ? 2 * pw0 <= W : d.cift);
  var k = Math.min(1, W / (cift ? 2 * pw0 : pw0));
  return { pw: Math.floor(pw0 * k), ph: Math.floor(H * k), cift: cift };
}
function sayfaBaglariniSil(){ Object.keys(bagli).forEach(function(a){ if (a.charAt(0) === 'p') delete bagli[a]; }); }
function gorunenler(){
  if (kitap) {
    var i = kitap.getCurrentPageIndex();
    if (kitap.getOrientation() === 'landscape') { var b = i - (i % 2); return b + 1 < n ? [b, b + 1] : [b]; }
    return [i];
  }
  if (!olcu().cift) return [d.sayfa];
  var b2 = d.sayfa - (d.sayfa % 2);
  return b2 + 1 < n ? [b2, b2 + 1] : [b2];
}
var cevriliyor = false;
function kitapKur(){
  if (kitap) { try { kitap.destroy(); } catch (e) {} kitap = null; }
  dizi.innerHTML = '';
  sayfaBaglariniSil();
  var o = olcu();
  var kap = el('div', 'kitap');
  kap.style.width = (o.cift ? 2 * o.pw : o.pw) + 'px'; kap.style.height = o.ph + 'px';
  dizi.appendChild(kap);
  var sayfalar = [];
  for (var i = 0; i < n; i++) {
    var e = sayfaElemani(i, false);
    sayfalar.push(e);
    new Yuzey(e, 'p' + i, { w: o.pw, h: o.ph });
  }
  if (o.cift) d.sayfa -= d.sayfa % 2;
  kitap = new St.PageFlip(kap, {
    width: o.pw, height: o.ph, size: 'fixed', autoSize: false, showCover: false, usePortrait: true,
    drawShadow: true, maxShadowOpacity: 0.5, flippingTime: 850, mobileScrollSupport: false,
    clickEventForward: true, disableFlipByClick: true, showPageCorners: d.arac === 'sec',
    useMouseEvents: true, swipeDistance: 40, startPage: d.sayfa, startZIndex: 0
  });
  kitap.loadFromHTML(sayfalar);
  kitap.on('flip', function(e){ d.sayfa = e.data; durumYaz(); });
  kitap.on('changeState', function(e){
    if (e.data === 'user_fold' || e.data === 'flipping') { if (!cevriliyor) { cevriliyor = true; hisirti(); } }
    else if (e.data === 'read') cevriliyor = false;
  });
  Object.keys(bagli).forEach(function(a){ if (a.charAt(0) === 'p') bagli[a].ciz(); });
  durumYaz();
}
function statikCiz(){
  if (kitap) { try { kitap.destroy(); } catch (e) {} kitap = null; }
  sayfaBaglariniSil();
  var gor = gorunenler();
  var H = alan.clientHeight - 32, top = 0;
  gor.forEach(function(i){ top += H * Z.sayfalar[i].en / Z.sayfalar[i].boy; });
  top += (gor.length - 1) * 18;
  var k = Math.min(1, (alan.clientWidth - 184) / top) * d.yakin;
  dizi.innerHTML = '';
  gor.forEach(function(si){
    var s = Z.sayfalar[si];
    var e = sayfaElemani(si, true);
    e.style.width = Math.round(H * k * s.en / s.boy) + 'px'; e.style.height = Math.round(H * k) + 'px';
    dizi.appendChild(e);
    new Yuzey(e, 'p' + si).ciz();
  });
  durumYaz();
}
function ciz(){
  if (d.yakin === 1) kitapKur(); else statikCiz();
  perdeYerlestir();
}
/** Ekran katmanı kurar: kabı kaplar, alttaki yüzeylere yönlendirir. */
function ekranKatmani(kap, anahtar, adaylar){
  var div = el('div', 'ekran-katmani');
  kap.appendChild(div);
  var y = new Yuzey(div, anahtar);
  y.yonlendir = adaylar;
  y.ciz();
  return y;
}
/* Kitap görünümünde katman açık çift sayfaya ait: sayfa dönünce o çiftin
   kenar çizimleri gelir. Büyütülmüş düz görünümde katman yok (kaydırma). */
var kitapKatmani = null;
function kitapKatmaniYenile(){
  if (kitapKatmani) { kitapKatmani.kap.remove(); delete bagli[kitapKatmani.a]; kitapKatmani = null; }
  if (!kitap || d.soru >= 0 && SORU_MODU) return;
  var gor = gorunenler();
  kitapKatmani = ekranKatmani(alan, 'p~' + gor.join('-'), function(){
    return gorunenler().map(function(i){ return bagli['p' + i]; }).filter(Boolean);
  });
}
function durumYaz(){
  kitapKatmaniYenile();
  var gor = gorunenler(), son = gor[gor.length - 1];
  $('zk-sayfano').textContent = (gor.length > 1 ? (gor[0] + 1) + '–' + (son + 1) : (gor[0] + 1)) + ' / ' + n;
  $('zk-onceki').disabled = gor[0] === 0;
  $('zk-sonraki').disabled = son >= n - 1;
  $('zk-cift').setAttribute('aria-pressed', gor.length > 1 ? 'true' : 'false');
}
function git(yon){
  if (kitap) {
    if (yon > 0) kitap.flipNext('top'); else kitap.flipPrev('top');
    return;
  }
  var adim = olcu().cift ? 2 : 1;
  var hedef = Math.max(0, Math.min(n - 1, d.sayfa + yon * adim));
  if (olcu().cift) hedef -= hedef % 2;
  if (hedef === d.sayfa) return;
  d.sayfa = hedef; alan.scrollTop = 0; alan.scrollLeft = 0; statikCiz(); hisirti();
}
function sayfayaGit(i, sessiz){
  if (kitap) {
    kitap.turnToPage(i);
    d.sayfa = kitap.getCurrentPageIndex();
    durumYaz();
    Object.keys(bagli).forEach(function(a){ if (a.charAt(0) === 'p') bagli[a].ciz(); });
  } else { d.sayfa = olcu().cift ? i - (i % 2) : i; statikCiz(); }
  if (!sessiz) hisirti();
}

/* ---------- ses: gerçek kâğıt hışırtısı (kamu malı kayıt) ---------- */
var sesOge = null;
function hisirti(){
  if (!d.ses) return;
  try {
    if (!sesOge) sesOge = new Audio($('zk-ses').getAttribute('data-src'));
    var a = sesOge.cloneNode(); a.volume = 0.75;
    var p = a.play(); if (p && p.catch) p.catch(function(){});
  } catch (e) {}
}

/* ---------- araçlar ---------- */
var CIZIM_ARACLARI = ['sec', 'kalem', 'fosfor', 'gecici', 'lazer', 'silgi', 'yazi'];
function svgImlec(ic, x, y, yedek){
  return 'url("data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>" + ic + '</svg>') + '") ' + x + ' ' + y + ', ' + yedek;
}
function kalemSvg(renk, govde){
  return "<g transform='translate(2 38) rotate(-45)'>" +
    "<polygon points='0,0 6,-2.2 6,2.2' fill='" + renk + "' stroke='#111' stroke-width='.6'/>" +
    "<polygon points='6,-2.2 12,-5 12,5 6,2.2' fill='#f3d5ab' stroke='#7c5a2b' stroke-width='.8'/>" +
    "<rect x='12' y='-5' width='24' height='10' fill='" + govde + "' stroke='#1f2937' stroke-width='1'/>" +
    "<line x1='12' y1='-1.7' x2='36' y2='-1.7' stroke='rgba(0,0,0,.18)'/><line x1='12' y1='1.7' x2='36' y2='1.7' stroke='rgba(0,0,0,.18)'/>" +
    "<rect x='36' y='-5' width='3.5' height='10' fill='#cbd5e1' stroke='#1f2937' stroke-width='.8'/>" +
    "<rect x='39.5' y='-5' width='6' height='10' rx='2.5' fill='#f9a8d4' stroke='#1f2937' stroke-width='.8'/></g>";
}
function imlecleriGuncelle(){
  var s = kok.style;
  s.setProperty('--imlec-kalem', svgImlec(kalemSvg(d.renk, d.renk), 2, 38, 'crosshair'));
  s.setProperty('--imlec-gecici', svgImlec(kalemSvg(d.renk, '#a855f7') +
    "<path d='M31 3 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6z' fill='#facc15' stroke='#a16207' stroke-width='.6'/>", 2, 38, 'crosshair'));
  s.setProperty('--imlec-fosfor', svgImlec("<g transform='translate(3 37) rotate(-45)'>" +
    "<polygon points='0,-4.5 0,4.5 6,7 6,-7' fill='" + d.fosfor + "' stroke='#1f2937' stroke-width='.9'/>" +
    "<rect x='6' y='-8.5' width='5' height='17' fill='#374151'/>" +
    "<rect x='11' y='-8.5' width='30' height='17' rx='3' fill='" + d.fosfor + "' stroke='#1f2937' stroke-width='1.1'/>" +
    "<rect x='15' y='-4' width='20' height='8' rx='2' fill='rgba(255,255,255,.45)'/></g>", 3, 37, 'crosshair'));
  s.setProperty('--imlec-silgi', svgImlec("<g transform='rotate(-35 20 20)'>" +
    "<rect x='4' y='12' width='32' height='16' rx='3' fill='#f9a8d4' stroke='#1f2937' stroke-width='1.3'/>" +
    "<rect x='20' y='12' width='16' height='16' fill='#60a5fa' stroke='#1f2937' stroke-width='1.3'/></g>", 20, 20, 'cell'));
}
function renkleriKur(){
  var kap = $('zk-renkler'), liste = d.arac === 'fosfor' ? FOSFOR_RENK : KALEM_RENK, secili = d.arac === 'fosfor' ? d.fosfor : d.renk;
  kap.innerHTML = '';
  liste.forEach(function(r){
    var b = el('button', 'renk'); b.type = 'button'; b.style.background = r;
    b.setAttribute('aria-label', 'Renk'); b.setAttribute('data-renk', r);
    b.setAttribute('aria-pressed', r === secili ? 'true' : 'false');
    b.addEventListener('click', function(){
      var sn = seciliNesne();
      if (sn && d.arac === 'sec') { anlik(sn.y.a); sn.o.c = r; sn.y.nesneleriKur(); kaydet(); }
      if (d.arac === 'fosfor') d.fosfor = r; else d.renk = r;
      if (['kalem', 'fosfor', 'gecici', 'yazi'].indexOf(d.arac) < 0 && !sn) aracSec('kalem');
      else renkleriKur();
      imlecleriGuncelle();
    });
    kap.appendChild(b);
  });
}
function aracSec(a){
  if (a !== 'sec') secimKaldir();
  d.arac = a; kok.setAttribute('data-arac', a);
  document.querySelectorAll('.arac').forEach(function(b){
    var x = b.getAttribute('data-arac');
    if (CIZIM_ARACLARI.indexOf(x) >= 0) b.setAttribute('aria-pressed', x === a ? 'true' : 'false');
  });
  if (kitap) { try { kitap.getSettings().showPageCorners = a === 'sec'; } catch (e) {} }
  renkleriKur();
}
function etkinYuzeyler(){
  if (d.tahta >= 0) return [bagli['t' + d.tahta]];
  if (d.soru >= 0) return [bagli[soruAnahtari(d.soru)], bagli[soruAnahtari(d.soru) + '~e']].filter(Boolean);
  return gorunenler().map(function(i){ return bagli['p' + i]; }).concat(kitapKatmani ? [kitapKatmani] : []).filter(Boolean);
}
function temizle(){
  var ys = etkinYuzeyler();
  anlik(ys.map(function(y){ return y.a; }));
  ys.forEach(function(y){ cizimler[y.a] = []; nesneler[y.a] = []; y.ciz(); y.nesneleriKur(); });
  d.secili = null; kaydet();
}
function kalinliklariKur(){
  var kap = $('zk-kalinlik'); kap.innerHTML = '';
  KALINLIK.forEach(function(k, i){
    var b = el('button', 'kalin'); b.type = 'button';
    b.setAttribute('aria-label', ['İnce', 'Orta', 'Kalın'][i]); b.title = ['İnce', 'Orta', 'Kalın'][i];
    b.setAttribute('aria-pressed', k === d.kalin ? 'true' : 'false');
    var nk = el('i'); nk.style.width = nk.style.height = (5 + i * 5) + 'px'; b.appendChild(nk);
    b.addEventListener('click', function(){ d.kalin = k; kalinliklariKur(); if (['kalem', 'fosfor', 'gecici'].indexOf(d.arac) < 0) aracSec('kalem'); });
    kap.appendChild(b);
  });
}

/* ---------- perde ---------- */
var perdeY = null;
/* Perde ekranın sabit bir katmanı: sayfanın da, büyütülen sorunun da,
   boş tahtanın da üstüne iniyor. */
function perdeAlani(){
  var ust = SORU_MODU || d.tahta >= 0 || d.soru >= 0 ? kok.querySelector('.ust').offsetHeight * (SORU_MODU ? 1 : 0) : kok.querySelector('.ust').offsetHeight;
  var alt = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--alt')) || 0;
  return { ust: ust, boy: innerHeight - ust - alt };
}
function perdeYerlestir(){
  var p = $('zk-perde');
  if (p.hidden) return;
  var a = perdeAlani();
  if (perdeY === null) perdeY = Math.round(a.boy * 0.3);
  perdeY = Math.max(30, Math.min(a.boy - 30, perdeY));
  p.style.top = (a.ust + perdeY) + 'px';
}
function dugmeBasili(a, b){ var x = document.querySelector('.arac[data-arac="' + a + '"]'); if (x) x.setAttribute('aria-pressed', b ? 'true' : 'false'); }
function perdeAcKapa(){
  var p = $('zk-perde'); p.hidden = !p.hidden;
  dugmeBasili('perde', !p.hidden);
  perdeYerlestir();
}
(function(){
  var t = document.querySelector('#zk-perde .tutamak'), bas = null;
  ['mousedown', 'touchstart'].forEach(function(ty){ $('zk-perde').addEventListener(ty, function(e){ e.stopPropagation(); }, { passive: true }); });
  t.addEventListener('pointerdown', function(e){ e.preventDefault(); t.setPointerCapture(e.pointerId); bas = { y: e.clientY, p: perdeY }; });
  t.addEventListener('pointermove', function(e){ if (!bas) return; perdeY = bas.p + e.clientY - bas.y; perdeYerlestir(); });
  t.addEventListener('pointerup', function(){ bas = null; });
  t.addEventListener('pointercancel', function(){ bas = null; });
})();

/* ---------- spot ışığı ---------- */
var spot = { x: 0.5, y: 0.45, r: 150 };
function spotCiz(){
  var e = $('zk-spot'), w = e.clientWidth, h = e.clientHeight;
  var x = spot.x * w, y = spot.y * h;
  e.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, transparent ' + spot.r + 'px, rgba(8,10,14,.86) ' + (spot.r + 3) + 'px)';
}
function spotAcKapa(ac){
  var e = $('zk-spot');
  e.hidden = ac === undefined ? !e.hidden : !ac;
  dugmeBasili('spot', !e.hidden);
  if (!e.hidden) spotCiz();
}
(function(){
  var e = $('zk-spot'), basili = false;
  function tasi(ev){ var r = e.getBoundingClientRect(); spot.x = (ev.clientX - r.left) / r.width; spot.y = (ev.clientY - r.top) / r.height; spotCiz(); }
  e.addEventListener('pointerdown', function(ev){ if (ev.target.closest('.spot-kumanda')) return; basili = true; e.setPointerCapture(ev.pointerId); tasi(ev); });
  e.addEventListener('pointermove', function(ev){ if (basili) tasi(ev); });
  e.addEventListener('pointerup', function(){ basili = false; });
  e.addEventListener('pointercancel', function(){ basili = false; });
  $('zk-spot-buyut').addEventListener('click', function(){ spot.r = Math.min(600, spot.r * 1.25); spotCiz(); });
  $('zk-spot-kucult').addEventListener('click', function(){ spot.r = Math.max(50, spot.r / 1.25); spotCiz(); });
  $('zk-spot-kapat').addEventListener('click', function(){ spotAcKapa(false); });
})();

/* ---------- lazer ----------
   Kullanıcı (15 Eki 2026): "lazeri seçtim bırakamadım, bir de arkasında iz
   bırakmasın." Önce ekranı kaplayan bir katman açılıyordu; düğmelerin de
   üstüne biniyordu (sonraki soru, cevap, üst şerit) ve fare bırakılınca
   nokta izlemeyi sürdürüyordu. Şimdi: katman yok, olaylar belgeden
   dinleniyor; nokta YALNIZ basılıyken, iz yok. */
(function(){
  var cv = $('zk-lazer'), basili = false, nokta = null;
  function olc(){ var o = window.devicePixelRatio || 1; cv.width = Math.round(innerWidth * o); cv.height = Math.round(innerHeight * o); }
  function ciz(){
    var o = window.devicePixelRatio || 1, x = cv.getContext('2d');
    if (cv.width !== Math.round(innerWidth * o)) olc();
    x.clearRect(0, 0, cv.width, cv.height);
    if (!basili || !nokta || d.arac !== 'lazer') return;
    x.shadowBlur = 22 * o; x.shadowColor = '#ff2020';
    x.fillStyle = '#ff2a2a'; x.beginPath(); x.arc(nokta.x * o, nokta.y * o, 9 * o, 0, Math.PI * 2); x.fill();
    x.shadowBlur = 0; x.fillStyle = '#ffe4e4'; x.beginPath(); x.arc(nokta.x * o, nokta.y * o, 3.5 * o, 0, Math.PI * 2); x.fill();
  }
  /* Düğmeler, paneller, araç çubuğu: lazer onlara karışmıyor. */
  function icerik(t){ return t && t.closest && !t.closest('button:not(.bolge), .panel, #zk-alt, .ust, .sahne-ust, .sahne-alt, #zk-bilgi, .tutamak, #zk-spot .spot-kumanda'); }
  /* Lazerdeyken sayfa bükülmesin, soru açılmasın: olay içeriğe hiç inmiyor. */
  ['mousedown', 'touchstart'].forEach(function(t){
    document.addEventListener(t, function(e){ if (d.arac === 'lazer' && icerik(e.target)) e.stopPropagation(); }, { capture: true, passive: true });
  });
  document.addEventListener('pointerdown', function(e){
    if (d.arac !== 'lazer' || !icerik(e.target)) return;
    basili = true; nokta = { x: e.clientX, y: e.clientY }; ciz();
  }, true);
  document.addEventListener('pointermove', function(e){
    if (!basili) return;
    nokta = { x: e.clientX, y: e.clientY }; ciz();
  }, true);
  function birak(){ if (!basili) return; basili = false; ciz(); }
  document.addEventListener('pointerup', birak, true);
  document.addEventListener('pointercancel', birak, true);
  window.addEventListener('blur', birak);
  window.addEventListener('resize', olc);
  olc();
})();

/* ---------- tepkiler: konfeti, yüz puan, doğru, yanlış ----------
   Sesler burada üretiliyor (WebAudio): internet gerekmez, telif yok. */
var sesBaglami = null;
function sesCal(notalar){
  if (!d.ses) return;
  try {
    var A = window.AudioContext || window.webkitAudioContext;
    if (!sesBaglami) sesBaglami = new A();
    var a = sesBaglami; if (a.state === 'suspended') a.resume();
    notalar.forEach(function(n){
      var o = a.createOscillator(), g = a.createGain(), t = a.currentTime + n.t;
      o.type = n.tur || 'sine'; o.frequency.setValueAtTime(n.f, t);
      if (n.f2) o.frequency.linearRampToValueAtTime(n.f2, t + n.s);
      var ses = n.v || 0.22;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(ses, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + n.s);
      if (n.suz) { var f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = n.suz; o.connect(f); f.connect(g); } else o.connect(g);
      g.connect(a.destination);
      o.start(t); o.stop(t + n.s + 0.05);
    });
  } catch (e) {}
}
var SESLER = {
  konfeti: [ { f: 523, t: 0, s: .16, tur: 'triangle' }, { f: 659, t: .12, s: .16, tur: 'triangle' }, { f: 784, t: .24, s: .16, tur: 'triangle' },
    { f: 1047, t: .36, s: .5, tur: 'triangle', v: .26 }, { f: 784, t: .36, s: .5, tur: 'triangle', v: .14 }, { f: 1319, t: .36, s: .4, tur: 'sine', v: .08 } ],
  yuz: [ { f: 1319, t: 0, s: .35, v: .2 }, { f: 1760, t: .14, s: .6, v: .2 }, { f: 2637, t: .14, s: .5, v: .05 } ],
  dogru: [ { f: 784, t: 0, s: .25, tur: 'triangle', v: .25 }, { f: 1175, t: .11, s: .5, tur: 'triangle', v: .25 } ],
  yanlis: [ { f: 150, f2: 110, t: 0, s: .45, tur: 'sawtooth', v: .2, suz: 900 }, { f: 152, f2: 112, t: 0, s: .45, tur: 'square', v: .08, suz: 700 } ]
};
var DAMGALAR = {
  yuz: "<svg viewBox='0 0 300 220'><g transform='rotate(-6 150 110)'><text x='150' y='128' text-anchor='middle' font-size='118' font-weight='900' fill='#dc2626' font-family='Segoe UI,DejaVu Sans,sans-serif' letter-spacing='-4'>100</text>" +
    "<path d='M42 150c60 22 160 22 218-6' stroke='#dc2626' stroke-width='11' fill='none' stroke-linecap='round'/><path d='M58 178c52 16 140 14 186-8' stroke='#dc2626' stroke-width='9' fill='none' stroke-linecap='round'/></g>" +
    "<g fill='#facc15' stroke='#ca8a04' stroke-width='2'><path d='M30 40l6 13 14 2-10 10 2 14-12-7-12 7 2-14-10-10 14-2z'/><path d='M262 30l5 11 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2z'/><path d='M268 170l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z'/></g></svg>",
  dogru: "<svg viewBox='0 0 200 200'><circle cx='100' cy='100' r='88' fill='#16a34a'/><path d='M55 104l30 30 62-66' stroke='#fff' stroke-width='20' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>",
  yanlis: "<svg viewBox='0 0 200 200'><circle cx='100' cy='100' r='88' fill='#dc2626'/><path d='M64 64l72 72M136 64l-72 72' stroke='#fff' stroke-width='20' stroke-linecap='round'/></svg>"
};
function damgaGoster(tur){
  document.querySelectorAll('.damga').forEach(function(e){ e.remove(); });
  var e = el('div', 'damga ' + (tur === 'yanlis' ? 'salla' : 'giris'));
  e.setAttribute('data-damga', tur);
  e.innerHTML = DAMGALAR[tur];
  kok.appendChild(e);
  setTimeout(function(){ e.remove(); }, 2600);
}
var konfetiler = [], konfetiCalisiyor = false;
function konfetiPatlat(){
  var cv = $('zk-efekt'), o = window.devicePixelRatio || 1;
  cv.width = Math.round(innerWidth * o); cv.height = Math.round(innerHeight * o);
  var RENK = ['#f5811f', '#2563eb', '#16a34a', '#db2777', '#facc15', '#7c3aed', '#0ea5e9', '#ef4444'];
  [[0.04, 1], [0.96, -1]].forEach(function(k){
    for (var i = 0; i < 110; i++) {
      var aci = (-62 - Math.random() * 26) * Math.PI / 180, hiz = (14 + Math.random() * 13) * (innerHeight / 900);
      konfetiler.push({ x: innerWidth * k[0], y: innerHeight * 0.98, vx: Math.cos(aci) * hiz * k[1], vy: Math.sin(aci) * hiz,
        r: Math.random() * 360, vr: (Math.random() - .5) * 18, en: 7 + Math.random() * 7, boy: 10 + Math.random() * 9,
        renk: RENK[i % RENK.length], dogum: Date.now() });
    }
  });
  if (konfetiCalisiyor) return;
  konfetiCalisiyor = true;
  requestAnimationFrame(function kare(){
    var x = cv.getContext('2d'), simdi = Date.now();
    x.clearRect(0, 0, cv.width, cv.height);
    konfetiler = konfetiler.filter(function(p){ return simdi - p.dogum < 3200 && p.y < innerHeight + 40; });
    konfetiler.forEach(function(p){
      p.vy += 0.38 * (innerHeight / 900); p.vx *= 0.992; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      var omur = 1 - Math.max(0, (simdi - p.dogum - 2400) / 800);
      x.save(); x.globalAlpha = Math.max(0, omur); x.translate(p.x * o, p.y * o); x.rotate(p.r * Math.PI / 180);
      x.scale(1, Math.cos(p.r * Math.PI / 90)); x.fillStyle = p.renk;
      x.fillRect(-p.en * o / 2, -p.boy * o / 2, p.en * o, p.boy * o); x.restore();
    });
    if (konfetiler.length) requestAnimationFrame(kare); else { konfetiCalisiyor = false; x.clearRect(0, 0, cv.width, cv.height); }
  });
}
/* Baloncuk düğmenin hemen yanında: çubuk alttaysa üstünde, soldaysa sağında. */
function tepkiBaloncugu(dugme){
  var p = $('zk-tepki-panel');
  if (!p.hidden) { p.hidden = true; return; }
  panelleriKapat();
  p.hidden = false;
  var r = dugme.getBoundingClientRect(), w = p.offsetWidth, h = p.offsetHeight, x, y;
  p.classList.remove('yon-alt', 'yon-sol', 'yon-sag');
  if (yer === 'sol') { x = r.right + 12; y = r.top + r.height / 2 - h / 2; p.classList.add('yon-sol'); }
  else if (yer === 'sag') { x = r.left - 12 - w; y = r.top + r.height / 2 - h / 2; p.classList.add('yon-sag'); }
  else { x = r.left + r.width / 2 - w / 2; y = r.top - 12 - h; p.classList.add('yon-alt'); }
  p.style.left = Math.max(8, Math.min(innerWidth - w - 8, x)) + 'px';
  p.style.top = Math.max(8, Math.min(innerHeight - h - 8, y)) + 'px';
}
document.addEventListener('pointerdown', function(e){
  var p = $('zk-tepki-panel');
  if (!p.hidden && !e.target.closest('#zk-tepki-panel') && !e.target.closest('.arac[data-arac="tepki"]')) p.hidden = true;
}, true);
function tepki(tur){
  sesCal(SESLER[tur]);
  if (tur === 'konfeti') konfetiPatlat(); else damgaGoster(tur);
}
document.querySelectorAll('[data-tepki]').forEach(function(b){
  b.addEventListener('click', function(){ $('zk-tepki-panel').hidden = true; tepki(b.getAttribute('data-tepki')); });
});
window.__zkTepki = tepki;

/* ---------- süre ---------- */
var sure = { kalan: 0, toplam: 0, ileri: false, calisiyor: false, t: null };
function sureYaz(){
  var s = Math.max(0, sure.kalan), dk = Math.floor(s / 60), sn = s % 60;
  $('zk-sure').textContent = (dk < 10 ? '0' : '') + dk + ':' + (sn < 10 ? '0' : '') + sn;
  $('zk-sayac').classList.toggle('son', !sure.ileri && sure.kalan <= 10);
  $('zk-sure-dur').innerHTML = sure.calisiyor ? SIMGE.dur : SIMGE.oynat;
  $('zk-sure-dur').setAttribute('aria-label', sure.calisiyor ? 'Durdur' : 'Devam et');
}
function sureBaslat(dk){
  sureDurdur();
  sure.ileri = dk === 0; sure.kalan = Math.round(dk * 60); sure.toplam = sure.kalan;
  $('zk-sayac').hidden = false; $('zk-sayac').classList.remove('bitti');
  panelleriKapat();
  sure.calisiyor = true; sure.t = setInterval(tik, 1000); sureYaz();
}
function tik(){
  sure.kalan += sure.ileri ? 1 : -1;
  if (!sure.ileri && sure.kalan <= 0) { sure.kalan = 0; sureDurdur(); $('zk-sayac').classList.add('bitti'); bip(); }
  sureYaz();
}
function sureDurdur(){ sure.calisiyor = false; if (sure.t) clearInterval(sure.t); sure.t = null; }
function bip(){
  try {
    var A = window.AudioContext || window.webkitAudioContext, a = new A();
    [0, 0.45, 0.9].forEach(function(z){
      var o = a.createOscillator(), g = a.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(a.destination);
      g.gain.setValueAtTime(0.0001, a.currentTime + z);
      g.gain.exponentialRampToValueAtTime(0.3, a.currentTime + z + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + z + 0.35);
      o.start(a.currentTime + z); o.stop(a.currentTime + z + 0.4);
    });
  } catch (e) {}
}

/* ---------- soru sahnesi ---------- */
function sigdir(kw, kh, en, boy){ var k = Math.min(kw / en, kh / boy); return [Math.floor(en * k), Math.floor(boy * k)]; }
/* SORUNUN YERİ — sol / orta / sağ. Kâğıt sahnenin en çok %60'ını alıyor
   (16 Eki'den beri ortada da): geniş bir soruda da yanda yazı alanı kalsın.
   Cevap/çözüm yan yanayken (iki kâğıt) yaslama yok. */
var hiza = 'orta';
try { var kh = localStorage.getItem('foyevi-zk-hiza'); if (kh === 'sol' || kh === 'sag' || kh === 'orta') hiza = kh; } catch (e) {}
function hizaYaz(yanVar){
  Array.prototype.forEach.call(document.querySelectorAll('#zk-hiza [data-hiza]'), function(b){
    b.setAttribute('aria-pressed', b.getAttribute('data-hiza') === hiza ? 'true' : 'false');
    b.disabled = !!yanVar;
  });
}
function soruAc(i){
  tahtaKapat();
  if (d.soru >= 0) delete bagli[soruAnahtari(d.soru)];
  d.soru = i; d.cevap = false; d.cozum = false;
  $('zk-soru').hidden = false;
  sayacYerlestir();
  soruCiz();
}
/* SÜRE SAYACI GÖRÜNÜR KALSIN (kullanıcı, 15 Eki: "süre, soru tam ekranken
   çıkmıyor"). Sayaç üst şeritte; kitap modunda soru ve boş tahta ekranı
   onun üstünü kapatıyordu. O ekranlar açıkken sayaç kendi başlık satırına,
   "Kapat"ın yanına taşınıyor; kapanınca yerine dönüyor. */
function sayacYerlestir(){
  var s = $('zk-sayac'), hedef = null;
  if (!SORU_MODU) hedef = d.tahta >= 0 ? $('zk-tahta-kapat') : (d.soru >= 0 ? $('zk-soru-kapat') : null);
  if (!hedef) hedef = $('zk-sayfano');
  if (s.nextSibling !== hedef) hedef.parentNode.insertBefore(s, hedef);
}
function soruAnahtari(i){ var q = Z.sorular[i]; return 'q' + (q && q.k ? q.k : i); }
function soruKapat(){
  if (SORU_MODU) { disKapat(); return; }
  if (d.soru >= 0) delete bagli[soruAnahtari(d.soru)];
  d.soru = -1; $('zk-soru').hidden = true; d.secili = null;
  sayacYerlestir();
}
function disKapat(){ var k = disKaynak(); if (k && k.kapat) k.kapat(); }
/* SORU MODU: görsel çağıran pencereden gerektikçe geliyor. */
function soruHazirla(i){
  var q = Z.sorular[i], k = disKaynak();
  if (!q || q.g || q.yukleniyor || !k || !k.soru) return;
  q.yukleniyor = true;
  Promise.resolve(k.soru(i)).then(function(r){
    q.yukleniyor = false;
    if (r) {
      q.g = r.g || ''; if (r.en) { q.en = r.en; q.boy = r.boy; }
      if (r.cozum) q.cozum = r.cozum;
      if (r.cevapG) q.cevapG = r.cevapG;
      q.hazir = true;
    }
    if (d.soru === i) soruCiz();
    soruKartiGuncelle(i);
  }, function(){ q.yukleniyor = false; });
}
function soruCiz(){
  var q = Z.sorular[d.soru];
  Object.keys(bagli).forEach(function(a){ if (a.charAt(0) === 'q') delete bagli[a]; });
  $('zk-soru-ad').textContent = q.ad;
  $('zk-soru-sira').textContent = SORU_MODU || Z.adim === 'bolum' ? (d.soru + 1) + ' / ' + Z.sorular.length : '';
  var govde = $('zk-soru-govde');
  govde.innerHTML = '';
  var notKutu = $('zk-soru-not');
  notKutu.hidden = !(d.cevap && q.not);
  notKutu.textContent = q.not ? 'Not: ' + q.not : '';
  if (SORU_MODU) { soruHazirla(d.soru); if (d.soru + 1 < Z.sorular.length) soruHazirla(d.soru + 1); }
  if (!q.g) {
    var bk = el('div', 'soru-bekle');
    bk.textContent = SORU_MODU && !q.hazir ? 'Soru yükleniyor…' : 'Bu sorunun görseli yok.';
    govde.appendChild(bk);
    dugmeleriYaz(q);
    return;
  }
  var yan = d.cozum && q.cozum ? q.cozum : (d.cevap && q.cevapG ? q.cevapG : null);
  /* Yan yana mı alt alta mı: soruyu HANGİSİ daha büyük gösteriyorsa. */
  govde.classList.remove('dikey', 'yanli', 'hiza-sol', 'hiza-sag');
  var yasli = !yan && hiza !== 'orta';
  if (yasli) govde.classList.add('hiza-' + hiza);
  hizaYaz(!!yan);
  if (yan) {
    var W = govde.clientWidth - 48, H = govde.clientHeight - 30;
    var yatay = Math.min((W / 2) / q.en, (H - 40) / q.boy);
    var dikey = Math.min(W / q.en, (H / 2 - 40) / q.boy);
    govde.classList.add(dikey > yatay ? 'dikey' : 'yanli');
  }
  var kutu = el('div', 'soru-kutu'); govde.appendChild(kutu);
  var ikinci = null;
  if (yan) { ikinci = el('div', 'soru-kutu'); govde.appendChild(ikinci); }
  /* ORTADA DA AYNI BOY (kullanıcı, 16 Eki 2026: "ortaya alınca bazı sorular
     büyüyüp ekranı komple kaplıyor, çözüm alanı kalmıyor"). Yer değiştirmek
     boyu değiştirmiyor: tek kâğıt her konumda sahnenin en çok %60'ı; ortada
     iki yanda yazı alanı kalıyor. */
  var o = sigdir((yan ? kutu.clientWidth : Math.floor(kutu.clientWidth * 0.6)) - 8, kutu.clientHeight - 36, q.en, q.boy);
  var kagit = el('div', 'kagit');
  kagit.style.width = o[0] + 'px'; kagit.style.height = o[1] + 'px';
  var im = el('img'); im.alt = q.ad; im.draggable = false;
  /* Havuz görseli önbellekten düşünce adresi geçersizleşebiliyor: bir kez yeniden iste. */
  im.onerror = function(){ if (SORU_MODU && !q.yeniden) { q.yeniden = true; q.g = ''; q.hazir = false; soruCiz(); } };
  im.src = q.g; kagit.appendChild(im);
  if (d.cevap && q.cevap) {
    var r = el('div', 'cevap-rozet');
    r.innerHTML = '<i>' + q.cevap + '</i>Doğru cevap'; kagit.appendChild(r);
  }
  kutu.appendChild(kagit);
  new Yuzey(kagit, soruAnahtari(d.soru)).ciz();
  var soruYuzeyi = soruAnahtari(d.soru);
  ekranKatmani(govde, soruYuzeyi + '~e', function(){ return [bagli[soruYuzeyi]].filter(Boolean); });
  if (ikinci) {
    /* Büyütme sınırı: sorunun ölçeği, ama en az kâğıdın 2,2 katı. */
    var o2 = sigdir(ikinci.clientWidth - 8, ikinci.clientHeight - 36, yan.en, yan.boy);
    var sinir = Math.max(o[0] / q.en, 2.2);
    if (o2[0] / yan.en > sinir) o2 = [Math.floor(yan.en * sinir), Math.floor(yan.boy * sinir)];
    var k2 = el('div', 'kagit');
    k2.style.width = o2[0] + 'px'; k2.style.height = o2[1] + 'px';
    var b2 = el('div', 'yan-baslik'); b2.textContent = d.cozum && q.cozum ? 'ÇÖZÜM' : 'CEVAP';
    var im2 = el('img'); im2.src = yan.g; im2.alt = b2.textContent; im2.draggable = false;
    k2.appendChild(b2); k2.appendChild(im2);
    ikinci.appendChild(k2);
  }
  dugmeleriYaz(q);
}
function dugmeleriYaz(q){
  /* Cevabı girilmemiş soruda düğme HİÇ yok. */
  $('zk-cevap').hidden = !(q.cevap || q.cevapG || q.not);
  $('zk-cevap').setAttribute('aria-pressed', d.cevap ? 'true' : 'false');
  $('zk-cevap').querySelector('span').textContent = d.cevap ? 'Cevabı gizle' : 'Cevabı göster';
  $('zk-cozum').hidden = !q.cozum;
  $('zk-cozum').setAttribute('aria-pressed', d.cozum ? 'true' : 'false');
  $('zk-cozum').querySelector('span').textContent = d.cozum ? 'Çözümü gizle' : 'Çözümü göster';
  $('zk-video').hidden = !q.video;
  $('zk-soru-onceki').disabled = d.soru <= 0;
  $('zk-soru-sonraki').disabled = d.soru >= Z.sorular.length - 1;
}
function soruGec(yon){
  var h = d.soru + yon;
  if (h < 0 || h >= Z.sorular.length) return;
  delete bagli[soruAnahtari(d.soru)];
  d.soru = h; d.cevap = false; d.cozum = false; d.secili = null;
  if (!SORU_MODU) { var s = Z.sorular[h].s; if (gorunenler().indexOf(s) < 0) sayfayaGit(s, true); }
  soruCiz();
}

/* ---------- boş tahta ---------- */
function tahtaAc(i){
  if (d.soru >= 0 && !SORU_MODU) soruKapat();
  d.tahta = i === undefined ? 0 : i;
  $('zk-tahta').hidden = false; dugmeBasili('tahta', true);
  sayacYerlestir();
  tahtaCiz();
}
function tahtaKapat(){
  if (d.tahta < 0) return;
  delete bagli['t' + d.tahta]; d.tahta = -1; d.secili = null;
  $('zk-tahta').hidden = true; dugmeBasili('tahta', false);
  sayacYerlestir();
}
function tahtaCiz(){
  Object.keys(bagli).forEach(function(a){ if (a.charAt(0) === 't') delete bagli[a]; });
  var t = tahtalar[d.tahta], z = $('zk-tahta-zemin');
  z.className = 'tahta-zemin z-' + t.z; z.innerHTML = '';
  new Yuzey(z, 't' + d.tahta).ciz();
  $('zk-tahta-no').textContent = (d.tahta + 1) + ' / ' + tahtalar.length;
  $('zk-tahta-onceki').disabled = d.tahta === 0;
  $('zk-tahta-sonraki').disabled = d.tahta >= tahtalar.length - 1;
  document.querySelectorAll('[data-zemin]').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-zemin') === t.z ? 'true' : 'false'); });
}
document.querySelectorAll('[data-zemin]').forEach(function(b){
  b.addEventListener('click', function(){ tahtalar[d.tahta].z = b.getAttribute('data-zemin'); tahtaCiz(); kaydet(); });
});
$('zk-tahta-onceki').addEventListener('click', function(){ if (d.tahta > 0) { d.tahta--; tahtaCiz(); } });
$('zk-tahta-sonraki').addEventListener('click', function(){ if (d.tahta < tahtalar.length - 1) { d.tahta++; tahtaCiz(); } });
$('zk-tahta-yeni').addEventListener('click', function(){ tahtalar.push({ z: tahtalar[d.tahta].z }); d.tahta = tahtalar.length - 1; tahtaCiz(); kaydet(); });
$('zk-tahta-kapat').addEventListener('click', tahtaKapat);

/* ---------- paneller ---------- */
function panelleriKapat(){ document.querySelectorAll('.panel').forEach(function(p){ p.hidden = true; }); }
function panelAcKapa(id){ var p = $(id), ac = p.hidden; panelleriKapat(); p.hidden = !ac; return ac; }
function kucuklerAc(){
  if (!panelAcKapa('zk-kucukler')) return;
  var l = $('zk-kucuk-liste'); l.innerHTML = '';
  var gor = gorunenler();
  Z.sayfalar.forEach(function(s, i){
    var b = el('button'); b.type = 'button';
    if (gor.indexOf(i) >= 0) b.setAttribute('aria-current', 'true');
    b.innerHTML = '<img alt="" src="' + s.k + '"><span>' + (i + 1) + '</span>';
    b.addEventListener('click', function(){ panelleriKapat(); if (gorunenler().indexOf(i) < 0) sayfayaGit(i); });
    l.appendChild(b);
  });
}
/* Akıllı tahtada görseller tembel geliyor: kart ekrana girince istenir. */
var kartGozcusu = null;
function soruKartiGuncelle(i){
  var im = document.querySelector('[data-soru-karti="' + i + '"] img');
  if (im && Z.sorular[i] && Z.sorular[i].g && im.getAttribute('src') !== Z.sorular[i].g) im.src = Z.sorular[i].g;
}
function soruListesiAc(){
  if (!panelAcKapa('zk-soru-listesi')) return;
  var l = $('zk-soru-kartlari'); l.innerHTML = '';
  if (kartGozcusu) kartGozcusu.disconnect();
  kartGozcusu = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(function(gs){
    gs.forEach(function(g){
      if (!g.isIntersecting) return;
      var i = +g.target.getAttribute('data-soru-karti');
      kartGozcusu.unobserve(g.target);
      if (Z.sorular[i].g) soruKartiGuncelle(i); else soruHazirla(i);
    });
  }, { root: l, rootMargin: '200px' });
  Z.sorular.forEach(function(q, i){
    var b = el('button'); b.type = 'button';
    b.setAttribute('data-soru-karti', i);
    if (i === d.soru) b.setAttribute('aria-current', 'true');
    b.innerHTML = '<span class="kart"><img alt=""></span><span></span>';
    b.lastChild.textContent = q.ad || ('Soru ' + (i + 1));
    b.addEventListener('click', function(){ panelleriKapat(); if (i !== d.soru) soruGec(i - d.soru); });
    l.appendChild(b);
    if (q.g) b.querySelector('img').src = q.g;
    else if (kartGozcusu) kartGozcusu.observe(b);
    else soruHazirla(i);
  });
  var su = l.querySelector('[aria-current="true"]');
  if (su && su.scrollIntoView) su.scrollIntoView({ block: 'nearest' });
}
$('zk-tum-sorular').addEventListener('click', soruListesiAc);
/* Tek soru varsa seçecek bir şey yok. */
if (Z.sorular.length < 2) $('zk-tum-sorular').hidden = true;
var sekilKat = null, sembolKat = 0;
function sekilPaneliKur(){
  var kats = []; SEK.forEach(function(s){ if (kats.indexOf(s.kat) < 0) kats.push(s.kat); });
  if (!sekilKat) sekilKat = kats[0];
  var sm = $('zk-sekil-sekmeler'); sm.innerHTML = '';
  kats.forEach(function(k){
    var b = el('button'); b.type = 'button'; b.textContent = k; b.setAttribute('aria-pressed', k === sekilKat ? 'true' : 'false');
    b.addEventListener('click', function(){ sekilKat = k; sekilPaneliKur(); });
    sm.appendChild(b);
  });
  var g = $('zk-sekil-kutular'); g.innerHTML = '';
  SEK.forEach(function(s){
    if (s.kat !== sekilKat) return;
    var b = el('button'); b.type = 'button'; b.setAttribute('data-sekil', s.k);
    b.innerHTML = '<svg viewBox="-4 -4 ' + (s.en + 8) + ' ' + (s.boy + 8) + '">' + s.svg + '</svg><span>' + s.ad + '</span>';
    b.addEventListener('click', function(){ panelleriKapat(); sekilEkle(s.k); });
    g.appendChild(b);
  });
}
function sembolPaneliKur(){
  var sm = $('zk-sembol-sekmeler'); sm.innerHTML = '';
  SEM.forEach(function(gr, i){
    var b = el('button'); b.type = 'button'; b.textContent = gr.ad; b.setAttribute('aria-pressed', i === sembolKat ? 'true' : 'false');
    b.addEventListener('click', function(){ sembolKat = i; sembolPaneliKur(); });
    sm.appendChild(b);
  });
  var g = $('zk-sembol-kutular'); g.innerHTML = '';
  SEM[sembolKat].ogeler.forEach(function(s){
    var b = el('button'); b.type = 'button'; b.textContent = s; b.setAttribute('data-sembol', s);
    if (s.length > 3) b.classList.add('uzun');
    b.addEventListener('click', function(){ panelleriKapat(); sembolEkle(s); });
    g.appendChild(b);
  });
}

/* ---------- kamera ----------
   Kullanıcı (16 Eki 2026): "Online ders yapan öğretmen akıllı tahtada
   kamerasını açabilmeli, kamerası da orada görünmeli." Ekranı paylaşınca
   öğrenciler soruyu ve öğretmeni birlikte görüyor.
   Yalnız GÖRÜNTÜ: ses toplantı uygulamasında; burada mikrofon açılsa
   yankı yapardı. Görüntü AYNALANMIYOR: paylaşılan ekranda öğrenci
   öğretmenin elini doğru yönde görsün. Yer ve boy hatırlanıyor. */
var KAMERA_BOYLARI = [160, 240, 340];
var KAMERA_ANAHTARI = 'foyevi-zk-kamera';
var kamera = { akis: null, boy: 1, x: null, y: null };
try {
  var kk = JSON.parse(localStorage.getItem(KAMERA_ANAHTARI) || 'null');
  if (kk) { if (kk.boy >= 0 && kk.boy < KAMERA_BOYLARI.length) kamera.boy = kk.boy; kamera.x = kk.x; kamera.y = kk.y; }
} catch (e) {}
function kameraSakla(){
  try { localStorage.setItem(KAMERA_ANAHTARI, JSON.stringify({ boy: kamera.boy, x: kamera.x, y: kamera.y })); } catch (e) {}
}
/* Konum ekran oranıyla (merkez) saklanıyor: pencere büyüyüp küçülünce de
   aynı köşede kalıyor; hiç taşınmadıysa sağ altta, çubuğun dışında. */
function kameraYerlestir(){
  var k = $('zk-kamera');
  if (k.hidden) return;
  if (!k.classList.contains('hata')) k.style.width = k.style.height = KAMERA_BOYLARI[kamera.boy] + 'px';
  var w = k.offsetWidth, h = k.offsetHeight, W = innerWidth, H = innerHeight;
  var st = getComputedStyle(document.documentElement);
  var sag = parseFloat(st.getPropertyValue('--sag')) || 0, alt = parseFloat(st.getPropertyValue('--alt')) || 0;
  /* Hiç taşınmadıysa: sağ altta, sorunun alt düğme sırasının (Önceki /
     Cevap / Sonraki) üstünde — dar ekranda düğmeyi örtmesin. */
  var sa = document.querySelector('.sahne:not([hidden]) .sahne-alt');
  var altPay = alt + (sa ? sa.offsetHeight : 0);
  var x = kamera.x == null ? W - sag - w / 2 - 24 : kamera.x * W;
  var y = kamera.y == null ? H - altPay - h / 2 - 16 : kamera.y * H;
  k.style.left = Math.max(0, Math.min(W - w, x - w / 2)) + 'px';
  k.style.top = Math.max(0, Math.min(H - h, y - h / 2)) + 'px';
}
function kameraHata(yazi){
  var k = $('zk-kamera');
  kameraDurdur();
  k.classList.remove('bekliyor');
  k.classList.add('hata');
  $('zk-kamera-yazi').textContent = yazi;
  kameraYerlestir();
}
function kameraDurdur(){
  if (kamera.akis) kamera.akis.getTracks().forEach(function(t){ t.stop(); });
  kamera.akis = null;
  $('zk-kamera-goruntu').srcObject = null;
}
function kameraKapat(){
  kameraDurdur();
  $('zk-kamera').hidden = true;
  $('zk-kamera-dugme').setAttribute('aria-pressed', 'false');
}
function kameraAc(){
  var k = $('zk-kamera'), v = $('zk-kamera-goruntu');
  k.hidden = false;
  k.classList.remove('hata');
  k.classList.add('bekliyor');
  $('zk-kamera-yazi').textContent = 'Kamera açılıyor…';
  $('zk-kamera-dugme').setAttribute('aria-pressed', 'true');
  kameraYerlestir();
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    kameraHata('Bu tarayıcı kamerayı açamıyor. Chrome ya da Edge ile deneyin.');
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' }, audio: false })
    .then(function(akis){
      if (k.hidden) { akis.getTracks().forEach(function(t){ t.stop(); }); return; }
      kamera.akis = akis;
      v.srcObject = akis;
      var p = v.play();
      if (p && p.catch) p.catch(function(){});
      k.classList.remove('bekliyor');
    })
    .catch(function(e){
      if (k.hidden) return;
      var ad = e && e.name;
      kameraHata(
        ad === 'NotAllowedError' || ad === 'SecurityError'
          ? 'Kamera izni verilmedi. Adres çubuğundaki kamera simgesine tıklayıp izin verin, sonra Kamera düğmesine yeniden basın.'
          : ad === 'NotFoundError' || ad === 'OverconstrainedError'
            ? 'Bu bilgisayarda kamera bulunamadı.'
            : ad === 'NotReadableError' || ad === 'AbortError'
              ? 'Kamera başka bir uygulamada açık. Toplantı uygulamasında kameranızı kapatıp Kamera düğmesine yeniden basın.'
              : 'Kamera açılamadı.'
      );
    });
}
$('zk-kamera-dugme').addEventListener('click', function(){
  if ($('zk-kamera').hidden || $('zk-kamera').classList.contains('hata')) kameraAc(); else kameraKapat();
});
$('zk-kamera-kapat').addEventListener('click', kameraKapat);
$('zk-kamera-boy').addEventListener('click', function(){
  kamera.boy = (kamera.boy + 1) % KAMERA_BOYLARI.length;
  kameraSakla();
  kameraYerlestir();
});
(function(){
  var k = $('zk-kamera'), tut = null, sure = 0;
  /* Dokunmatik tahtada "üstüne gelme" yok: dokununca düğmeler 3 sn görünüyor. */
  function etkin(){ k.classList.add('etkin'); clearTimeout(sure); sure = setTimeout(function(){ k.classList.remove('etkin'); }, 3000); }
  k.addEventListener('pointerdown', function(e){
    etkin();
    if (k.classList.contains('hata') || e.target.closest('button')) return;
    var r = k.getBoundingClientRect();
    tut = { dx: e.clientX - r.left, dy: e.clientY - r.top, id: e.pointerId };
    k.setPointerCapture(e.pointerId);
    k.classList.add('surukleniyor');
    e.preventDefault();
  });
  k.addEventListener('pointermove', function(e){
    if (!tut || e.pointerId !== tut.id) return;
    var w = k.offsetWidth, h = k.offsetHeight;
    k.style.left = Math.max(0, Math.min(innerWidth - w, e.clientX - tut.dx)) + 'px';
    k.style.top = Math.max(0, Math.min(innerHeight - h, e.clientY - tut.dy)) + 'px';
  });
  function birak(e){
    if (!tut || e.pointerId !== tut.id) return;
    tut = null;
    k.classList.remove('surukleniyor');
    var r = k.getBoundingClientRect();
    kamera.x = (r.left + r.width / 2) / innerWidth;
    kamera.y = (r.top + r.height / 2) / innerHeight;
    kameraSakla();
  }
  k.addEventListener('pointerup', birak);
  k.addEventListener('pointercancel', birak);
  addEventListener('resize', kameraYerlestir);
  /* Tahta kapanınca kamera ışığı yanık kalmasın. */
  addEventListener('pagehide', kameraDurdur);
})();

/* ---------- bağlama ---------- */
$('zk-ad').textContent = Z.ad;
$('zk-kurum').textContent = Z.kurum;
document.title = Z.ad + ' — Z-kitap';
var YER_ANAHTARI = 'foyevi-zk-yer:' + (SORU_MODU ? 'soru' : 'kitap');
var yer = SORU_MODU ? 'sol' : 'alt';
try { var ky = localStorage.getItem(YER_ANAHTARI); if (ky === 'alt' || ky === 'sol' || ky === 'sag') yer = ky; } catch (e) {}
kok.setAttribute('data-yer', yer);
if (SORU_MODU) kok.setAttribute('data-mod', 'soru');
function altOlc(){
  var a = $('zk-alt'), st = document.documentElement.style;
  st.setProperty('--alt', (yer === 'alt' ? a.offsetHeight : 0) + 'px');
  st.setProperty('--sol', (yer === 'sol' ? a.offsetWidth : 0) + 'px');
  st.setProperty('--sag', (yer === 'sag' ? a.offsetWidth : 0) + 'px');
  st.setProperty('--sahne-ust', (SORU_MODU ? kok.querySelector('.ust').offsetHeight : 0) + 'px');
}
function yerDegistir(){
  yer = { alt: 'sol', sol: 'sag', sag: 'alt' }[yer];
  kok.setAttribute('data-yer', yer);
  try { localStorage.setItem(YER_ANAHTARI, yer); } catch (e) {}
  altOlc();
  if (!SORU_MODU) ciz();
  if (d.soru >= 0) soruCiz();
  if (d.tahta >= 0) tahtaCiz();
  if (!$('zk-spot').hidden) spotCiz();
  perdeYerlestir();
}
$('zk-yer').addEventListener('click', yerDegistir);
document.querySelectorAll('.arac').forEach(function(b){
  var a = b.getAttribute('data-arac');
  b.addEventListener('click', function(){
    if (CIZIM_ARACLARI.indexOf(a) >= 0) { panelleriKapat(); aracSec(a); }
    else if (a === 'geri') geriAl();
    else if (a === 'temizle') temizle();
    else if (a === 'perde') perdeAcKapa();
    else if (a === 'spot') spotAcKapa();
    else if (a === 'sure') panelAcKapa('zk-sure-panel');
    else if (a === 'tepki') tepkiBaloncugu(b);
    else if (a === 'sayfalar') kucuklerAc();
    else if (a === 'sekiller') { if (panelAcKapa('zk-sekil-panel')) sekilPaneliKur(); }
    else if (a === 'semboller') { if (panelAcKapa('zk-sembol-panel')) sembolPaneliKur(); }
    else if (a === 'tahta') { if (d.tahta >= 0) tahtaKapat(); else tahtaAc(0); }
  });
});
$('zk-buyut').addEventListener('click', function(){ d.yakin = Math.min(3, d.yakin + 0.25); ciz(); });
$('zk-kucult').addEventListener('click', function(){ d.yakin = Math.max(1, d.yakin - 0.25); ciz(); });
$('zk-cift').addEventListener('click', function(){ d.cift = !(gorunenler().length > 1); ciz(); });
$('zk-cift').hidden = n < 2;
function sesDugmesi(){
  var b = $('zk-ses-dugme');
  b.setAttribute('aria-pressed', d.ses ? 'true' : 'false');
  b.innerHTML = (d.ses ? SIMGE.ses : SIMGE.sessiz) + '<span>' + (d.ses ? 'Ses açık' : 'Ses kapalı') + '</span>';
}
$('zk-ses-dugme').addEventListener('click', function(){ d.ses = !d.ses; sesDugmesi(); kaydet(); if (d.ses) hisirti(); });
$('zk-bilgi-dugme').addEventListener('click', function(){ $('zk-bilgi').hidden = false; });
$('zk-bilgi').addEventListener('click', function(e){ if (e.target === $('zk-bilgi') || e.target.closest('[data-bilgi-kapat]')) $('zk-bilgi').hidden = true; });
$('zk-hepsini-sil').addEventListener('click', function(){
  if (!window.confirm('Bu kitaptaki bütün çizimler, şekiller ve yazılar silinsin mi?')) return;
  cizimler = {}; nesneler = {}; tahtalar = [{ z: 'kareli' }]; geriYigini = [];
  Object.keys(bagli).forEach(function(a){ bagli[a].ciz(); bagli[a].nesneleriKur(); });
  kaydet(); $('zk-bilgi').hidden = true;
});
document.querySelectorAll('[data-sure]').forEach(function(b){
  b.addEventListener('click', function(){ sureBaslat(+b.getAttribute('data-sure')); });
});
/* Elle süre: dakika 0–180, saniye 0–59; son girilen hatırlanıyor. */
(function(){
  var dk = $('zk-elle-dk'), sn = $('zk-elle-sn');
  try { var k = JSON.parse(localStorage.getItem('foyevi-zk-elle-sure') || 'null'); if (k) { dk.value = k.dk; sn.value = k.sn; } } catch (e) {}
  function oku(i, ust){ var v = parseInt(String(i.value).replace(/[^0-9]/g, ''), 10); return isNaN(v) ? 0 : Math.max(0, Math.min(ust, v)); }
  function duzelt(){ dk.value = oku(dk, 180); var s = oku(sn, 59); sn.value = s < 10 ? '0' + s : String(s); }
  document.querySelectorAll('[data-elle]').forEach(function(b){
    b.addEventListener('click', function(){
      var i = b.getAttribute('data-elle') === 'dk' ? dk : sn, adim = +b.getAttribute('data-adim');
      if (i === sn) {
        var t = oku(dk, 180) * 60 + oku(sn, 59) + adim;
        t = Math.max(0, Math.min(180 * 60 + 59, t));
        dk.value = Math.floor(t / 60); sn.value = t % 60;
      } else dk.value = Math.max(0, Math.min(180, oku(dk, 180) + adim));
      duzelt();
    });
  });
  [dk, sn].forEach(function(i){
    i.addEventListener('change', duzelt);
    i.addEventListener('keydown', function(e){ if (e.key === 'Enter') $('zk-elle-baslat').click(); });
  });
  $('zk-elle-baslat').addEventListener('click', function(){
    duzelt();
    var t = oku(dk, 180) * 60 + oku(sn, 59);
    if (t <= 0) { sn.focus(); return; }
    try { localStorage.setItem('foyevi-zk-elle-sure', JSON.stringify({ dk: dk.value, sn: sn.value })); } catch (e) {}
    sureBaslat(t / 60);
  });
  duzelt();
})();
$('zk-sure-dur').addEventListener('click', function(){
  if (sure.calisiyor) sureDurdur();
  else if (sure.ileri || sure.kalan > 0) { sure.calisiyor = true; sure.t = setInterval(tik, 1000); }
  else { sureBaslat(sure.toplam / 60); return; }
  sureYaz();
});
$('zk-sure-kapat').addEventListener('click', function(){ sureDurdur(); $('zk-sayac').hidden = true; });
$('zk-onceki').addEventListener('click', function(){ git(-1); });
$('zk-sonraki').addEventListener('click', function(){ git(1); });
function tamEkran(){
  var e = document.documentElement;
  if (document.fullscreenElement) document.exitFullscreen();
  else if (e.requestFullscreen) e.requestFullscreen().catch(function(){});
}
$('zk-tamekran').addEventListener('click', tamEkran);
$('zk-soru-tamekran').addEventListener('click', tamEkran);
/* Düğme durumu söylüyor: tam ekrandayken "Tam ekrandan çık". Esc ilk
   basışta yalnız tarayıcının tam ekranını kapatıyor (sayfaya ulaşmıyor);
   öğretmen ikisini karıştırmasın. */
function tamEkranYaz(){
  var acik = !!document.fullscreenElement;
  var y = $('zk-tamekran').querySelector('span');
  if (y) y.textContent = acik ? 'Tam ekrandan çık' : 'Tam ekran';
  $('zk-soru-tamekran').hidden = !acik;
}
document.addEventListener('fullscreenchange', tamEkranYaz);
$('zk-dis-kapat').addEventListener('click', disKapat);
$('zk-soru-kapat').addEventListener('click', soruKapat);
Array.prototype.forEach.call(document.querySelectorAll('#zk-hiza [data-hiza]'), function(b){
  b.addEventListener('click', function(){
    hiza = b.getAttribute('data-hiza');
    try { localStorage.setItem('foyevi-zk-hiza', hiza); } catch (e) {}
    if (d.soru >= 0) soruCiz();
  });
});
$('zk-soru-onceki').addEventListener('click', function(){ soruGec(-1); });
$('zk-soru-sonraki').addEventListener('click', function(){ soruGec(1); });
$('zk-cevap').addEventListener('click', function(){ d.cevap = !d.cevap; if (d.cevap) d.cozum = false; soruCiz(); });
$('zk-cozum').addEventListener('click', function(){ d.cozum = !d.cozum; if (d.cozum) d.cevap = false; soruCiz(); });
$('zk-video').addEventListener('click', function(){ var q = Z.sorular[d.soru]; if (q && q.video) window.open(q.video, '_blank', 'noopener'); });
document.querySelectorAll('.panel [data-kapat]').forEach(function(b){
  b.addEventListener('click', function(){ b.closest('.panel').hidden = true; });
});
/* Boşluğa dokununca seçim kalkıyor (araç çubuğu hariç: renk seçili şekle uygulanıyor). */
document.addEventListener('pointerdown', function(e){
  if (!d.secili) return;
  if (e.target.closest('.nesne') || e.target.closest('#zk-alt') || e.target.closest('.panel')) return;
  secimKaldir();
});
document.addEventListener('keydown', function(e){
  if (e.target && (e.target.isContentEditable || e.target.tagName === 'INPUT')) return;
  if (e.key === 'Escape') {
    if (!$('zk-bilgi').hidden) { $('zk-bilgi').hidden = true; return; }
    if (d.arac === 'lazer') { aracSec('sec'); return; }
    if (!$('zk-tepki-panel').hidden) { $('zk-tepki-panel').hidden = true; return; }
    if (document.querySelector('.panel:not([hidden])')) { panelleriKapat(); return; }
    if (d.secili) { secimKaldir(); return; }
    if (!$('zk-spot').hidden) spotAcKapa(false);
    else if (d.tahta >= 0) tahtaKapat();
    else if (d.soru >= 0) soruKapat();
    return;
  }
  if (e.key === '?') { $('zk-bilgi').hidden = !$('zk-bilgi').hidden; return; }
  if (e.key === 'f' || e.key === 'F') { tamEkran(); return; }
  if ((e.key === 'Delete' || e.key === 'Backspace') && d.secili) { var sn = seciliNesne(); if (sn) nesneSil(sn.y, sn.o); e.preventDefault(); return; }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); geriAl(); return; }
  if (d.tahta >= 0) return;
  if (d.soru >= 0) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); soruGec(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); soruGec(-1); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); if (!$('zk-cevap').hidden) $('zk-cevap').click(); }
    else if (e.key === 'Home' && SORU_MODU) soruGec(-d.soru);
    else if (e.key === 'End' && SORU_MODU) soruGec(Z.sorular.length - 1 - d.soru);
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); git(1); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); git(-1); }
  else if (e.key === 'Home') sayfayaGit(0);
  else if (e.key === 'End') sayfayaGit(n - 1);
});
/* Büyütülmüş düz görünümde parmakla kaydırarak sayfa çevirme. */
(function(){
  var bas = null;
  alan.addEventListener('pointerdown', function(e){ if (!kitap && d.arac === 'sec' && e.pointerType !== 'mouse') bas = { x: e.clientX, y: e.clientY }; });
  alan.addEventListener('pointerup', function(e){
    if (!bas) return;
    var dx = e.clientX - bas.x, dy = e.clientY - bas.y; bas = null;
    if (d.yakin === 1 && Math.abs(dx) > 90 && Math.abs(dx) > Math.abs(dy) * 1.5) git(dx < 0 ? 1 : -1);
  });
})();
var zaman = null;
window.addEventListener('resize', function(){
  clearTimeout(zaman);
  zaman = setTimeout(function(){
    altOlc(); if (!SORU_MODU) ciz();
    if (d.soru >= 0) soruCiz();
    if (d.tahta >= 0) tahtaCiz();
    if (!$('zk-spot').hidden) spotCiz();
  }, 150);
});

altOlc();
imlecleriGuncelle();
kalinliklariKur();
sesDugmesi();
aracSec('sec');
if (Z.adim === 'bolum') {
  $('zk-soru-onceki').lastChild.textContent = 'Önceki';
  $('zk-soru-sonraki').firstChild.textContent = 'Sonraki';
}
if (SORU_MODU) {
  $('zk-tahta-kapat').querySelector('span').textContent = 'Sorulara dön';
  if (Z.sorular.length) soruAc(0);
} else ciz();
window.__zk = d;
window.__zkKitap = function(){ return kitap; };
/* Test kancası: çizim ve nesne verisi (yalnız okunuyor). */
window.__zkVeri = function(){ return { c: cizimler, n: nesneler }; };
})();
`,M=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");t.s(["zKitapSayfasi",0,function(t){let e,i={dur:x("dur"),oynat:x("oynat"),kapat:x("kapat"),ses:x("ses"),sessiz:x("sessiz")},a=(t,e)=>'<script type="application/json" id="'+t+'">'+JSON.stringify(e).replace(/</g,"\\u003c")+"</script>";return'<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="generator" content="Egemen's Testmaker"><meta name="description" content="'+M(z)+'"><title>'+M(t.ad)+" — Z-kitap</title><style>"+S+"</style></head><body><!-- "+A.replace(/--/g,"—")+" -->"+(e=t=>'<div class="panel-bas"><h2>'+t+'</h2><button type="button" class="kapat" data-kapat aria-label="Kapat">'+x("kapat")+"</button></div>",'<div id="zk" data-arac="sec"><header class="ust"><div class="kimlik"><svg viewBox="0 0 240 240" width="34" height="34" aria-hidden="true"><path d="M120 12 A108 108 0 0 0 120 228" fill="none" stroke="#1B4B7F" stroke-width="7" stroke-linecap="round"/><path d="M120 12 A108 108 0 0 1 120 228" fill="none" stroke="#F5811F" stroke-width="7" stroke-linecap="round"/><g fill="none" stroke-width="13" stroke-linejoin="round" stroke-linecap="round"><path d="M38 76 L38 148" stroke="#1B4B7F"/><path d="M99 72 C 85 59, 68 54, 54 56 L54 150 C 72 150, 89 157, 99 170" stroke="#1B4B7F"/><path d="M202 76 L202 148" stroke="#F5811F"/><path d="M141 72 C 155 59, 172 54, 186 56 L186 150 C 168 150, 151 157, 141 170" stroke="#F5811F"/></g><path d="M120 52 L109 64 L109 150 L120 202 Z" fill="#1B4B7F"/><path d="M120 52 L131 64 L131 150 L120 202 Z" fill="#F5811F"/><circle cx="120" cy="158" r="6" fill="#FFFFFF"/></svg><div><b id="zk-ad"></b><small id="zk-kurum"></small></div></div><div class="sayac" id="zk-sayac" hidden><b id="zk-sure">00:00</b><button type="button" id="zk-sure-dur" aria-label="Durdur"></button><button type="button" id="zk-sure-kapat" aria-label="Süreyi kapat">'+x("kapat")+'</button></div><span class="sayfano" id="zk-sayfano"></span>'+w("zk-kucult","kucult","Küçült")+w("zk-buyut","buyut","Büyüt")+w("zk-cift","cift","Çift sayfa",'aria-pressed="false"')+'<button type="button" class="kucuk" id="zk-ses-dugme" aria-pressed="true"></button>'+w("zk-kamera-dugme","kamera","Kamera",'aria-pressed="false" title="Online derste kameranızı tahtada gösterin"')+w("zk-yer","yer","Çubuk yeri",'title="Araç çubuğunu alta, sola ya da sağa al"')+w("zk-bilgi-dugme","bilgi","Bilgi")+w("zk-tamekran","tamekran","Tam ekran")+w("zk-dis-kapat","kapat","Kapat")+'</header><div class="govde"><main id="zk-alan"><div id="zk-sayfalar"></div></main><button type="button" class="gec onceki" id="zk-onceki" aria-label="Önceki sayfa">'+x("sol")+'</button><button type="button" class="gec sonraki" id="zk-sonraki" aria-label="Sonraki sayfa">'+x("sag")+'</button><footer class="alt" id="zk-alt"><nav class="araclar"><div class="cubuk">'+b("sec","Seç")+b("kalem","Kalem")+b("fosfor","Fosforlu")+b("gecici","Geçici kalem")+b("lazer","Lazer")+b("silgi","Silgi")+'<div class="renkler" id="zk-renkler"></div><div class="kalinliklar" id="zk-kalinlik"></div>'+b("geri","Geri al")+b("temizle","Temizle")+'<span class="ayrac"></span>'+b("yazi","Yazı")+b("sekiller","Şekiller")+b("semboller","Semboller")+b("tahta","Boş tahta",'aria-pressed="false"')+'<span class="ayrac"></span>'+b("perde","Perde",'aria-pressed="false"')+b("spot","Spot",'aria-pressed="false"')+b("sure","Süre")+b("tepki","Tepkiler")+b("sayfalar","Sayfalar")+'</div></nav><div class="imza">Egemen's Testmaker ile hazırlandı · '+z+'</div></footer></div><div id="zk-perde" hidden><div class="tutamak"><i></i>Perdeyi sürükleyin</div></div><div class="baloncuk" id="zk-tepki-panel" hidden><div class="tepkiler"><button type="button" data-tepki="konfeti"><svg viewBox="0 0 52 52"><rect x="8" y="30" width="7" height="7" rx="1" fill="#f5811f" transform="rotate(20 11 33)"/><rect x="36" y="8" width="6" height="9" rx="1" fill="#2563eb" transform="rotate(-25 39 12)"/><circle cx="22" cy="12" r="4" fill="#16a34a"/><rect x="30" y="34" width="9" height="5" rx="1" fill="#db2777" transform="rotate(35 34 36)"/><circle cx="42" cy="28" r="3.5" fill="#facc15"/><rect x="14" y="18" width="5" height="9" rx="1" fill="#7c3aed" transform="rotate(-15 16 22)"/><circle cx="26" cy="44" r="3" fill="#0ea5e9"/></svg>Konfeti</button><button type="button" data-tepki="yuz"><svg viewBox="0 0 52 52"><text x="26" y="33" text-anchor="middle" font-size="22" font-weight="900" fill="#dc2626" font-family="Segoe UI,DejaVu Sans,sans-serif">100</text><path d="M8 38c10 4 26 4 36-1" stroke="#dc2626" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M10 43c9 3 22 3 31-1" stroke="#dc2626" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>Yüz puan</button><button type="button" data-tepki="dogru"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="#16a34a"/><path d="M15 27l7 7 15-16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>Doğru</button><button type="button" data-tepki="yanlis"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="#dc2626"/><path d="M17 17l18 18M35 17 17 35" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>Yanlış</button></div></div><div class="panel" id="zk-sure-panel" hidden>'+e("Süre başlat")+'<div class="sureler">'+[.5,1,2,3,5,10,15,20,30,40].map(t=>'<button type="button" data-sure="'+t+'">'+(t<1?Math.round(60*t)+"<small>saniye</small>":t+"<small>dakika</small>")+"</button>").join("")+'<button type="button" class="genis" data-sure="0">Kronometre (ileri say)</button></div><div class="elle-sure"><span>Kendi süreniz:</span><div class="sayi-kutu"><button type="button" data-elle="dk" data-adim="-1" aria-label="Dakika azalt">−</button><input id="zk-elle-dk" inputmode="numeric" maxlength="3" value="2" aria-label="Dakika"><button type="button" data-elle="dk" data-adim="1" aria-label="Dakika artır">+</button><small>dakika</small></div><div class="sayi-kutu"><button type="button" data-elle="sn" data-adim="-5" aria-label="Saniye azalt">−</button><input id="zk-elle-sn" inputmode="numeric" maxlength="2" value="0" aria-label="Saniye"><button type="button" data-elle="sn" data-adim="5" aria-label="Saniye artır">+</button><small>saniye</small></div><button type="button" class="baslat" id="zk-elle-baslat">Başlat</button></div></div><div class="panel" id="zk-kucukler" hidden>'+e("Sayfalar")+'<div class="kucukler" id="zk-kucuk-liste"></div></div><div class="panel" id="zk-soru-listesi" hidden>'+e("Tüm sorular")+'<div class="kucukler soru-kartlari" id="zk-soru-kartlari"></div></div><div class="panel genis-panel" id="zk-sekil-panel" hidden>'+e("Şekiller")+'<div class="sekmeler" id="zk-sekil-sekmeler"></div><div class="kutular sekil-kutular" id="zk-sekil-kutular"></div><p class="ipucu">Şekle dokunun, sayfaya konur. "Seç" aracıyla taşıyın; köşedeki tutamaçla büyütün, üstteki ile döndürün. Renk için önce şekli seçip bir renge dokunun.</p></div><div class="panel genis-panel" id="zk-sembol-panel" hidden>'+e("Semboller")+'<div class="sekmeler" id="zk-sembol-sekmeler"></div><div class="kutular sembol-kutular" id="zk-sembol-kutular"></div><p class="ipucu">Sembole dokunun, sayfaya konur; taşıyıp büyütebilirsiniz. Kendi yazınız için "Yazı" aracını kullanın.</p></div><div class="sahne" id="zk-soru" hidden><div class="sahne-ust"><b id="zk-soru-ad"></b><span class="sira" id="zk-soru-sira"></span><button type="button" class="buyuk" id="zk-tum-sorular" title="Bütün soruları küçük kartlar hâlinde göster">'+x("sayfalar")+'<span>Tüm sorular</span></button><div class="hiza" id="zk-hiza" role="group" aria-label="Sorunun yeri"><button type="button" data-hiza="sol" title="Soruyu sola yasla — sağda yazı alanı" aria-label="Sola yasla">'+x("hizaSol")+'</button><button type="button" data-hiza="orta" title="Soruyu ortala" aria-label="Ortala">'+x("hizaOrta")+'</button><button type="button" data-hiza="sag" title="Soruyu sağa yasla — solda yazı alanı" aria-label="Sağa yasla">'+x("hizaSag")+'</button></div><button type="button" class="buyuk" id="zk-soru-tamekran" hidden>'+x("tamekran")+'Tam ekrandan çık</button><button type="button" class="buyuk" id="zk-soru-kapat">'+x("kapat")+'Kapat</button></div><div class="soru-govde" id="zk-soru-govde"></div><div class="soru-not" id="zk-soru-not" hidden></div><div class="sahne-alt"><button type="button" class="buyuk" id="zk-soru-onceki">'+x("sol")+'Önceki soru</button><button type="button" class="buyuk vurgu" id="zk-cevap">'+x("goz")+'<span>Cevabı göster</span></button><button type="button" class="buyuk" id="zk-cozum">'+x("ampul")+'<span>Çözümü göster</span></button><button type="button" class="buyuk" id="zk-video" hidden>'+x("video")+'Çözüm videosu</button><button type="button" class="buyuk" id="zk-soru-sonraki">Sonraki soru'+x("sag")+'</button></div></div><div class="sahne" id="zk-tahta" hidden><div class="sahne-ust"><b>Boş tahta</b><span class="sira"></span><div class="zeminler">'+[["duz","Düz"],["kareli","Kareli"],["cizgili","Çizgili"],["noktali","Noktalı"],["koordinat","Koordinat"]].map(([t,e])=>'<button type="button" data-zemin="'+t+'" aria-pressed="false">'+e+"</button>").join("")+'</div><div class="tahta-gez"><button type="button" id="zk-tahta-onceki" aria-label="Önceki tahta">'+x("sol")+'</button><span id="zk-tahta-no"></span><button type="button" id="zk-tahta-sonraki" aria-label="Sonraki tahta">'+x("sag")+'</button><button type="button" id="zk-tahta-yeni">'+x("arti")+'Yeni sayfa</button></div><button type="button" class="buyuk" id="zk-tahta-kapat">'+x("kapat")+'<span>Kitaba dön</span></button></div><div class="tahta-govde"><div class="tahta-zemin" id="zk-tahta-zemin"></div></div></div><div id="zk-spot" hidden><div class="spot-kumanda"><button type="button" id="zk-spot-kucult">'+x("kucult")+'Küçült</button><button type="button" id="zk-spot-buyut">'+x("buyut")+'Büyüt</button><button type="button" id="zk-spot-kapat">'+x("kapat")+'Kapat</button></div></div><div id="zk-kamera" hidden><video id="zk-kamera-goruntu" autoplay muted playsinline></video><p id="zk-kamera-yazi" role="status"></p><div class="kamera-dugmeler"><button type="button" id="zk-kamera-boy" aria-label="Kameranın boyunu değiştir" title="Boyunu değiştir">'+x("buyut")+'</button><button type="button" id="zk-kamera-kapat" aria-label="Kamerayı kapat" title="Kamerayı kapat">'+x("kapat")+'</button></div></div><canvas id="zk-lazer"></canvas><canvas id="zk-efekt"></canvas><div id="zk-silgi-iz" hidden></div><div id="zk-bilgi" hidden><div class="kutu"><div class="panel-bas"><h2>Bu kitap hakkında</h2><button type="button" class="kapat" data-bilgi-kapat aria-label="Kapat">'+x("kapat")+'</button></div><div class="kitap-bilgisi"><h3>Yasal not</h3><p class="yasal">'+A+'</p></div><h3>Kullanım</h3><ul><li>Sayfayı köşesinden tutup çekin ya da yandaki oklara dokunun; klavyede ← → tuşları.</li><li>"Seç" aracındayken bir soruya dokunun: tam ekran açılır, cevabı ve çözümü oradan gösterirsiniz.</li><li>Kalem, fosforlu, şekil ve yazılar bu bilgisayarda saklanır; dosyayı yeniden açınca yerindedir.</li><li>Yanlışlıkla bir şey silerseniz "Geri al" (Ctrl+Z).</li><li>Klavye: ← → önceki/sonraki, ↑ ↓ cevabı göster/gizle, F tam ekran, Esc kapat.</li><li>Araç çubuğunu "Çubuk yeri" düğmesiyle alta, sola ya da sağa alabilirsiniz.</li></ul><div class="kitap-bilgisi"><button type="button" class="tehlike" id="zk-hepsini-sil">Bu kitaptaki bütün çizimleri sil</button></div><p style="margin-top:14px;font-size:12.5px;color:#6b7280">Egemen's Testmaker · egemenstestmaker.local</p></div></div><span id="zk-ses" data-src="data:audio/ogg;base64,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iy8AAGDAAQAgwIQyUGjIigAgTgCAQcg5pRiESikIoYSUQigpVYxJyJiDkjEnpZRSWggltYoxCJljUjLHpIQSWioltBJKaamU0loopbWWWowptRZDKamFUlorpbSWWqoxtVZjxJiUzDkpmWNSSimtlVJaqxyTkjEoqYOQSikpxVJSi5VzUjLoqHQQSiqpxFRSaa2k0lIppcWSUmwpxVRbi7WGUlosqcRWUmoxtVRbizHXiDEpGXNSMueklFJSK6W0ljknpYOOSuagpJJSa6WkFDPmpHQOSsogo1JSii2lElMopbWSUmylpNZajLWm1FotJbVWUmqxlBJbizHXFktNnZTWSioxhlJaazHmmlqLMZQSWykpxpJKbK3FmltsOYZSWiypxFZKarHVlmNrsebUUo0ptZpbbLnGlFOPtfacWqs1tVRja7HmWFtvtdacOymthVJaKyXFmFqLscVYcygltpJSbKWkGFtsubYWYw+htFhKarGkEmNrMeYYW46ptVpbbLmm1GKttfYcW249pRZri7Hm0lKNNdfeY005FQAAMOAAABBgQhkoNGQlABAFAAAYwxhjEBqlnHNOSoOUc85JyZyDEEJKmXMQQkgpc05CSi1lzkFIqbVQSkqtxRZKSam1FgsAAChwAAAIsEFTYnGAQkNWAgBRAACIMUoxBqExRinnIDTGKMUYhEopxpyTUCnFmHNQMsecg1BK5pxzEEoJIZRSSkohhFJKSakAAIACBwCAABs0JRYHKDRkRQAQBQAAGGOcM84hCp2lzlIkqaPWUWsopRpLjJ3GVnvrudMae225N5RKjanWjmvLudXeaU09txwLAAA7cAAAO7AQCg1ZCQDkAQAQxijFmHPOGYUYc8455wxSjDnnnHOKMeecgxBCxZhzzkEIIXPOOQihhJI55xyEEEronINQSimldM5BCKGUUjrnIIRSSimdcxBKKaWUAgCAChwAAAJsFNmcYCSo0JCVAEAeAABgDELOSWmtYcw5CC3V2DDGHJSUYoucg5BSi7lGzEFIKcagOygptRhs8J2ElFqLOQeTUos1596DSKm1moPOPdVWc8+995xirDXn3nMvAAB3wQEA7MBGkc0JRoIKDVkJAOQBABAIKcWYc84ZpRhzzDnnjFKMMeacc4oxxpxzzkHFGGPOOQchY8w55yCEkDHmnHMQQuiccw5CCCF0zjkH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" hidden></span></div>')+a("zk-veri",t)+a("zk-sekiller",k)+a("zk-semboller",m)+a("zk-simge",i)+'<script>/*! StPageFlip 2.0.7 | MIT License | (c) 2020 Nodlik | github.com/Nodlik/StPageFlip */\n!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).St={})}(this,(function(t){"use strict";class e{constructor(t,e){this.state={angle:0,area:[],position:{x:0,y:0},hardAngle:0,hardDrawingAngle:0},this.createdDensity=e,this.nowDrawingDensity=this.createdDensity,this.render=t}setDensity(t){this.createdDensity=t,this.nowDrawingDensity=t}setDrawingDensity(t){this.nowDrawingDensity=t}setPosition(t){this.state.position=t}setAngle(t){this.state.angle=t}setArea(t){this.state.area=t}setHardDrawingAngle(t){this.state.hardDrawingAngle=t}setHardAngle(t){this.state.hardAngle=t,this.state.hardDrawingAngle=t}setOrientation(t){this.orientation=t}getDrawingDensity(){return this.nowDrawingDensity}getDensity(){return this.createdDensity}getHardAngle(){return this.state.hardAngle}}class i extends e{constructor(t,e,i){super(t,i),this.image=null,this.isLoad=!1,this.loadingAngle=0,this.image=new Image,this.image.src=e}draw(t){const e=this.render.getContext(),i=this.render.convertToGlobal(this.state.position),s=this.render.getRect().pageWidth,n=this.render.getRect().height;e.save(),e.translate(i.x,i.y),e.beginPath();for(let t of this.state.area)null!==t&&(t=this.render.convertToGlobal(t),e.lineTo(t.x-i.x,t.y-i.y));e.rotate(this.state.angle),e.clip(),this.isLoad?e.drawImage(this.image,0,0,s,n):this.drawLoader(e,{x:0,y:0},s,n),e.restore()}simpleDraw(t){const e=this.render.getRect(),i=this.render.getContext(),s=e.pageWidth,n=e.height,h=1===t?e.left+e.pageWidth:e.left,r=e.top;this.isLoad?i.drawImage(this.image,h,r,s,n):this.drawLoader(i,{x:h,y:r},s,n)}drawLoader(t,e,i,s){t.beginPath(),t.strokeStyle="rgb(200, 200, 200)",t.fillStyle="rgb(255, 255, 255)",t.lineWidth=1,t.rect(e.x+1,e.y+1,i-1,s-1),t.stroke(),t.fill();const n={x:e.x+i/2,y:e.y+s/2};t.beginPath(),t.lineWidth=10,t.arc(n.x,n.y,20,this.loadingAngle,3*Math.PI/2+this.loadingAngle),t.stroke(),t.closePath(),this.loadingAngle+=.07,this.loadingAngle>=2*Math.PI&&(this.loadingAngle=0)}load(){this.isLoad||(this.image.onload=()=>{this.isLoad=!0})}newTemporaryCopy(){return this}getTemporaryCopy(){return this}hideTemporaryCopy(){}}class s{constructor(t,e){this.pages=[],this.currentPageIndex=0,this.currentSpreadIndex=0,this.landscapeSpread=[],this.portraitSpread=[],this.render=e,this.app=t,this.currentPageIndex=0,this.isShowCover=this.app.getSettings().showCover}destroy(){this.pages=[]}createSpread(){this.landscapeSpread=[],this.portraitSpread=[];for(let t=0;t<this.pages.length;t++)this.portraitSpread.push([t]);let t=0;this.isShowCover&&(this.pages[0].setDensity("hard"),this.landscapeSpread.push([t]),t++);for(let e=t;e<this.pages.length;e+=2)e<this.pages.length-1?this.landscapeSpread.push([e,e+1]):(this.landscapeSpread.push([e]),this.pages[e].setDensity("hard"))}getSpread(){return"landscape"===this.render.getOrientation()?this.landscapeSpread:this.portraitSpread}getSpreadIndexByPage(t){const e=this.getSpread();for(let i=0;i<e.length;i++)if(t===e[i][0]||t===e[i][1])return i;return null}getPageCount(){return this.pages.length}getPages(){return this.pages}getPage(t){if(t>=0&&t<this.pages.length)return this.pages[t];throw new Error("Invalid page number")}nextBy(t){const e=this.pages.indexOf(t);return e<this.pages.length-1?this.pages[e+1]:null}prevBy(t){const e=this.pages.indexOf(t);return e>0?this.pages[e-1]:null}getFlippingPage(t){const e=this.currentSpreadIndex;if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1];{const i=0===t?this.getSpread()[e+1]:this.getSpread()[e-1];return 1===i.length||0===t?this.pages[i[0]]:this.pages[i[1]]}}getBottomPage(t){const e=this.currentSpreadIndex;if("portrait"===this.render.getOrientation())return 0===t?this.pages[e+1]:this.pages[e-1];{const i=0===t?this.getSpread()[e+1]:this.getSpread()[e-1];return 1===i.length?this.pages[i[0]]:0===t?this.pages[i[1]]:this.pages[i[0]]}}showNext(){this.currentSpreadIndex<this.getSpread().length&&(this.currentSpreadIndex++,this.showSpread())}showPrev(){this.currentSpreadIndex>0&&(this.currentSpreadIndex--,this.showSpread())}getCurrentPageIndex(){return this.currentPageIndex}show(t=null){if(null===t&&(t=this.currentPageIndex),t<0||t>=this.pages.length)return;const e=this.getSpreadIndexByPage(t);null!==e&&(this.currentSpreadIndex=e,this.showSpread())}getCurrentSpreadIndex(){return this.currentSpreadIndex}setCurrentSpreadIndex(t){if(!(t>=0&&t<this.getSpread().length))throw new Error("Invalid page");this.currentSpreadIndex=t}showSpread(){const t=this.getSpread()[this.currentSpreadIndex];2===t.length?(this.render.setLeftPage(this.pages[t[0]]),this.render.setRightPage(this.pages[t[1]])):"landscape"===this.render.getOrientation()&&t[0]===this.pages.length-1?(this.render.setLeftPage(this.pages[t[0]]),this.render.setRightPage(null)):(this.render.setLeftPage(null),this.render.setRightPage(this.pages[t[0]])),this.currentPageIndex=t[0],this.app.updatePageIndex(this.currentPageIndex)}}class n extends s{constructor(t,e,i){super(t,e),this.imagesHref=i}load(){for(const t of this.imagesHref){const e=new i(this.render,t,"soft");e.load(),this.pages.push(e)}this.createSpread()}}class h{static GetDistanceBetweenTwoPoint(t,e){return null===t||null===e?1/0:Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}static GetSegmentLength(t){return h.GetDistanceBetweenTwoPoint(t[0],t[1])}static GetAngleBetweenTwoLine(t,e){const i=t[0].y-t[1].y,s=e[0].y-e[1].y,n=t[1].x-t[0].x,h=e[1].x-e[0].x;return Math.acos((i*s+n*h)/(Math.sqrt(i*i+n*n)*Math.sqrt(s*s+h*h)))}static PointInRect(t,e){return null===e?null:e.x>=t.left&&e.x<=t.width+t.left&&e.y>=t.top&&e.y<=t.top+t.height?e:null}static GetRotatedPoint(t,e,i){return{x:t.x*Math.cos(i)+t.y*Math.sin(i)+e.x,y:t.y*Math.cos(i)-t.x*Math.sin(i)+e.y}}static LimitPointToCircle(t,e,i){if(h.GetDistanceBetweenTwoPoint(t,i)<=e)return i;const s=t.x,n=t.y,r=i.x,o=i.y;let a=Math.sqrt(Math.pow(e,2)*Math.pow(s-r,2)/(Math.pow(s-r,2)+Math.pow(n-o,2)))+s;i.x<0&&(a*=-1);let g=(a-s)*(n-o)/(s-r)+n;return s-r+n===0&&(g=e),{x:a,y:g}}static GetIntersectBetweenTwoSegment(t,e,i){return h.PointInRect(t,h.GetIntersectBeetwenTwoLine(e,i))}static GetIntersectBeetwenTwoLine(t,e){const i=t[0].y-t[1].y,s=e[0].y-e[1].y,n=t[1].x-t[0].x,h=e[1].x-e[0].x,r=t[0].x*t[1].y-t[1].x*t[0].y,o=e[0].x*e[1].y-e[1].x*e[0].y,a=i*o-s*r,g=n*o-h*r,l=-(r*h-o*n)/(i*h-s*n),d=-(i*o-s*r)/(i*h-s*n);if(isFinite(l)&&isFinite(d))return{x:l,y:d};if(Math.abs(a-g)<.1)throw new Error("Segment included");return null}static GetCordsFromTwoPoint(t,e){const i=Math.abs(t.x-e.x),s=Math.abs(t.y-e.y),n=Math.max(i,s),h=[t];function r(t,e,i,s,n){return e>t?t+n*(i/s):e<t?t-n*(i/s):t}for(let o=1;o<=n;o+=1)h.push({x:r(t.x,e.x,i,n,o),y:r(t.y,e.y,s,n,o)});return h}}class r extends e{constructor(t,e,i){super(t,i),this.copiedElement=null,this.temporaryCopy=null,this.isLoad=!1,this.element=e,this.element.classList.add("stf__item"),this.element.classList.add("--"+i)}newTemporaryCopy(){return"hard"===this.nowDrawingDensity?this:(null===this.temporaryCopy&&(this.copiedElement=this.element.cloneNode(!0),this.element.parentElement.appendChild(this.copiedElement),this.temporaryCopy=new r(this.render,this.copiedElement,this.nowDrawingDensity)),this.getTemporaryCopy())}getTemporaryCopy(){return this.temporaryCopy}hideTemporaryCopy(){null!==this.temporaryCopy&&(this.copiedElement.remove(),this.copiedElement=null,this.temporaryCopy=null)}draw(t){const e=t||this.nowDrawingDensity,i=this.render.convertToGlobal(this.state.position),s=this.render.getRect().pageWidth,n=this.render.getRect().height;this.element.classList.remove("--simple");const h=`\\n            display: block;\\n            z-index: ${this.element.style.zIndex};\\n            left: 0;\\n            top: 0;\\n            width: ${s}px;\\n            height: ${n}px;\\n        `;"hard"===e?this.drawHard(h):this.drawSoft(i,h)}drawHard(t=""){const e=this.render.getRect().left+this.render.getRect().width/2,i=this.state.hardDrawingAngle,s=t+"\\n                backface-visibility: hidden;\\n                -webkit-backface-visibility: hidden;\\n                clip-path: none;\\n                -webkit-clip-path: none;\\n            "+(0===this.orientation?`transform-origin: ${this.render.getRect().pageWidth}px 0; \\n                   transform: translate3d(0, 0, 0) rotateY(${i}deg);`:`transform-origin: 0 0; \\n                   transform: translate3d(${e}px, 0, 0) rotateY(${i}deg);`);this.element.style.cssText=s}drawSoft(t,e=""){let i="polygon( ";for(const t of this.state.area)if(null!==t){let e=1===this.render.getDirection()?{x:-t.x+this.state.position.x,y:t.y-this.state.position.y}:{x:t.x-this.state.position.x,y:t.y-this.state.position.y};e=h.GetRotatedPoint(e,{x:0,y:0},this.state.angle),i+=e.x+"px "+e.y+"px, "}i=i.slice(0,-2),i+=")";const s=e+`transform-origin: 0 0; clip-path: ${i}; -webkit-clip-path: ${i};`+(this.render.isSafari()&&0===this.state.angle?`transform: translate(${t.x}px, ${t.y}px);`:`transform: translate3d(${t.x}px, ${t.y}px, 0) rotate(${this.state.angle}rad);`);this.element.style.cssText=s}simpleDraw(t){const e=this.render.getRect(),i=e.pageWidth,s=e.height,n=1===t?e.left+e.pageWidth:e.left,h=e.top;this.element.classList.add("--simple"),this.element.style.cssText=`\\n            position: absolute; \\n            display: block; \\n            height: ${s}px; \\n            left: ${n}px; \\n            top: ${h}px; \\n            width: ${i}px; \\n            z-index: ${this.render.getSettings().startZIndex+1};`}getElement(){return this.element}load(){this.isLoad=!0}setOrientation(t){super.setOrientation(t),this.element.classList.remove("--left","--right"),this.element.classList.add(1===t?"--right":"--left")}setDrawingDensity(t){this.element.classList.remove("--soft","--hard"),this.element.classList.add("--"+t),super.setDrawingDensity(t)}}class o extends s{constructor(t,e,i,s){super(t,e),this.element=i,this.pagesElement=s}load(){for(const t of this.pagesElement){const e=new r(this.render,t,"hard"===t.dataset.density?"hard":"soft");e.load(),this.pages.push(e)}this.createSpread()}}class a{constructor(t,e,i,s){this.direction=t,this.corner=e,this.topIntersectPoint=null,this.sideIntersectPoint=null,this.bottomIntersectPoint=null,this.pageWidth=parseInt(i,10),this.pageHeight=parseInt(s,10)}calc(t){try{return this.position=this.calcAngleAndPosition(t),this.calculateIntersectPoint(this.position),!0}catch(t){return!1}}getFlippingClipArea(){const t=[];let e=!1;return t.push(this.rect.topLeft),t.push(this.topIntersectPoint),null===this.sideIntersectPoint?e=!0:(t.push(this.sideIntersectPoint),null===this.bottomIntersectPoint&&(e=!1)),t.push(this.bottomIntersectPoint),(e||"bottom"===this.corner)&&t.push(this.rect.bottomLeft),t}getBottomClipArea(){const t=[];return t.push(this.topIntersectPoint),"top"===this.corner?t.push({x:this.pageWidth,y:0}):(null!==this.topIntersectPoint&&t.push({x:this.pageWidth,y:0}),t.push({x:this.pageWidth,y:this.pageHeight})),null!==this.sideIntersectPoint?h.GetDistanceBetweenTwoPoint(this.sideIntersectPoint,this.topIntersectPoint)>=10&&t.push(this.sideIntersectPoint):"top"===this.corner&&t.push({x:this.pageWidth,y:this.pageHeight}),t.push(this.bottomIntersectPoint),t.push(this.topIntersectPoint),t}getAngle(){return 0===this.direction?-this.angle:this.angle}getRect(){return this.rect}getPosition(){return this.position}getActiveCorner(){return 0===this.direction?this.rect.topLeft:this.rect.topRight}getDirection(){return this.direction}getFlippingProgress(){return Math.abs((this.position.x-this.pageWidth)/(2*this.pageWidth)*100)}getCorner(){return this.corner}getBottomPagePosition(){return 1===this.direction?{x:this.pageWidth,y:0}:{x:0,y:0}}getShadowStartPoint(){return"top"===this.corner?this.topIntersectPoint:null!==this.sideIntersectPoint?this.sideIntersectPoint:this.topIntersectPoint}getShadowAngle(){const t=h.GetAngleBetweenTwoLine(this.getSegmentToShadowLine(),[{x:0,y:0},{x:this.pageWidth,y:0}]);return 0===this.direction?t:Math.PI-t}calcAngleAndPosition(t){let e=t;if(this.updateAngleAndGeometry(e),e="top"===this.corner?this.checkPositionAtCenterLine(e,{x:0,y:0},{x:0,y:this.pageHeight}):this.checkPositionAtCenterLine(e,{x:0,y:this.pageHeight},{x:0,y:0}),Math.abs(e.x-this.pageWidth)<1&&Math.abs(e.y)<1)throw new Error("Point is too small");return e}updateAngleAndGeometry(t){this.angle=this.calculateAngle(t),this.rect=this.getPageRect(t)}calculateAngle(t){const e=this.pageWidth-t.x+1,i="bottom"===this.corner?this.pageHeight-t.y:t.y;let s=2*Math.acos(e/Math.sqrt(i*i+e*e));i<0&&(s=-s);const n=Math.PI-s;if(!isFinite(s)||n>=0&&n<.003)throw new Error("The G point is too small");return"bottom"===this.corner&&(s=-s),s}getPageRect(t){return"top"===this.corner?this.getRectFromBasePoint([{x:0,y:0},{x:this.pageWidth,y:0},{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}],t):this.getRectFromBasePoint([{x:0,y:-this.pageHeight},{x:this.pageWidth,y:-this.pageHeight},{x:0,y:0},{x:this.pageWidth,y:0}],t)}getRectFromBasePoint(t,e){return{topLeft:this.getRotatedPoint(t[0],e),topRight:this.getRotatedPoint(t[1],e),bottomLeft:this.getRotatedPoint(t[2],e),bottomRight:this.getRotatedPoint(t[3],e)}}getRotatedPoint(t,e){return{x:t.x*Math.cos(this.angle)+t.y*Math.sin(this.angle)+e.x,y:t.y*Math.cos(this.angle)-t.x*Math.sin(this.angle)+e.y}}calculateIntersectPoint(t){const e={left:-1,top:-1,width:this.pageWidth+2,height:this.pageHeight+2};"top"===this.corner?(this.topIntersectPoint=h.GetIntersectBetweenTwoSegment(e,[t,this.rect.topRight],[{x:0,y:0},{x:this.pageWidth,y:0}]),this.sideIntersectPoint=h.GetIntersectBetweenTwoSegment(e,[t,this.rect.bottomLeft],[{x:this.pageWidth,y:0},{x:this.pageWidth,y:this.pageHeight}]),this.bottomIntersectPoint=h.GetIntersectBetweenTwoSegment(e,[this.rect.bottomLeft,this.rect.bottomRight],[{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}])):(this.topIntersectPoint=h.GetIntersectBetweenTwoSegment(e,[this.rect.topLeft,this.rect.topRight],[{x:0,y:0},{x:this.pageWidth,y:0}]),this.sideIntersectPoint=h.GetIntersectBetweenTwoSegment(e,[t,this.rect.topLeft],[{x:this.pageWidth,y:0},{x:this.pageWidth,y:this.pageHeight}]),this.bottomIntersectPoint=h.GetIntersectBetweenTwoSegment(e,[this.rect.bottomLeft,this.rect.bottomRight],[{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}]))}checkPositionAtCenterLine(t,e,i){let s=t;const n=h.LimitPointToCircle(e,this.pageWidth,s);s!==n&&(s=n,this.updateAngleAndGeometry(s));const r=Math.sqrt(Math.pow(this.pageWidth,2)+Math.pow(this.pageHeight,2));let o=this.rect.bottomRight,a=this.rect.topLeft;if("bottom"===this.corner&&(o=this.rect.topRight,a=this.rect.bottomLeft),o.x<=0){const t=h.LimitPointToCircle(i,r,a);t!==s&&(s=t,this.updateAngleAndGeometry(s))}return s}getSegmentToShadowLine(){const t=this.getShadowStartPoint();return[t,t!==this.sideIntersectPoint&&null!==this.sideIntersectPoint?this.sideIntersectPoint:this.bottomIntersectPoint]}}class g{constructor(t,e){this.flippingPage=null,this.bottomPage=null,this.calc=null,this.state="read",this.render=t,this.app=e}fold(t){this.setState("user_fold"),null===this.calc&&this.start(t),this.do(this.render.convertToPage(t))}flip(t){if(this.app.getSettings().disableFlipByClick&&!this.isPointOnCorners(t))return;if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;const e=this.getBoundsRect();this.setState("flipping");const i=e.height/10,s="bottom"===this.calc.getCorner()?e.height-i:i,n="bottom"===this.calc.getCorner()?e.height:0;this.calc.calc({x:e.pageWidth-i,y:s}),this.animateFlippingTo({x:e.pageWidth-i,y:s},{x:-e.pageWidth,y:n},!0)}start(t){this.reset();const e=this.render.convertToBook(t),i=this.getBoundsRect(),s=this.getDirectionByPoint(e),n=e.y>=i.height/2?"bottom":"top";if(!this.checkDirection(s))return!1;try{if(this.flippingPage=this.app.getPageCollection().getFlippingPage(s),this.bottomPage=this.app.getPageCollection().getBottomPage(s),"landscape"===this.render.getOrientation())if(1===s){const t=this.app.getPageCollection().nextBy(this.flippingPage);null!==t&&this.flippingPage.getDensity()!==t.getDensity()&&(this.flippingPage.setDrawingDensity("hard"),t.setDrawingDensity("hard"))}else{const t=this.app.getPageCollection().prevBy(this.flippingPage);null!==t&&this.flippingPage.getDensity()!==t.getDensity()&&(this.flippingPage.setDrawingDensity("hard"),t.setDrawingDensity("hard"))}return this.render.setDirection(s),this.calc=new a(s,n,i.pageWidth.toString(10),i.height.toString(10)),!0}catch(t){return!1}}do(t){if(null!==this.calc&&this.calc.calc(t)){const t=this.calc.getFlippingProgress();this.bottomPage.setArea(this.calc.getBottomClipArea()),this.bottomPage.setPosition(this.calc.getBottomPagePosition()),this.bottomPage.setAngle(0),this.bottomPage.setHardAngle(0),this.flippingPage.setArea(this.calc.getFlippingClipArea()),this.flippingPage.setPosition(this.calc.getActiveCorner()),this.flippingPage.setAngle(this.calc.getAngle()),0===this.calc.getDirection()?this.flippingPage.setHardAngle(90*(200-2*t)/100):this.flippingPage.setHardAngle(-90*(200-2*t)/100),this.render.setPageRect(this.calc.getRect()),this.render.setBottomPage(this.bottomPage),this.render.setFlippingPage(this.flippingPage),this.render.setShadowData(this.calc.getShadowStartPoint(),this.calc.getShadowAngle(),t,this.calc.getDirection())}}flipToPage(t,e){const i=this.app.getPageCollection().getCurrentSpreadIndex(),s=this.app.getPageCollection().getSpreadIndexByPage(t);try{s>i&&(this.app.getPageCollection().setCurrentSpreadIndex(s-1),this.flipNext(e)),s<i&&(this.app.getPageCollection().setCurrentSpreadIndex(s+1),this.flipPrev(e))}catch(t){}}flipNext(t){this.flip({x:this.render.getRect().left+2*this.render.getRect().pageWidth-10,y:"top"===t?1:this.render.getRect().height-2})}flipPrev(t){this.flip({x:10,y:"top"===t?1:this.render.getRect().height-2})}stopMove(){if(null===this.calc)return;const t=this.calc.getPosition(),e=this.getBoundsRect(),i="bottom"===this.calc.getCorner()?e.height:0;t.x<=0?this.animateFlippingTo(t,{x:-e.pageWidth,y:i},!0):this.animateFlippingTo(t,{x:e.pageWidth,y:i},!1)}showCorner(t){if(!this.checkState("read","fold_corner"))return;const e=this.getBoundsRect(),i=e.pageWidth;if(this.isPointOnCorners(t))if(null===this.calc){if(!this.start(t))return;this.setState("fold_corner"),this.calc.calc({x:i-1,y:1});const s=50,n="bottom"===this.calc.getCorner()?e.height-1:1,h="bottom"===this.calc.getCorner()?e.height-s:s;this.animateFlippingTo({x:i-1,y:n},{x:i-s,y:h},!1,!1)}else this.do(this.render.convertToPage(t));else this.setState("read"),this.render.finishAnimation(),this.stopMove()}animateFlippingTo(t,e,i,s=!0){const n=h.GetCordsFromTwoPoint(t,e),r=[];for(const t of n)r.push(()=>this.do(t));const o=this.getAnimationDuration(n.length);this.render.startAnimation(r,o,()=>{this.calc&&(i&&(1===this.calc.getDirection()?this.app.turnToPrevPage():this.app.turnToNextPage()),s&&(this.render.setBottomPage(null),this.render.setFlippingPage(null),this.render.clearShadow(),this.setState("read"),this.reset()))})}getCalculation(){return this.calc}getState(){return this.state}setState(t){this.state!==t&&(this.app.updateState(t),this.state=t)}getDirectionByPoint(t){const e=this.getBoundsRect();if("portrait"===this.render.getOrientation()){if(t.x-e.pageWidth<=e.width/5)return 1}else if(t.x<e.width/2)return 1;return 0}getAnimationDuration(t){const e=this.app.getSettings().flippingTime;return t>=1e3?e:t/1e3*e}checkDirection(t){return 0===t?this.app.getCurrentPageIndex()<this.app.getPageCount()-1:this.app.getCurrentPageIndex()>=1}reset(){this.calc=null,this.flippingPage=null,this.bottomPage=null}getBoundsRect(){return this.render.getRect()}checkState(...t){for(const e of t)if(this.state===e)return!0;return!1}isPointOnCorners(t){const e=this.getBoundsRect(),i=e.pageWidth,s=Math.sqrt(Math.pow(i,2)+Math.pow(e.height,2))/5,n=this.render.convertToBook(t);return n.x>0&&n.y>0&&n.x<e.width&&n.y<e.height&&(n.x<s||n.x>e.width-s)&&(n.y<s||n.y>e.height-s)}}class l{constructor(t,e){this.leftPage=null,this.rightPage=null,this.flippingPage=null,this.bottomPage=null,this.direction=null,this.orientation=null,this.shadow=null,this.animation=null,this.pageRect=null,this.boundsRect=null,this.timer=0,this.safari=!1,this.setting=e,this.app=t;const i=new RegExp("Version\\\\/[\\\\d\\\\.]+.*Safari/");this.safari=null!==i.exec(window.navigator.userAgent)}render(t){if(null!==this.animation){const e=Math.round((t-this.animation.startedAt)/this.animation.durationFrame);e<this.animation.frames.length?this.animation.frames[e]():(this.animation.onAnimateEnd(),this.animation=null)}this.timer=t,this.drawFrame()}start(){this.update();const t=e=>{this.render(e),requestAnimationFrame(t)};requestAnimationFrame(t)}startAnimation(t,e,i){this.finishAnimation(),this.animation={frames:t,duration:e,durationFrame:e/t.length,onAnimateEnd:i,startedAt:this.timer}}finishAnimation(){null!==this.animation&&(this.animation.frames[this.animation.frames.length-1](),null!==this.animation.onAnimateEnd&&this.animation.onAnimateEnd()),this.animation=null}update(){this.boundsRect=null;const t=this.calculateBoundsRect();this.orientation!==t&&(this.orientation=t,this.app.updateOrientation(t))}calculateBoundsRect(){let t="landscape";const e=this.getBlockWidth(),i=e/2,s=this.getBlockHeight()/2,n=this.setting.width/this.setting.height;let h=this.setting.width,r=this.setting.height,o=i-h;return"stretch"===this.setting.size?(e<2*this.setting.minWidth&&this.app.getSettings().usePortrait&&(t="portrait"),h="portrait"===t?this.getBlockWidth():this.getBlockWidth()/2,h>this.setting.maxWidth&&(h=this.setting.maxWidth),r=h/n,r>this.getBlockHeight()&&(r=this.getBlockHeight(),h=r*n),o="portrait"===t?i-h/2-h:i-h):e<2*h&&this.app.getSettings().usePortrait&&(t="portrait",o=i-h/2-h),this.boundsRect={left:o,top:s-r/2,width:2*h,height:r,pageWidth:h},t}setShadowData(t,e,i,s){if(!this.app.getSettings().drawShadow)return;const n=100*this.getSettings().maxShadowOpacity;this.shadow={pos:t,angle:e,width:3*this.getRect().pageWidth/4*i/100,opacity:(100-i)*n/100/100,direction:s,progress:2*i}}clearShadow(){this.shadow=null}getBlockWidth(){return this.app.getUI().getDistElement().offsetWidth}getBlockHeight(){return this.app.getUI().getDistElement().offsetHeight}getDirection(){return this.direction}getRect(){return null===this.boundsRect&&this.calculateBoundsRect(),this.boundsRect}getSettings(){return this.app.getSettings()}getOrientation(){return this.orientation}setPageRect(t){this.pageRect=t}setDirection(t){this.direction=t}setRightPage(t){null!==t&&t.setOrientation(1),this.rightPage=t}setLeftPage(t){null!==t&&t.setOrientation(0),this.leftPage=t}setBottomPage(t){null!==t&&t.setOrientation(1===this.direction?0:1),this.bottomPage=t}setFlippingPage(t){null!==t&&t.setOrientation(0===this.direction&&"portrait"!==this.orientation?0:1),this.flippingPage=t}convertToBook(t){const e=this.getRect();return{x:t.x-e.left,y:t.y-e.top}}isSafari(){return this.safari}convertToPage(t,e){e||(e=this.direction);const i=this.getRect();return{x:0===e?t.x-i.left-i.width/2:i.width/2-t.x+i.left,y:t.y-i.top}}convertToGlobal(t,e){if(e||(e=this.direction),null==t)return null;const i=this.getRect();return{x:0===e?t.x+i.left+i.width/2:i.width/2-t.x+i.left,y:t.y+i.top}}convertRectToGlobal(t,e){return e||(e=this.direction),{topLeft:this.convertToGlobal(t.topLeft,e),topRight:this.convertToGlobal(t.topRight,e),bottomLeft:this.convertToGlobal(t.bottomLeft,e),bottomRight:this.convertToGlobal(t.bottomRight,e)}}}class d extends l{constructor(t,e,i){super(t,e),this.canvas=i,this.ctx=i.getContext("2d")}getContext(){return this.ctx}reload(){}drawFrame(){this.clear(),"portrait"!==this.orientation&&null!=this.leftPage&&this.leftPage.simpleDraw(0),null!=this.rightPage&&this.rightPage.simpleDraw(1),null!=this.bottomPage&&this.bottomPage.draw(),this.drawBookShadow(),null!=this.flippingPage&&this.flippingPage.draw(),null!=this.shadow&&(this.drawOuterShadow(),this.drawInnerShadow());const t=this.getRect();"portrait"===this.orientation&&(this.ctx.beginPath(),this.ctx.rect(t.left+t.pageWidth,t.top,t.width,t.height),this.ctx.clip())}drawBookShadow(){const t=this.getRect();this.ctx.save(),this.ctx.beginPath();const e=t.width/20;this.ctx.rect(t.left,t.top,t.width,t.height);const i={x:t.left+t.width/2-e/2,y:0};this.ctx.translate(i.x,i.y);const s=this.ctx.createLinearGradient(0,0,e,0);s.addColorStop(0,"rgba(0, 0, 0, 0)"),s.addColorStop(.4,"rgba(0, 0, 0, 0.2)"),s.addColorStop(.49,"rgba(0, 0, 0, 0.1)"),s.addColorStop(.5,"rgba(0, 0, 0, 0.5)"),s.addColorStop(.51,"rgba(0, 0, 0, 0.4)"),s.addColorStop(1,"rgba(0, 0, 0, 0)"),this.ctx.clip(),this.ctx.fillStyle=s,this.ctx.fillRect(0,0,e,2*t.height),this.ctx.restore()}drawOuterShadow(){const t=this.getRect();this.ctx.save(),this.ctx.beginPath(),this.ctx.rect(t.left,t.top,t.width,t.height);const e=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y});this.ctx.translate(e.x,e.y),this.ctx.rotate(Math.PI+this.shadow.angle+Math.PI/2);const i=this.ctx.createLinearGradient(0,0,this.shadow.width,0);0===this.shadow.direction?(this.ctx.translate(0,-100),i.addColorStop(0,"rgba(0, 0, 0, "+this.shadow.opacity+")"),i.addColorStop(1,"rgba(0, 0, 0, 0)")):(this.ctx.translate(-this.shadow.width,-100),i.addColorStop(0,"rgba(0, 0, 0, 0)"),i.addColorStop(1,"rgba(0, 0, 0, "+this.shadow.opacity+")")),this.ctx.clip(),this.ctx.fillStyle=i,this.ctx.fillRect(0,0,this.shadow.width,2*t.height),this.ctx.restore()}drawInnerShadow(){const t=this.getRect();this.ctx.save(),this.ctx.beginPath();const e=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y}),i=this.convertRectToGlobal(this.pageRect);this.ctx.moveTo(i.topLeft.x,i.topLeft.y),this.ctx.lineTo(i.topRight.x,i.topRight.y),this.ctx.lineTo(i.bottomRight.x,i.bottomRight.y),this.ctx.lineTo(i.bottomLeft.x,i.bottomLeft.y),this.ctx.translate(e.x,e.y),this.ctx.rotate(Math.PI+this.shadow.angle+Math.PI/2);const s=3*this.shadow.width/4,n=this.ctx.createLinearGradient(0,0,s,0);0===this.shadow.direction?(this.ctx.translate(-s,-100),n.addColorStop(1,"rgba(0, 0, 0, "+this.shadow.opacity+")"),n.addColorStop(.9,"rgba(0, 0, 0, 0.05)"),n.addColorStop(.7,"rgba(0, 0, 0, "+this.shadow.opacity+")"),n.addColorStop(0,"rgba(0, 0, 0, 0)")):(this.ctx.translate(0,-100),n.addColorStop(0,"rgba(0, 0, 0, "+this.shadow.opacity+")"),n.addColorStop(.1,"rgba(0, 0, 0, 0.05)"),n.addColorStop(.3,"rgba(0, 0, 0, "+this.shadow.opacity+")"),n.addColorStop(1,"rgba(0, 0, 0, 0)")),this.ctx.clip(),this.ctx.fillStyle=n,this.ctx.fillRect(0,0,s,2*t.height),this.ctx.restore()}clear(){this.ctx.fillStyle="white",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)}}class p{constructor(t,e,i){this.touchPoint=null,this.swipeTimeout=250,this.onResize=()=>{this.update()},this.onMouseDown=t=>{if(this.checkTarget(t.target)){const e=this.getMousePos(t.clientX,t.clientY);this.app.startUserTouch(e),t.preventDefault()}},this.onTouchStart=t=>{if(this.checkTarget(t.target)&&t.changedTouches.length>0){const e=t.changedTouches[0],i=this.getMousePos(e.clientX,e.clientY);this.touchPoint={point:i,time:Date.now()},setTimeout(()=>{null!==this.touchPoint&&this.app.startUserTouch(i)},this.swipeTimeout),this.app.getSettings().mobileScrollSupport||t.preventDefault()}},this.onMouseUp=t=>{const e=this.getMousePos(t.clientX,t.clientY);this.app.userStop(e)},this.onMouseMove=t=>{const e=this.getMousePos(t.clientX,t.clientY);this.app.userMove(e,!1)},this.onTouchMove=t=>{if(t.changedTouches.length>0){const e=t.changedTouches[0],i=this.getMousePos(e.clientX,e.clientY);this.app.getSettings().mobileScrollSupport?(null!==this.touchPoint&&(Math.abs(this.touchPoint.point.x-i.x)>10||"read"!==this.app.getState())&&t.cancelable&&this.app.userMove(i,!0),"read"!==this.app.getState()&&t.preventDefault()):this.app.userMove(i,!0)}},this.onTouchEnd=t=>{if(t.changedTouches.length>0){const e=t.changedTouches[0],i=this.getMousePos(e.clientX,e.clientY);let s=!1;if(null!==this.touchPoint){const t=i.x-this.touchPoint.point.x,e=Math.abs(i.y-this.touchPoint.point.y);Math.abs(t)>this.swipeDistance&&e<2*this.swipeDistance&&Date.now()-this.touchPoint.time<this.swipeTimeout&&(t>0?this.app.flipPrev(this.touchPoint.point.y<this.app.getRender().getRect().height/2?"top":"bottom"):this.app.flipNext(this.touchPoint.point.y<this.app.getRender().getRect().height/2?"top":"bottom"),s=!0),this.touchPoint=null}this.app.userStop(i,s)}},this.parentElement=t,t.classList.add("stf__parent"),t.insertAdjacentHTML("afterbegin",\'<div class="stf__wrapper"></div>\'),this.wrapper=t.querySelector(".stf__wrapper"),this.app=e;const s=this.app.getSettings().usePortrait?1:2;t.style.minWidth=i.minWidth*s+"px",t.style.minHeight=i.minHeight+"px","fixed"===i.size&&(t.style.minWidth=i.width*s+"px",t.style.minHeight=i.height+"px"),i.autoSize&&(t.style.width="100%",t.style.maxWidth=2*i.maxWidth+"px"),t.style.display="block",window.addEventListener("resize",this.onResize,!1),this.swipeDistance=i.swipeDistance}destroy(){this.app.getSettings().useMouseEvents&&this.removeHandlers(),this.distElement.remove(),this.wrapper.remove()}getDistElement(){return this.distElement}getWrapper(){return this.wrapper}setOrientationStyle(t){this.wrapper.classList.remove("--portrait","--landscape"),"portrait"===t?(this.app.getSettings().autoSize&&(this.wrapper.style.paddingBottom=this.app.getSettings().height/this.app.getSettings().width*100+"%"),this.wrapper.classList.add("--portrait")):(this.app.getSettings().autoSize&&(this.wrapper.style.paddingBottom=this.app.getSettings().height/(2*this.app.getSettings().width)*100+"%"),this.wrapper.classList.add("--landscape")),this.update()}removeHandlers(){window.removeEventListener("resize",this.onResize),this.distElement.removeEventListener("mousedown",this.onMouseDown),this.distElement.removeEventListener("touchstart",this.onTouchStart),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("touchend",this.onTouchEnd)}setHandlers(){window.addEventListener("resize",this.onResize,!1),this.app.getSettings().useMouseEvents&&(this.distElement.addEventListener("mousedown",this.onMouseDown),this.distElement.addEventListener("touchstart",this.onTouchStart),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("touchmove",this.onTouchMove,{passive:!this.app.getSettings().mobileScrollSupport}),window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("touchend",this.onTouchEnd))}getMousePos(t,e){const i=this.distElement.getBoundingClientRect();return{x:t-i.left,y:e-i.top}}checkTarget(t){return!this.app.getSettings().clickEventForward||!["a","button"].includes(t.tagName.toLowerCase())}}class c extends p{constructor(t,e,i,s){super(t,e,i),this.wrapper.insertAdjacentHTML("afterbegin",\'<div class="stf__block"></div>\'),this.distElement=t.querySelector(".stf__block"),this.items=s;for(const t of s)this.distElement.appendChild(t);this.setHandlers()}clear(){for(const t of this.items)this.parentElement.appendChild(t)}updateItems(t){this.removeHandlers(),this.distElement.innerHTML="";for(const e of t)this.distElement.appendChild(e);this.items=t,this.setHandlers()}update(){this.app.getRender().update()}}class u extends p{constructor(t,e,i){super(t,e,i),this.wrapper.innerHTML=\'<canvas class="stf__canvas"></canvas>\',this.canvas=t.querySelectorAll("canvas")[0],this.distElement=this.canvas,this.resizeCanvas(),this.setHandlers()}resizeCanvas(){const t=getComputedStyle(this.canvas),e=parseInt(t.getPropertyValue("width"),10),i=parseInt(t.getPropertyValue("height"),10);this.canvas.width=e,this.canvas.height=i}getCanvas(){return this.canvas}update(){this.resizeCanvas(),this.app.getRender().update()}}class w extends l{constructor(t,e,i){super(t,e),this.outerShadow=null,this.innerShadow=null,this.hardShadow=null,this.hardInnerShadow=null,this.element=i,this.createShadows()}createShadows(){this.element.insertAdjacentHTML("beforeend",\'<div class="stf__outerShadow"></div>\\n             <div class="stf__innerShadow"></div>\\n             <div class="stf__hardShadow"></div>\\n             <div class="stf__hardInnerShadow"></div>\'),this.outerShadow=this.element.querySelector(".stf__outerShadow"),this.innerShadow=this.element.querySelector(".stf__innerShadow"),this.hardShadow=this.element.querySelector(".stf__hardShadow"),this.hardInnerShadow=this.element.querySelector(".stf__hardInnerShadow")}clearShadow(){super.clearShadow(),this.outerShadow.style.cssText="display: none",this.innerShadow.style.cssText="display: none",this.hardShadow.style.cssText="display: none",this.hardInnerShadow.style.cssText="display: none"}reload(){this.element.querySelector(".stf__outerShadow")||this.createShadows()}drawHardInnerShadow(){const t=this.getRect(),e=this.shadow.progress>100?200-this.shadow.progress:this.shadow.progress;let i=(100-e)*(2.5*t.pageWidth)/100+20;i>t.pageWidth&&(i=t.pageWidth);let s=`\\n            display: block;\\n            z-index: ${(this.getSettings().startZIndex+5).toString(10)};\\n            width: ${i}px;\\n            height: ${t.height}px;\\n            background: linear-gradient(to right,\\n                rgba(0, 0, 0, ${this.shadow.opacity*e/100}) 5%,\\n                rgba(0, 0, 0, 0) 100%);\\n            left: ${t.left+t.width/2}px;\\n            transform-origin: 0 0;\\n        `;s+=0===this.getDirection()&&this.shadow.progress>100||1===this.getDirection()&&this.shadow.progress<=100?"transform: translate3d(0, 0, 0);":"transform: translate3d(0, 0, 0) rotateY(180deg);",this.hardInnerShadow.style.cssText=s}drawHardOuterShadow(){const t=this.getRect();let e=(100-(this.shadow.progress>100?200-this.shadow.progress:this.shadow.progress))*(2.5*t.pageWidth)/100+20;e>t.pageWidth&&(e=t.pageWidth);let i=`\\n            display: block;\\n            z-index: ${(this.getSettings().startZIndex+4).toString(10)};\\n            width: ${e}px;\\n            height: ${t.height}px;\\n            background: linear-gradient(to left, rgba(0, 0, 0, ${this.shadow.opacity}) 5%, rgba(0, 0, 0, 0) 100%);\\n            left: ${t.left+t.width/2}px;\\n            transform-origin: 0 0;\\n        `;i+=0===this.getDirection()&&this.shadow.progress>100||1===this.getDirection()&&this.shadow.progress<=100?"transform: translate3d(0, 0, 0) rotateY(180deg);":"transform: translate3d(0, 0, 0);",this.hardShadow.style.cssText=i}drawInnerShadow(){const t=this.getRect(),e=3*this.shadow.width/4,i=0===this.getDirection()?e:0,s=0===this.getDirection()?"to left":"to right",n=this.convertToGlobal(this.shadow.pos),r=this.shadow.angle+3*Math.PI/2,o=[this.pageRect.topLeft,this.pageRect.topRight,this.pageRect.bottomRight,this.pageRect.bottomLeft];let a="polygon( ";for(const t of o){let e=1===this.getDirection()?{x:-t.x+this.shadow.pos.x,y:t.y-this.shadow.pos.y}:{x:t.x-this.shadow.pos.x,y:t.y-this.shadow.pos.y};e=h.GetRotatedPoint(e,{x:i,y:100},r),a+=e.x+"px "+e.y+"px, "}a=a.slice(0,-2),a+=")";const g=`\\n            display: block;\\n            z-index: ${(this.getSettings().startZIndex+10).toString(10)};\\n            width: ${e}px;\\n            height: ${2*t.height}px;\\n            background: linear-gradient(${s},\\n                rgba(0, 0, 0, ${this.shadow.opacity}) 5%,\\n                rgba(0, 0, 0, 0.05) 15%,\\n                rgba(0, 0, 0, ${this.shadow.opacity}) 35%,\\n                rgba(0, 0, 0, 0) 100%);\\n            transform-origin: ${i}px 100px;\\n            transform: translate3d(${n.x-i}px, ${n.y-100}px, 0) rotate(${r}rad);\\n            clip-path: ${a};\\n            -webkit-clip-path: ${a};\\n        `;this.innerShadow.style.cssText=g}drawOuterShadow(){const t=this.getRect(),e=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y}),i=this.shadow.angle+3*Math.PI/2,s=1===this.getDirection()?this.shadow.width:0,n=0===this.getDirection()?"to right":"to left",r=[{x:0,y:0},{x:t.pageWidth,y:0},{x:t.pageWidth,y:t.height},{x:0,y:t.height}];let o="polygon( ";for(const t of r)if(null!==t){let e=1===this.getDirection()?{x:-t.x+this.shadow.pos.x,y:t.y-this.shadow.pos.y}:{x:t.x-this.shadow.pos.x,y:t.y-this.shadow.pos.y};e=h.GetRotatedPoint(e,{x:s,y:100},i),o+=e.x+"px "+e.y+"px, "}o=o.slice(0,-2),o+=")";const a=`\\n            display: block;\\n            z-index: ${(this.getSettings().startZIndex+10).toString(10)};\\n            width: ${this.shadow.width}px;\\n            height: ${2*t.height}px;\\n            background: linear-gradient(${n}, rgba(0, 0, 0, ${this.shadow.opacity}), rgba(0, 0, 0, 0));\\n            transform-origin: ${s}px 100px;\\n            transform: translate3d(${e.x-s}px, ${e.y-100}px, 0) rotate(${i}rad);\\n            clip-path: ${o};\\n            -webkit-clip-path: ${o};\\n        `;this.outerShadow.style.cssText=a}drawLeftPage(){"portrait"!==this.orientation&&null!==this.leftPage&&(1===this.direction&&null!==this.flippingPage&&"hard"===this.flippingPage.getDrawingDensity()?(this.leftPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.leftPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.leftPage.draw(this.flippingPage.getDrawingDensity())):this.leftPage.simpleDraw(0))}drawRightPage(){null!==this.rightPage&&(0===this.direction&&null!==this.flippingPage&&"hard"===this.flippingPage.getDrawingDensity()?(this.rightPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.rightPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.rightPage.draw(this.flippingPage.getDrawingDensity())):this.rightPage.simpleDraw(1))}drawBottomPage(){if(null===this.bottomPage)return;const t=null!=this.flippingPage?this.flippingPage.getDrawingDensity():null;"portrait"===this.orientation&&1===this.direction||(this.bottomPage.getElement().style.zIndex=(this.getSettings().startZIndex+3).toString(10),this.bottomPage.draw(t))}drawFrame(){this.clear(),this.drawLeftPage(),this.drawRightPage(),this.drawBottomPage(),null!=this.flippingPage&&(this.flippingPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.flippingPage.draw()),null!=this.shadow&&null!==this.flippingPage&&("soft"===this.flippingPage.getDrawingDensity()?(this.drawOuterShadow(),this.drawInnerShadow()):(this.drawHardOuterShadow(),this.drawHardInnerShadow()))}clear(){for(const t of this.app.getPageCollection().getPages())t!==this.leftPage&&t!==this.rightPage&&t!==this.flippingPage&&t!==this.bottomPage&&(t.getElement().style.cssText="display: none"),t.getTemporaryCopy()!==this.flippingPage&&t.hideTemporaryCopy()}update(){super.update(),null!==this.rightPage&&this.rightPage.setOrientation(1),null!==this.leftPage&&this.leftPage.setOrientation(0)}}class x{constructor(){this._default={startPage:0,size:"fixed",width:0,height:0,minWidth:0,maxWidth:0,minHeight:0,maxHeight:0,drawShadow:!0,flippingTime:1e3,usePortrait:!0,startZIndex:0,autoSize:!0,maxShadowOpacity:1,showCover:!1,mobileScrollSupport:!0,swipeDistance:30,clickEventForward:!0,useMouseEvents:!0,showPageCorners:!0,disableFlipByClick:!1}}getSettings(t){const e=this._default;if(Object.assign(e,t),"stretch"!==e.size&&"fixed"!==e.size)throw new Error(\'Invalid size type. Available only "fixed" and "stretch" value\');if(e.width<=0||e.height<=0)throw new Error("Invalid width or height");if(e.flippingTime<=0)throw new Error("Invalid flipping time");return"stretch"===e.size?(e.minWidth<=0&&(e.minWidth=100),e.maxWidth<e.minWidth&&(e.maxWidth=2e3),e.minHeight<=0&&(e.minHeight=100),e.maxHeight<e.minHeight&&(e.maxHeight=2e3)):(e.minWidth=e.width,e.maxWidth=e.width,e.minHeight=e.height,e.maxHeight=e.height),e}}!function(t,e){void 0===e&&(e={});var i=e.insertAt;if(t&&"undefined"!=typeof document){var s=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css","top"===i&&s.firstChild?s.insertBefore(n,s.firstChild):s.appendChild(n),n.styleSheet?n.styleSheet.cssText=t:n.appendChild(document.createTextNode(t))}}(".stf__parent {\\n  position: relative;\\n  display: block;\\n  box-sizing: border-box;\\n  transform: translateZ(0);\\n\\n  -ms-touch-action: pan-y;\\n  touch-action: pan-y;\\n}\\n\\n.sft__wrapper {\\n  position: relative;\\n  width: 100%;\\n  box-sizing: border-box;\\n}\\n\\n.stf__parent canvas {\\n  position: absolute;\\n  width: 100%;\\n  height: 100%;\\n  left: 0;\\n  top: 0;\\n}\\n\\n.stf__block {\\n  position: absolute;\\n  width: 100%;\\n  height: 100%;\\n  box-sizing: border-box;\\n  perspective: 2000px;\\n}\\n\\n.stf__item {\\n  display: none;\\n  position: absolute;\\n  transform-style: preserve-3d;\\n}\\n\\n.stf__outerShadow {\\n  position: absolute;\\n  left: 0;\\n  top: 0;\\n}\\n\\n.stf__innerShadow {\\n  position: absolute;\\n  left: 0;\\n  top: 0;\\n}\\n\\n.stf__hardShadow {\\n  position: absolute;\\n  left: 0;\\n  top: 0;\\n}\\n\\n.stf__hardInnerShadow {\\n  position: absolute;\\n  left: 0;\\n  top: 0;\\n}");t.PageFlip=class extends class{constructor(){this.events=new Map}on(t,e){return this.events.has(t)?this.events.get(t).push(e):this.events.set(t,[e]),this}off(t){this.events.delete(t)}trigger(t,e,i=null){if(this.events.has(t))for(const s of this.events.get(t))s({data:i,object:e})}}{constructor(t,e){super(),this.isUserTouch=!1,this.isUserMove=!1,this.setting=null,this.pages=null,this.setting=(new x).getSettings(e),this.block=t}destroy(){this.ui.destroy(),this.block.remove()}update(){this.render.update(),this.pages.show()}loadFromImages(t){this.ui=new u(this.block,this,this.setting);const e=this.ui.getCanvas();this.render=new d(this,this.setting,e),this.flipController=new g(this.render,this),this.pages=new n(this,this.render,t),this.pages.load(),this.render.start(),this.pages.show(this.setting.startPage),setTimeout(()=>{this.ui.update(),this.trigger("init",this,{page:this.setting.startPage,mode:this.render.getOrientation()})},1)}loadFromHTML(t){this.ui=new c(this.block,this,this.setting,t),this.render=new w(this,this.setting,this.ui.getDistElement()),this.flipController=new g(this.render,this),this.pages=new o(this,this.render,this.ui.getDistElement(),t),this.pages.load(),this.render.start(),this.pages.show(this.setting.startPage),setTimeout(()=>{this.ui.update(),this.trigger("init",this,{page:this.setting.startPage,mode:this.render.getOrientation()})},1)}updateFromImages(t){const e=this.pages.getCurrentPageIndex();this.pages.destroy(),this.pages=new n(this,this.render,t),this.pages.load(),this.pages.show(e),this.trigger("update",this,{page:e,mode:this.render.getOrientation()})}updateFromHtml(t){const e=this.pages.getCurrentPageIndex();this.pages.destroy(),this.pages=new o(this,this.render,this.ui.getDistElement(),t),this.pages.load(),this.ui.updateItems(t),this.render.reload(),this.pages.show(e),this.trigger("update",this,{page:e,mode:this.render.getOrientation()})}clear(){this.pages.destroy(),this.ui.clear()}turnToPrevPage(){this.pages.showPrev()}turnToNextPage(){this.pages.showNext()}turnToPage(t){this.pages.show(t)}flipNext(t="top"){this.flipController.flipNext(t)}flipPrev(t="top"){this.flipController.flipPrev(t)}flip(t,e="top"){this.flipController.flipToPage(t,e)}updateState(t){this.trigger("changeState",this,t)}updatePageIndex(t){this.trigger("flip",this,t)}updateOrientation(t){this.ui.setOrientationStyle(t),this.update(),this.trigger("changeOrientation",this,t)}getPageCount(){return this.pages.getPageCount()}getCurrentPageIndex(){return this.pages.getCurrentPageIndex()}getPage(t){return this.pages.getPage(t)}getRender(){return this.render}getFlipController(){return this.flipController}getOrientation(){return this.render.getOrientation()}getBoundsRect(){return this.render.getRect()}getSettings(){return this.setting}getUI(){return this.ui}getState(){return this.flipController.getState()}getPageCollection(){return this.pages}startUserTouch(t){this.mousePosition=t,this.isUserTouch=!0,this.isUserMove=!1}userMove(t,e){this.isUserTouch||e||!this.setting.showPageCorners?this.isUserTouch&&h.GetDistanceBetweenTwoPoint(this.mousePosition,t)>5&&(this.isUserMove=!0,this.flipController.fold(t)):this.flipController.showCorner(t)}userStop(t,e=!1){this.isUserTouch&&(this.isUserTouch=!1,e||(this.isUserMove?this.flipController.stopMove():this.flipController.flip(t)))}},Object.defineProperty(t,"__esModule",{value:!0})}));\n</script><script>'+E+"</script></body></html>"}],11605)}]);