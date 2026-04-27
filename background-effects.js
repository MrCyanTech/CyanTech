/**
 * background-effects.js
 * Generates highly diversified engineering-themed background elements with parallax.
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

    // Parallax logic on scroll
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const lightbulbs = document.querySelectorAll('.bg-lightbulb');
      const hexes = document.querySelectorAll('.bg-hex');
      
      lightbulbs.forEach((el, i) => {
        const speed = 0.05 + (i % 5) * 0.02;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });

      hexes.forEach((el, i) => {
        const speed = -0.03 - (i % 3) * 0.01;
        el.style.transform = `translateY(${scrolled * speed}px) rotate(${i * 10}deg)`;
      });
    });
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
      "GATE_THRESHOLD_SET",
      "SIGNAL_LOCKED_PLL",
      "CRC_VAL_MATCHED",
      "ENCRYPT_RSA_AES",
      "DEBUG_ATTACHED"
    ];

    for (let i = 0; i < 22; i++) {
      const item = document.createElement('div');
      item.className = 'bg-console-item';
      item.textContent = lines[Math.floor(Math.random() * lines.length)];
      item.style.left = Math.random() * 95 + '%';
      item.style.animationDelay = Math.random() * 20 + 's';
      item.style.animationDuration = 10 + Math.random() * 20 + 's';
      item.style.fontSize = (10 + Math.random() * 4) + 'px';
      container.appendChild(item);
    }
  },

  createLightbulbs(container) {
    for (let i = 0; i < 25; i++) {
      const light = document.createElement('div');
      light.className = 'bg-lightbulb flicker';
      const size = 4 + Math.random() * 6;
      light.style.width = size + 'px';
      light.style.height = size + 'px';
      light.style.top = Math.random() * 120 + '%'; // Spread out more for scroll
      light.style.left = Math.random() * 95 + '%';
      light.style.animationDelay = Math.random() * 10 + 's';
      container.appendChild(light);
    }
  },

  createSwitches(container) {
    for (let i = 0; i < 15; i++) {
      const sw = document.createElement('div');
      sw.className = 'bg-switch';
      sw.style.top = Math.random() * 95 + '%';
      sw.style.left = Math.random() * 95 + '%';
      
      setInterval(() => {
        sw.classList.toggle('on');
      }, 1000 + Math.random() * 8000);
      
      container.appendChild(sw);
    }
  },

  createGears(container) {
    for (let i = 0; i < 6; i++) {
      const gear = document.createElement('div');
      gear.className = 'bg-gear';
      const size = 40 + Math.random() * 80;
      gear.style.width = size + 'px';
      gear.style.height = size + 'px';
      gear.style.top = Math.random() * 90 + '%';
      gear.style.left = Math.random() * 90 + '%';
      gear.style.animationDirection = i % 2 === 0 ? 'normal' : 'reverse';
      gear.style.animationDuration = (10 + Math.random() * 20) + 's';
      container.appendChild(gear);
    }
  },

  createHexGrid(container) {
    for (let i = 0; i < 10; i++) {
      const hex = document.createElement('div');
      hex.className = 'bg-hex';
      const size = 40 + Math.random() * 100;
      hex.style.width = size + 'px';
      hex.style.height = (size * 0.6) + 'px';
      hex.style.top = Math.random() * 150 + '%';
      hex.style.left = Math.random() * 95 + '%';
      hex.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(hex);
    }
  },

  createWaves(container) {
    for (let i = 0; i < 5; i++) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "bg-wave");
      svg.setAttribute("viewBox", "0 0 150 40");
      svg.style.top = (Math.random() * 95) + '%';
      svg.style.left = (Math.random() * 80) + '%';
      svg.style.width = (100 + Math.random() * 200) + 'px';
      
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
    group.style.bottom = '40px';
    group.style.right = '60px';
    group.style.display = 'flex';
    group.style.gap = '6px';
    group.style.alignItems = 'flex-end';
    
    for (let i = 0; i < 20; i++) {
      const bar = document.createElement('div');
      bar.className = 'bg-data-bar';
      bar.style.position = 'relative';
      bar.style.width = (2 + Math.random() * 2) + 'px';
      bar.style.animationDelay = (i * 0.1) + 's';
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
