/**
 * background-effects.js
 * Generates diversified engineering-themed background elements.
 */

const BackgroundEffects = {
  init() {
    const layer = document.createElement('div');
    layer.className = 'bg-effects-layer';
    document.body.prepend(layer);

    this.createConsoleData(layer);
    this.createLightbulbs(layer);
    this.createSwitches(layer);
    this.createDataBars(layer);
    this.createGears(layer);
    this.createHexGrid(layer);
    this.createWaves(layer);
  },

  createConsoleData(container) {
    const lines = [
      "SYSTEM_READY > 0x4F2A",
      "CORE_TEMP : 34.2C",
      "BUS_LOAD : 12%",
      "01101001 01101110",
      "LINK_ESTABLISHED",
      "VOLT_REG : STABLE",
      "INIT_SEQUENCE_B",
      "SIM_MODE_ACTIVE",
      "FETCH_ADDR_0x00FF",
      "PARITY_CHECK_PASS",
      "MEM_RESERVE_ALLOC",
      "GATE_THRESHOLD_SET"
    ];

    for (let i = 0; i < 18; i++) {
      const item = document.createElement('div');
      item.className = 'bg-console-item';
      item.textContent = lines[Math.floor(Math.random() * lines.length)];
      item.style.left = Math.random() * 95 + '%';
      item.style.animationDelay = Math.random() * 20 + 's';
      item.style.animationDuration = 12 + Math.random() * 18 + 's';
      container.appendChild(item);
    }
  },

  createLightbulbs(container) {
    for (let i = 0; i < 20; i++) {
      const light = document.createElement('div');
      light.className = 'bg-lightbulb flicker';
      light.style.top = Math.random() * 95 + '%';
      light.style.left = Math.random() * 95 + '%';
      light.style.animationDelay = Math.random() * 8 + 's';
      container.appendChild(light);
    }
  },

  createSwitches(container) {
    for (let i = 0; i < 12; i++) {
      const sw = document.createElement('div');
      sw.className = 'bg-switch';
      sw.style.top = Math.random() * 90 + '%';
      sw.style.left = Math.random() * 95 + '%';
      
      setInterval(() => {
        sw.classList.toggle('on');
      }, 1500 + Math.random() * 6000);
      
      container.appendChild(sw);
    }
  },

  createGears(container) {
    for (let i = 0; i < 4; i++) {
      const gear = document.createElement('div');
      gear.className = 'bg-gear';
      gear.style.top = Math.random() * 80 + '%';
      gear.style.left = Math.random() * 90 + '%';
      gear.style.animationDirection = i % 2 === 0 ? 'normal' : 'reverse';
      gear.style.opacity = (0.1 + Math.random() * 0.1).toString();
      container.appendChild(gear);
    }
  },

  createHexGrid(container) {
    for (let i = 0; i < 6; i++) {
      const hex = document.createElement('div');
      hex.className = 'bg-hex';
      hex.style.top = Math.random() * 90 + '%';
      hex.style.left = Math.random() * 90 + '%';
      hex.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(hex);
    }
  },

  createWaves(container) {
    for (let i = 0; i < 3; i++) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "bg-wave");
      svg.setAttribute("viewBox", "0 0 150 40");
      svg.style.top = (10 + Math.random() * 80) + '%';
      svg.style.left = (Math.random() * 70) + '%';
      
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const d = "M0,20 Q15,5 30,20 T60,20 T90,20 T120,20 T150,20";
      path.setAttribute("d", d);
      svg.appendChild(path);
      container.appendChild(svg);
    }
  },

  createDataBars(container) {
    const group = document.createElement('div');
    group.style.position = 'absolute';
    group.style.bottom = '30px';
    group.style.right = '50px';
    group.style.display = 'flex';
    group.style.gap = '5px';
    group.style.alignItems = 'flex-end';
    
    for (let i = 0; i < 15; i++) {
      const bar = document.createElement('div');
      bar.className = 'bg-data-bar';
      bar.style.position = 'relative';
      bar.style.animationDelay = (i * 0.15) + 's';
      group.appendChild(bar);
    }
    container.appendChild(group);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => BackgroundEffects.init());
} else {
  BackgroundEffects.init();
}
