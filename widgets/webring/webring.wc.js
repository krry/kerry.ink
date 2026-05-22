"use strict";var WebringWidget=(()=>{var k=Object.defineProperty;var $=(i,r,t)=>r in i?k(i,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[r]=t;var m=(i,r,t)=>($(i,typeof r!="symbol"?r+"":r,t),t);async function u(i){if(typeof i=="object"&&i!==null)return i;if(typeof i=="string"){let r=await fetch(i);if(!r.ok)throw new Error(`Failed to fetch webring data from ${i}: ${r.statusText}`);return r.json()}throw new Error("Invalid data source: must be a URL string or WebringData object")}function f(i){return typeof i=="object"&&typeof i.version=="string"&&Array.isArray(i.links)&&i.links.every(r=>typeof r.name=="string"&&typeof r.url=="string")}var h=class extends HTMLElement{constructor(){super();m(this,"shadow");m(this,"data",null);m(this,"loading",!1);this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){return["data-source","size","theme","position"]}async connectedCallback(){await this.loadData(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.getAttribute("theme")==="auto"&&this.updateTheme()})}async attributeChangedCallback(t,e,n){e!==n&&(t==="data-source"?(this.data=null,await this.loadData()):t==="size"?this.updateSize(n):t==="theme"?this.updateTheme():t==="position"&&this.updatePosition(n))}async loadData(){if(this.loading)return;let t=this.getAttribute("data-source");if(t){this.loading=!0;try{let e=await u(t);f(e)&&(this.data=e,this.render())}catch(e){console.error("Webring failed to load",e)}finally{this.loading=!1}}}resolveTheme(){let t=this.getAttribute("theme")||"auto";return t==="auto"?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":t}getSize(){return this.getAttribute("size")||"small"}updateSize(t){let e=this.shadow.querySelector(".widget");e&&e.setAttribute("data-size",t)}updateTheme(){this.render()}updatePosition(t){let e=this.shadow.querySelector(".widget");e&&(e.classList.toggle("is-left",t.includes("left")),e.classList.toggle("is-top",t.includes("top")))}isLeft(){return(this.getAttribute("position")??"").includes("left")}isTop(){return(this.getAttribute("position")??"").includes("top")}getLinkColor(t){if(t.color)return t.color;let e=t.url;return e.includes("github.com")?"#6e5494":e.includes("twitter.com")||e.includes("x.com")?"#1da1f2":e.includes("mastodon")?"#6364ff":e.includes("linkedin")?"#0077b5":e.includes("youtube")?"#ff0000":e.includes("instagram")?"#e4405f":e.includes("strangerloops")?"#ff6b6b":e.includes("svnr")?"#48D2F4":"#8b5cf6"}render(){if(!this.data)return;let e=this.resolveTheme()==="dark",n=this.getSize(),x=this.data.links.map((a,o)=>{let s=this.getLinkColor(a),l=parseInt(s.slice(1,3),16),c=parseInt(s.slice(3,5),16),p=parseInt(s.slice(5,7),16);return`
      .link-${o} {
        color: ${s};
      }
      .link-${o}:hover {
        background: rgba(${l}, ${c}, ${p}, ${e?"0.2":"0.15"});
        border-left: 3px solid ${s};
        padding-left: calc(0.75em - 3px);
      }
    `}).join(""),w=`
      <style>
        :host {
          display: block;
          font-family: system-ui, sans-serif;
          /* Responsive positioning \u2014 can be overridden via CSS custom properties */
          --widget-bottom: 18px;
          --widget-right: 18px;
          --widget-top: auto;
          --widget-left: auto;
          position: fixed;
          bottom: var(--widget-bottom);
          right: var(--widget-right);
          top: var(--widget-top);
          left: var(--widget-left);
          z-index: 1000;
          --glass-bg: ${e?"rgba(20, 20, 20, 0.6)":"rgba(255, 255, 255, 0.7)"};
          --glass-border: ${e?"rgba(255, 255, 255, 0.15)":"rgba(255, 255, 255, 0.5)"};
          --text: ${e?"#e0e0e0":"#1a1a1a"};
          --text-muted: ${e?"#a0a0a0":"#666"};
          --hover-bg: ${e?"rgba(255, 255, 255, 0.05)":"rgba(0, 0, 0, 0.05)"};
          --shadow: ${e?"0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)":"0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)"};
          --spring: cubic-bezier(0.34, 1.26, 0.64, 1);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-4px) scale(1.01); }
        }

        .handle {
          width: 3.5em;
          height: 3.5em;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${e?"rgba(255, 255, 255, 0.3)":"rgba(0, 0, 0, 0.2)"};
          transform: rotate(40deg);
        }

        .widget[data-size="medium"] .handle {
          transform: rotate(-135deg);
        }

        .handle:hover {
          transform: rotate(45deg) scale(1.15);
          color: ${e?"rgba(255, 255, 255, 0.5)":"rgba(0, 0, 0, 0.35)"};
        }

        .widget[data-size="medium"] .handle:hover {
          transform: rotate(-135deg) scale(1.15);
        }

        .handle:active {
          transform: scale(0.9);
        }

        .widget {
          background: var(--glass-bg);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow);
          color: var(--text);
          font-family: 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          font-size: clamp(14px, 2.5vw, 16px);
          position: relative;
          overflow: hidden;
          will-change: width, height, border-radius;
          display: inline-block;
          width: fit-content;
          max-width: 100%;
          box-sizing: border-box;
          border-radius: 12px;
          transition: box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.4s ease;
        }

        .widget:hover {
          box-shadow: ${e?"0 2px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)":"0 2px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)"};
        }

        /* Size Variants */
        .widget[data-size="small"] {
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          border-radius: 14px;
        }

        .widget[data-size="medium"] {
          display: flex;
          flex-direction: column;
          height: auto;
          min-height: 64px;
          border-radius: 20px;
        }

        .widget.is-top[data-size="medium"] {
          flex-direction: column-reverse;
        }

        @keyframes bounce-lift {
          0%   { transform: translateY(0); }
          40%  { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }

        .widget:hover {
          box-shadow: ${e?"0 12px 48px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4)":"0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)"};
          border-color: ${e?"rgba(255, 255, 255, 0.25)":"rgba(255, 255, 255, 0.7)"};
        }

        /* Logo Layout */
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          user-select: none;
          transition: padding 0.6s var(--spring);
        }

        .widget[data-size="medium"] .logo-container {
          padding: 0 0.5em 0 1em;
          border-top: 1px solid var(--glass-border);
        }

        .widget.is-top[data-size="medium"] .logo-container {
          border-top: none;
          border-bottom: 1px solid var(--glass-border);
        }

        .logo-nib {
          font-size: 2.4rem;
          line-height: 1.2;
        }

        .widget[data-size="small"] .logo-nib {
          font-size: 1.2rem;
        }
        
        .logo-text {
          font-family: 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          font-size: 1.326em;
          font-weight: 600;
          color: var(--text);
          text-decoration: none;
          text-indent: 1em;
          transition: opacity 0.2s ease;
          display: inline-block;
          width: 8em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .widget[data-size="small"] .logo-container {
          justify-content: center;
          padding: 0;
          width: 40px;
          height: 40px;
        }

        .widget.is-left .logo-container {
          flex-direction: row-reverse;
        }

        .widget[data-size="small"] .logo-text {
          display: none;
        }

        .widget[data-size="medium"] .logo-text {
          display: inline-block;
        }

        .logo-link:hover .logo-text {
          opacity: 0.8;
        }

        /* Links List */
        .links {
          list-style: none;
          padding: 0.5rem;
          margin: 0;
          overflow: hidden;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        /* Emoji-only grid: hide text labels */
        .links a .link-label {
          display: none;
        }

        .widget[data-size="small"] .links {
          display: none;
          opacity: 0;
        }

        .widget[data-size="medium"] .links {
          opacity: 1;
        }

        .links li {
          margin: 0;
          opacity: 0;
          animation: fade-in-up 0.4s var(--spring) forwards;
        }

        ${this.data.links.map((a,o)=>`.links li:nth-child(${o+1}) { animation-delay: ${.05*o}s; }`).join(`
        `)}

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .links a {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4em;
          padding: 0.45em 0.8em;
          text-decoration: none;
          font-size: 0.85em;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 999px;
          min-width: 44px;
          min-height: 44px;
          box-sizing: border-box;
        }

        .widget[data-size="medium"] .links a {
          font-size: 0.95em;
          padding: 0.6em 1em;
          min-height: 44px; /* Ensure tap target */
        }

        .links a span.link-label {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .links a:hover {
          background: ${e?"rgba(0, 0, 0, 0.2)":"rgba(0, 0, 0, 0.06)"};
          box-shadow: inset 0 1px 3px ${e?"rgba(0, 0, 0, 0.5)":"rgba(0, 0, 0, 0.12)"}, inset 0 1px 1px ${e?"rgba(0, 0, 0, 0.3)":"rgba(0, 0, 0, 0.08)"};
        }

        .links a:active {
          background: ${e?"rgba(0, 0, 0, 0.3)":"rgba(0, 0, 0, 0.1)"};
          box-shadow: inset 0 2px 4px ${e?"rgba(0, 0, 0, 0.6)":"rgba(0, 0, 0, 0.15)"};
          transform: scale(0.97);
          transition: transform 0.1s ease;
        }

        @keyframes emoji-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .link-emoji {
          font-size: 1.4em;
          flex-shrink: 0;
          transition: transform 0.3s var(--spring);
        }

        .links a:hover .link-emoji {
          animation: emoji-bounce 0.5s var(--spring);
        }

        ${x}

        @media (hover: none) {
          .widget:hover {
            box-shadow: var(--shadow);
          }
        }
      </style>
    `,v=`
      <ul class="links">
        ${this.data.links.map((a,o)=>{let s=this.getLinkColor(a);return`
          <li>
            <a href="${a.url}" class="link-${o}" data-name="${a.name}" data-color="${s}" title="${a.description||a.name}" target="_blank">
              <span class="link-emoji">${a.emoji??"\u{1F517}"}</span>
              <span class="link-label">${a.name}</span>
            </a>
          </li>
        `}).join("")}
      </ul>
    `,z=`<svg width="100%" height="100%" viewBox="0 0 80.252602 81.155724" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-10.698367,-11.054825)">
        <path d="m 143.65518,206.83961 c 2.41591,10.33473 -49.397142,58.91822 -59.555232,55.8431 -10.15809,-3.07513 -26.326103,-72.23829 -18.583923,-79.49789 7.742179,-7.2596 75.723245,13.32007 78.139155,23.65479 z" transform="translate(-52.786019,-170.61192)" />
      </g>
    </svg>`,y=`
      ${w}
      <div class="widget${this.isLeft()?" is-left":""}${this.isTop()?" is-top":""}" data-size="${n}">
        ${v}
        <div class="logo-container">
          <a href="https://kerry.ink" class="logo-link" target="_blank" style="display: flex; align-items: center; gap: 0.5em; text-decoration: none; color: inherit;">
            <span class="logo-text">kerry.ink</span>
          </a>
          <div class="handle"><span class="logo-nib">\u2712\uFE0E</span></div>
        </div>
      </div>
    `;this.shadow.innerHTML=y;let d=this.shadow.querySelector(".logo-text"),g=this.shadow.querySelector(".widget");this.shadow.querySelectorAll(".links a").forEach(a=>{let o=a.getAttribute("data-name"),s=a.getAttribute("data-color"),l=null;if(s){let c=parseInt(s.slice(1,3),16),p=parseInt(s.slice(3,5),16),b=parseInt(s.slice(5,7),16);l=e?`rgba(${c}, ${p}, ${b}, 0.18)`:`rgba(${Math.round(c*.2+255*.8)}, ${Math.round(p*.2+255*.8)}, ${Math.round(b*.2+255*.8)}, 0.6)`}a.addEventListener("mouseenter",()=>{d&&o&&(d.textContent=o),g&&l&&(g.style.background=l)}),a.addEventListener("mouseleave",()=>{d&&(d.textContent="kerry.ink"),g&&(g.style.background="")})}),this.shadow.querySelector(".handle")?.addEventListener("click",a=>{a.stopPropagation();let s=this.getSize()==="small"?"medium":"small";this.setAttribute("size",s)})}};customElements.get("webring-widget")||customElements.define("webring-widget",h);})();
//# sourceMappingURL=webring.wc.js.map
