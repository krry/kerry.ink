"use strict";var WebringWidget=(()=>{var g=Object.defineProperty;var m=(t,e,a)=>e in t?g(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var i=(t,e,a)=>(m(t,typeof e!="symbol"?e+"":e,a),a);async function n(t){if(typeof t=="object"&&t!==null)return t;if(typeof t=="string"){let e=await fetch(t);if(!e.ok)throw new Error(`Failed to fetch webring data from ${t}: ${e.statusText}`);return e.json()}throw new Error("Invalid data source: must be a URL string or WebringData object")}function l(t){return typeof t=="object"&&typeof t.version=="string"&&Array.isArray(t.links)&&t.links.every(e=>typeof e.name=="string"&&typeof e.url=="string")}var s=class extends HTMLElement{constructor(){super();i(this,"shadow");i(this,"data",null);i(this,"loading",!1);this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){return["data-source","mode","theme"]}async connectedCallback(){await this.loadData(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.getAttribute("theme")==="auto"&&this.render()})}async attributeChangedCallback(a){a==="data-source"?(this.data=null,await this.loadData()):this.render()}async loadData(){if(this.loading)return;let a=this.getAttribute("data-source");if(a){this.loading=!0;try{let r=await n(a);l(r)&&(this.data=r,this.render())}catch(r){console.error("Webring failed to load",r)}finally{this.loading=!1}}}resolveTheme(){let a=this.getAttribute("theme")||"auto";return a==="auto"?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":a}render(){if(!this.data)return;let r=this.resolveTheme()==="dark",d=`
      ${`
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,MONO@-15..0,300..1000,0..1,0..1&display=swap');

        :host {
          display: block;
          font-family: 'Recursive', system-ui, sans-serif;
          --glass-bg: ${r?"rgba(20, 20, 20, 0.6)":"rgba(255, 255, 255, 0.6)"};
          --glass-border: ${r?"rgba(255, 255, 255, 0.1)":"rgba(255, 255, 255, 0.4)"};
          --text: ${r?"#e0e0e0":"#1a1a1a"};
          --text-muted: ${r?"#a0a0a0":"#666"};
          --hover-bg: ${r?"rgba(255, 255, 255, 0.05)":"rgba(0, 0, 0, 0.05)"};
          --shadow: ${r?"0 8px 32px rgba(0, 0, 0, 0.4)":"0 8px 32px rgba(0, 0, 0, 0.1)"};
        }

        details {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          box-shadow: var(--shadow);
          color: var(--text);
          width: max-content;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        details[open] {
          width: 200px;
        }

        summary {
          list-style: none;
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          user-select: none;
          outline: none;
        }

        summary::-webkit-details-marker {
          display: none;
        }

        summary:hover {
          background: var(--hover-bg);
        }

        /* Rotating caret */
        summary::after {
          content: '\u203A';
          display: inline-block;
          font-family: system-ui; /* Reliable arrow */
          margin-left: auto;
          transition: transform 0.2s ease;
          font-size: 1.2em;
          line-height: 1;
        }

        details[open] summary::after {
          transform: rotate(90deg);
        }

        /* Title link */
        .title-link {
          color: inherit;
          text-decoration: none;
          font-weight: 800;
          font-variation-settings: 'CASL' 1, 'MONO' 0;
          margin-right: 0.25rem;
        }
        
        .title-link:hover {
          text-decoration: underline;
          text-decoration-thickness: 2px;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          border-top: 1px solid var(--glass-border);
        }

        li a {
          display: block;
          padding: 0.5rem 0.75rem;
          color: var(--text);
          text-decoration: none;
          font-size: 0.9em;
          transition: background 0.15s ease, padding-left 0.15s ease;
        }

        li a:hover {
          background: var(--hover-bg);
          padding-left: 1rem;
          color: var(--text);
        }
      </style>
    `}
      <details>
        <summary>
          <a href="https://kerry.ink" class="title-link" target="_blank">\u{1FAE0}\u2712\uFE0F</a>
        </summary>
        <ul>
          ${this.data.links.map(o=>`
            <li>
              <a href="${o.url}" title="${o.description||""}" target="_blank">
                ${o.name}
              </a>
            </li>
          `).join("")}
        </ul>
      </details>
    `;this.shadow.innerHTML=d}};customElements.get("webring-widget")||customElements.define("webring-widget",s);})();
//# sourceMappingURL=webring.wc.js.map
