"use strict";var WebringWidget=(()=>{var s=Object.defineProperty;var b=Object.getOwnPropertyDescriptor;var c=Object.getOwnPropertyNames;var h=Object.prototype.hasOwnProperty;var m=(e,r,t)=>r in e?s(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t;var u=(e,r)=>{for(var t in r)s(e,t,{get:r[t],enumerable:!0})},p=(e,r,t,a)=>{if(r&&typeof r=="object"||typeof r=="function")for(let i of c(r))!h.call(e,i)&&i!==t&&s(e,i,{get:()=>r[i],enumerable:!(a=b(r,i))||a.enumerable});return e};var f=e=>p(s({},"__esModule",{value:!0}),e);var o=(e,r,t)=>(m(e,typeof r!="symbol"?r+"":r,t),t);var v={};u(v,{default:()=>w});async function g(e){if(typeof e=="object"&&e!==null)return e;if(typeof e=="string"){let r=await fetch(e);if(!r.ok)throw new Error(`Failed to fetch webring data from ${e}: ${r.statusText}`);return r.json()}throw new Error("Invalid data source: must be a URL string or WebringData object")}function l(e){return typeof e=="object"&&typeof e.version=="string"&&Array.isArray(e.links)&&e.links.every(r=>typeof r.name=="string"&&typeof r.url=="string")}var d=class extends HTMLElement{constructor(){super();o(this,"shadow");o(this,"data",null);o(this,"loading",!1);this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){return["data-source","mode","theme"]}async connectedCallback(){this.render(),await this.loadData(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.getAttribute("theme")==="auto"&&this.render()})}async attributeChangedCallback(t,a,i){t==="data-source"?(this.data=null,await this.loadData(),this.render()):this.render()}async loadData(){if(this.loading)return;let t=this.getAttribute("data-source");if(!t){this.renderError("No data-source attribute provided");return}this.loading=!0,this.renderLoading();try{if(this.data=await g(t),!l(this.data)){this.renderError("Invalid webring data format");return}this.render()}catch(a){let i=a instanceof Error?a.message:"Failed to load webring data";this.renderError(i)}finally{this.loading=!1}}resolveTheme(){let t=this.getAttribute("theme")||"auto";return t==="auto"?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":t}render(){let t=this.getAttribute("mode")||"compact",a=this.resolveTheme();if(!this.data)return;let i=`
      <style>
        :host {
          /* Light mode defaults (glass effect) */
          --glass-bg: rgba(255, 255, 255, 0.5);
          --glass-border: rgba(255, 255, 255, 0.62);
          --text: rgba(0, 0, 0, 0.82);
          --muted: rgba(0, 0, 0, 0.62);
          --shadow: rgba(0, 0, 0, 0.18);
          --blur: 18px;
        }

        .webring {
          color: var(--text);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(var(--blur));
          -webkit-backdrop-filter: blur(var(--blur));
          box-shadow: 0 12px 40px var(--shadow);
          border-radius: 12px;
          padding: 1rem;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .webring--dark {
          --glass-bg: rgba(255, 255, 255, 0.14);
          --glass-border: rgba(255, 255, 255, 0.28);
          --text: rgba(255, 255, 255, 0.92);
          --muted: rgba(255, 255, 255, 0.7);
          --shadow: rgba(0, 0, 0, 0.35);
        }

        .webring__title {
          margin: 0 0 0.5rem 0;
          font-size: 1.1em;
          font-weight: 600;
        }

        .webring__links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .webring__link-item {
          margin: 0.5rem 0;
        }

        .webring__link {
          color: var(--text);
          text-decoration: none;
          opacity: 0.85;
          transition: opacity 120ms ease;
        }

        .webring__link:hover {
          opacity: 1;
        }

        .webring__description {
          margin: 0.25rem 0 0 0;
          font-size: 0.9em;
          color: var(--muted);
        }
      </style>

      <div class="webring webring--${t}${a==="dark"?" webring--dark":""}">
        <h3 class="webring__title">Webring</h3>
        <ul class="webring__links">
          ${this.data.links.map(n=>`
            <li class="webring__link-item">
              <a href="${n.url}" class="webring__link" title="${n.description||n.name}">
                ${n.name}
              </a>
              ${n.description&&t==="full"?`<p class="webring__description">${n.description}</p>`:""}
            </li>
          `).join("")}
        </ul>
      </div>
    `;this.shadow.innerHTML=i}renderLoading(){this.shadow.innerHTML='<div style="padding: 1rem; text-align: center;">Loading webring...</div>'}renderError(t){this.shadow.innerHTML=`<div style="padding: 1rem; color: #c33; background: #fdd; border: 1px solid #fbb; border-radius: 4px;">Error: ${t}</div>`}};customElements.get("webring-widget")||customElements.define("webring-widget",d);var w=d;return f(v);})();
//# sourceMappingURL=webring.wc.js.map
