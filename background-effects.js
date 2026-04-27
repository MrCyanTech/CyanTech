/**
 * background-effects.js
 * Generates subtle engineering-themed background elements.
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
      "SIM_MODE_ACTIVE"
    ];

    for (let i = 0; i < 12; i++) {
      const item = document.createElement('div');
      item.className = 'bg-console-item';
      item.textContent = lines[Math.floor(Math.random() * lines.length)];
      item.style.left = Math.random() * 90 + '%';
      item.style.animationDelay = Math.random() * 20 + 's';
      item.style.animationDuration = 15 + Math.random() * 15 + 's';
      container.appendChild(item);
    }
  },

  createLightbulbs(container) {
    for (let i = 0; i < 15; i++) {
      const light = document.createElement('div');
      light.className = 'bg-lightbulb flicker';
      light.style.top = Math.random() * 90 + '%';
      light.style.left = Math.random() * 95 + '%';
      light.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(light);
    }
  },

  createSwitches(container) {
    for (let i = 0; i < 8; i++) {
      const sw = document.createElement('div');
      sw.className = 'bg-switch';
      sw.style.top = Math.random() * 90 + '%';
      sw.style.left = Math.random() * 95 + '%';
      
      // Randomly toggle state
      setInterval(() => {
        sw.classList.toggle('on');
      }, 2000 + Math.random() * 5000);
      
      container.appendChild(sw);
    }
  },

  createDataBars(container) {
    const group = document.createElement('div');
    group.style.position = 'absolute';
    group.style.bottom = '20px';
    group.style.right = '40px';
    group.style.display = 'flex';
    group.style.gap = '4px';
    group.style.alignItems = 'flex-end';
    
    for (let i = 0; i < 10; i++) {
      const bar = document.createElement('div');
      bar.className = 'bg-data-bar';
      bar.style.position = 'relative'; // Override absolute for flex child
      bar.style.animationDelay = (i * 0.2) + 's';
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
