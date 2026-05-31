"use strict";var RadioWidget=(()=>{var x=Object.defineProperty;var m=(a,e,t)=>e in a?x(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var i=(a,e,t)=>(m(a,typeof e!="symbol"?e+"":e,t),t);function l(a){for(let e=a.length-1;e>0;e--){let t=Math.floor(Math.random()*(e+1));[a[e],a[t]]=[a[t],a[e]]}return a}var o=class extends HTMLElement{constructor(){super();i(this,"shadow");i(this,"audio");i(this,"playlist",null);i(this,"queue",[]);i(this,"queueIndex",0);i(this,"expanded",!1);i(this,"state","idle");this.shadow=this.attachShadow({mode:"open"}),this.audio=new Audio,this.audio.preload="none"}static get observedAttributes(){return["data-source","theme","position"]}async connectedCallback(){let t=this.getAttribute("data-source")||"https://kerry.ink/widgets/radio/playlist.json";await this.loadPlaylist(t),this.render(),this.setupAudioHandlers(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.render())}disconnectedCallback(){this.audio.pause(),this.audio.src=""}async loadPlaylist(t){try{let s=await(await fetch(t)).json();this.playlist=s,this.queue=l([...s.tracks||[]]),this.queueIndex=0}catch(n){console.error("[radio-widget] Failed to load playlist",n)}}get currentTrack(){return this.queue[this.queueIndex]??null}loadTrack(t){this.audio.src=`https://cdn1.suno.ai/${t.id}.mp3`,this.state="loading",this.render(),this.audio.play().then(()=>{this.state="playing",this.render()}).catch(()=>{this.state="paused",this.render()})}nextTrack(){this.queueIndex++,this.queueIndex>=this.queue.length&&(this.queue=l([...this.playlist?.tracks||[]]),this.queueIndex=0),this.currentTrack&&this.loadTrack(this.currentTrack)}prevTrack(){this.queueIndex=Math.max(0,this.queueIndex-1),this.currentTrack&&this.loadTrack(this.currentTrack)}togglePlay(){this.state==="idle"||this.state==="paused"?!this.audio.src&&this.currentTrack?this.loadTrack(this.currentTrack):this.audio.play().then(()=>{this.state="playing",this.render()}):this.state==="playing"&&(this.audio.pause(),this.state="paused",this.render())}setupAudioHandlers(){this.audio.addEventListener("ended",()=>this.nextTrack()),this.audio.addEventListener("error",()=>{this.state="paused",this.render()}),this.audio.addEventListener("play",()=>{this.state="playing",this.render(),this.syncMediaSession()}),this.audio.addEventListener("pause",()=>{this.state="paused",this.render(),navigator.mediaSession&&(navigator.mediaSession.playbackState="paused")}),"mediaSession"in navigator&&(navigator.mediaSession.setActionHandler("play",()=>this.togglePlay()),navigator.mediaSession.setActionHandler("pause",()=>this.togglePlay()),navigator.mediaSession.setActionHandler("previoustrack",()=>this.prevTrack()),navigator.mediaSession.setActionHandler("nexttrack",()=>this.nextTrack()))}syncMediaSession(){if(!("mediaSession"in navigator))return;let t=this.currentTrack;t&&(navigator.mediaSession.metadata=new MediaMetadata({title:t.title,artist:this.playlist?.name??"97.5 KRRY"})),navigator.mediaSession.playbackState="playing"}resolveTheme(){let t=this.getAttribute("theme")||"auto";return t==="auto"?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":t}isLeft(){return(this.getAttribute("position")??"bottom-right").includes("left")}isTop(){return(this.getAttribute("position")??"bottom-right").includes("top")}render(){let t=this.resolveTheme()==="dark",n=this.currentTrack,s=this.state==="playing",d=this.state==="loading",v=s||d||this.state==="paused",c=this.isLeft(),p=this.isTop(),h=s?`<span class="eq">
          <span class="eq__bar" style="animation-delay:0s"></span>
          <span class="eq__bar" style="animation-delay:0.15s"></span>
          <span class="eq__bar" style="animation-delay:0.3s"></span>
        </span>`:'<span class="note">\u266B</span>',u=d?'<button class="ctrl ctrl--play" aria-label="Loading" disabled>\u22EF</button>':s?'<button class="ctrl ctrl--play" aria-label="Pause">\u23F8</button>':'<button class="ctrl ctrl--play" aria-label="Play">\u25B6</button>',g=`
      <style>
        :host {
          display: block;
          position: fixed;
          ${p?"top: 18px; bottom: auto;":"bottom: 18px; top: auto;"}
          ${c?"left: 18px; right: auto;":"right: 18px; left: auto;"}
          z-index: 999;
          font-family: 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --glass-bg: ${t?"rgba(20, 20, 20, 0.65)":"rgba(255, 255, 255, 0.75)"};
          --glass-border: ${t?"rgba(255, 255, 255, 0.15)":"rgba(255, 255, 255, 0.5)"};
          --text: ${t?"#e0e0e0":"#1a1a1a"};
          --muted: ${t?"#888":"#999"};
          --accent: ${t?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)"};
          --shadow: ${t?"0 8px 32px rgba(0,0,0,0.5),0 2px 8px rgba(0,0,0,0.3)":"0 8px 32px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.08)"};
          --spring: cubic-bezier(0.34, 1.26, 0.64, 1);
        }

        .widget {
          background: var(--glass-bg);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow);
          border-radius: 999px;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 0.4em;
          padding: 0.5em 0.75em;
          cursor: pointer;
          transition: border-radius 0.3s var(--spring), padding 0.3s var(--spring), box-shadow 0.2s ease;
          user-select: none;
          max-width: 280px;
          box-sizing: border-box;
          min-height: 40px;
          min-width: 40px;
        }

        .widget.is-expanded {
          border-radius: 20px;
          padding: 0.55em 0.85em;
        }

        .widget:hover {
          box-shadow: ${t?"0 12px 48px rgba(0,0,0,0.6),0 4px 12px rgba(0,0,0,0.4)":"0 12px 48px rgba(0,0,0,0.15),0 4px 12px rgba(0,0,0,0.1)"};
          border-color: ${t?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.7)"};
        }

        .note {
          font-size: 1.1em;
          flex-shrink: 0;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .widget:hover .note {
          opacity: 1;
        }

        /* Equalizer bars */
        .eq {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 16px;
          flex-shrink: 0;
        }

        .eq__bar {
          width: 3px;
          background: ${t?"rgba(255,255,255,0.7)":"rgba(0,0,0,0.5)"};
          border-radius: 2px;
          animation: eq-dance 0.8s ease-in-out infinite alternate;
        }

        @keyframes eq-dance {
          from { height: 4px; }
          to   { height: 14px; }
        }

        /* Track info */
        .track-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
          overflow: hidden;
        }

        .track-title {
          font-size: 0.8em;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--text);
          letter-spacing: 0.01em;
          max-width: 160px;
        }

        .station-name {
          font-size: 0.65em;
          color: var(--muted);
          white-space: nowrap;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* Controls */
        .controls {
          display: flex;
          align-items: center;
          gap: 0.15em;
          flex-shrink: 0;
        }

        .ctrl {
          background: none;
          border: none;
          color: var(--text);
          cursor: pointer;
          font-size: 0.9em;
          padding: 0.25em 0.3em;
          border-radius: 6px;
          transition: background 0.15s ease, transform 0.1s ease;
          line-height: 1;
          min-width: 28px;
          min-height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ctrl:hover {
          background: var(--accent);
        }

        .ctrl:active {
          transform: scale(0.9);
        }

        .ctrl--play {
          font-size: 1em;
          opacity: 0.9;
        }

        .ctrl--skip {
          font-size: 0.75em;
          opacity: 0.55;
        }

        .ctrl--skip:hover {
          opacity: 0.85;
        }

        .ctrl:disabled {
          opacity: 0.4;
          cursor: default;
        }

        /* Collapsed: just the note/eq, no track info */
        .widget:not(.is-expanded) .track-info,
        .widget:not(.is-expanded) .controls {
          display: none;
        }

        @media (hover: none) {
          .widget:hover { box-shadow: var(--shadow); }
        }
      </style>

      <div class="widget${this.expanded?" is-expanded":""}" id="widget">
        ${h}
        <div class="track-info">
          <span class="track-title">${n?n.title:"\u2014"}</span>
          <span class="station-name">${this.playlist?.name??"Radio"}</span>
        </div>
        <div class="controls">
          <button class="ctrl ctrl--skip" id="btn-prev" aria-label="Previous">\u23EE</button>
          ${u}
          <button class="ctrl ctrl--skip" id="btn-next" aria-label="Next">\u23ED</button>
        </div>
      </div>
    `;this.shadow.innerHTML=g,this.shadow.getElementById("widget")?.addEventListener("click",b=>{let r=b.target;r.id==="btn-prev"||r.closest("#btn-prev")?this.prevTrack():r.id==="btn-next"||r.closest("#btn-next")?this.nextTrack():r.classList.contains("ctrl--play")||r.closest(".ctrl--play")?this.togglePlay():(this.expanded=!this.expanded,this.expanded&&this.state==="idle"&&this.currentTrack?this.loadTrack(this.currentTrack):this.render())})}};customElements.get("radio-widget")||customElements.define("radio-widget",o);})();
//# sourceMappingURL=radio.wc.js.map
