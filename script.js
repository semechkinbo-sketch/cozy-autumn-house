// Responsive Scaling for Phones & PCs
const updateScale = () => {
  const padding = 24;
  const scale = Math.min(
    (window.innerWidth - padding) / 440,
    (window.innerHeight - padding) / 440,
    1.15
  );
  document.documentElement.style.setProperty('--scene-scale', scale.toFixed(3));
};
window.addEventListener('resize', updateScale);
updateScale();

window.onload = () => {
  const card = document.getElementById('card');
  const celestial = document.getElementById('celestial');
  const stormCloud = document.getElementById('stormCloud');
  const rainLayer = document.getElementById('rainLayer');
  const lightningFlash = document.getElementById('lightningFlash');
  const windowEl = document.getElementById('window');
  const doorEl = document.getElementById('door');
  const doorFrame = document.getElementById('doorFrame');
  const chimneyEl = document.getElementById('chimney');
  const smokeEl = document.getElementById('smoke');
  const birdEl = document.getElementById('bird');
  const birdFx = document.getElementById('birdFx');
  const pumpkinEl = document.getElementById('pumpkin');
  const mushroomsEl = document.getElementById('mushrooms');
  const starsContainer = document.getElementById('stars');
  const ambientFireflies = document.getElementById('ambientFireflies');
  const treeParticles = document.getElementById('treeParticles');
  const spruceTrees = document.querySelectorAll('.spruce-tree');

  const layerDistant = document.getElementById('layerDistant');
  const layerMist = document.getElementById('layerMist');
  const layerMidground = document.getElementById('layerMidground');
  const layerHouse = document.getElementById('layerHouse');

  // ================= WEB AUDIO API SOUND ENGINE =================
  let audioCtx = null;
  let rainGainNode = null;
  let isRaining = false;

  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  };

  const toggleRainAudio = (active) => {
    initAudio();
    const now = audioCtx.currentTime;
    if (active) {
      if (!rainGainNode) {
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, now);

        rainGainNode = audioCtx.createGain();
        rainGainNode.gain.setValueAtTime(0.001, now);

        whiteNoise.connect(filter);
        filter.connect(rainGainNode);
        rainGainNode.connect(audioCtx.destination);
        whiteNoise.start(now);
      }
      rainGainNode.gain.cancelScheduledValues(now);
      rainGainNode.gain.setValueAtTime(rainGainNode.gain.value, now);
      rainGainNode.gain.linearRampToValueAtTime(0.065, now + 0.5);
    } else if (rainGainNode) {
      rainGainNode.gain.cancelScheduledValues(now);
      rainGainNode.gain.setValueAtTime(rainGainNode.gain.value, now);
      rainGainNode.gain.linearRampToValueAtTime(0.0001, now + 0.4);
    }
  };

  const playThunder = () => {
    initAudio();
    const now = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 1.6;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(190, now);
    filter.frequency.exponentialRampToValueAtTime(55, now + 1.5);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.55);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(now);
    noise.stop(now + 1.6);
  };

  const playOwlHoot = () => {
    initAudio();
    const now = audioCtx.currentTime;
    const hoot = (start, dur, f1, f2) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(f1, start);
      osc.frequency.exponentialRampToValueAtTime(f2, start + dur);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.start(start);
      osc.stop(start + dur);
    };
    hoot(now, 0.18, 420, 380);
    hoot(now + 0.24, 0.38, 390, 290);
  };

  const playSwitch = () => {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.start(now);
    osc.stop(now + 0.04);
  };

  const playMagicPop = (high = true) => {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(high ? 520 : 340, now);
    osc.frequency.exponentialRampToValueAtTime(high ? 980 : 620, now + 0.18);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.18);
  };

  const playDoor = (isOpen) => {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(isOpen ? 130 : 210, now);
    osc.frequency.linearRampToValueAtTime(isOpen ? 230 : 110, now + 0.26);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    osc.start(now);
    osc.stop(now + 0.26);
  };

  const playPuff = () => {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.18);
  };

  const playChime = (isNight) => {
    initAudio();
    const now = audioCtx.currentTime;
    const notes = isNight ? [659.25, 523.25, 392.00] : [392.00, 523.25, 659.25];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.1, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  };

  const playTreeRustle = (isNight) => {
    initAudio();
    const now = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 0.28;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isNight ? 1800 : 2200, now);
    filter.Q.setValueAtTime(1.8, now);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.14, now + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.27);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    whiteNoise.start(now);
    whiteNoise.stop(now + 0.28);
  };

  // ================= SCENE INITIALIZATION =================
  for (let i = 0; i < 35; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1.5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 60}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 2}s`;
    starsContainer.appendChild(star);
  }

  for (let i = 0; i < 42; i++) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    drop.style.left = `${Math.random() * 115}%`;
    drop.style.animationDuration = `${0.55 + Math.random() * 0.35}s`;
    drop.style.animationDelay = `${Math.random() * 1}s`;
    rainLayer.appendChild(drop);
  }

  const flyPositions = [
    { left: '12%', bottom: '32%' }, { left: '22%', bottom: '44%' },
    { left: '28%', bottom: '26%' }, { left: '72%', bottom: '28%' },
    { left: '80%', bottom: '42%' }, { left: '88%', bottom: '34%' }
  ];
  flyPositions.forEach((pos, i) => {
    const fly = document.createElement('div');
    fly.className = 'ambient-fly';
    fly.style.left = pos.left;
    fly.style.bottom = pos.bottom;
    fly.style.animationDelay = `${i * 0.55}s`;
    ambientFireflies.appendChild(fly);
  });

  const leafColors = ['#f1c40f', '#e67e22', '#e74c3c', '#d35400', '#ffbe76'];
  const spawnTreeParticles = (treeEl, isNight) => {
    const cardRect = card.getBoundingClientRect();
    const treeRect = treeEl.getBoundingClientRect();
    const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scene-scale')) || 1;
    const centerX = (treeRect.left - cardRect.left + treeRect.width / 2) / scale;
    const centerY = (treeRect.top - cardRect.top + treeRect.height * 0.45) / scale;

    const count = isNight ? 8 : 11;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      if (isNight) {
        p.className = 'forest-particle firefly-burst';
      } else {
        p.className = 'forest-particle autumn-leaf';
        p.style.background = leafColors[Math.floor(Math.random() * leafColors.length)];
      }

      const offsetX = (Math.random() - 0.5) * 45;
      const offsetY = (Math.random() - 0.5) * 55;
      p.style.left = `${centerX + offsetX}px`;
      p.style.top = `${centerY + offsetY}px`;

      const dx = (Math.random() - 0.5) * 65;
      const dy = isNight ? -(25 + Math.random() * 45) : (45 + Math.random() * 50);
      const rot = (Math.random() - 0.5) * 420;

      p.style.setProperty('--dx', `${dx.toFixed(1)}px`);
      p.style.setProperty('--dy', `${dy.toFixed(1)}px`);
      p.style.setProperty('--rot', `${rot.toFixed(0)}deg`);

      treeParticles.appendChild(p);
      setTimeout(() => p.remove(), 1400);
    }
  };

  // ================= INTERACTIONS =================
  spruceTrees.forEach((tree) => {
    tree.addEventListener('click', (e) => {
      e.stopPropagation();
      tree.classList.remove('rustle');
      void tree.offsetWidth;
      tree.classList.add('rustle');

      const isNight = document.body.classList.contains('night');
      playTreeRustle(isNight);
      spawnTreeParticles(tree, isNight);
    });
  });

  stormCloud.addEventListener('click', () => {
    isRaining = !isRaining;
    stormCloud.classList.toggle('raining', isRaining);
    rainLayer.classList.toggle('active', isRaining);
    toggleRainAudio(isRaining);

    if (isRaining || document.body.classList.contains('night')) {
      stormCloud.classList.add('bolt-glow');
      lightningFlash.classList.remove('strike');
      card.classList.remove('thunder-shake');
      void lightningFlash.offsetWidth;
      lightningFlash.classList.add('strike');
      card.classList.add('thunder-shake');
      playThunder();
      setTimeout(() => stormCloud.classList.remove('bolt-glow'), 450);
    }
  });

  mushroomsEl.addEventListener('click', () => {
    mushroomsEl.classList.remove('boing');
    void mushroomsEl.offsetWidth;
    mushroomsEl.classList.add('boing');
    mushroomsEl.classList.toggle('glow');
    playMagicPop(mushroomsEl.classList.contains('glow'));
  });

  pumpkinEl.addEventListener('click', () => {
    pumpkinEl.classList.toggle('lit');
    playMagicPop(pumpkinEl.classList.contains('lit'));
  });

  windowEl.addEventListener('click', () => {
    windowEl.classList.toggle('lit');
    doorFrame.classList.toggle('dimmed', !windowEl.classList.contains('lit'));
    playSwitch();
  });

  celestial.addEventListener('click', () => {
    document.body.classList.toggle('night');
    const isNight = document.body.classList.contains('night');
    playChime(isNight);
    if (isNight) {
      windowEl.classList.remove('lit');
      doorFrame.classList.add('dimmed');
      mushroomsEl.classList.add('glow');
      pumpkinEl.classList.add('lit');
    } else {
      windowEl.classList.add('lit');
      doorFrame.classList.remove('dimmed');
    }
  });

  doorEl.addEventListener('click', () => {
    doorEl.classList.toggle('open');
    playDoor(doorEl.classList.contains('open'));
  });

  chimneyEl.addEventListener('click', () => {
    smokeEl.classList.toggle('off');
    playPuff();
  });

  birdEl.addEventListener('click', () => {
    birdEl.classList.remove('jump');
    birdFx.classList.remove('animate');
    void birdEl.offsetWidth;
    const notes = ['Hoot!', '♪', '🍂', '✨'];
    birdFx.textContent = notes[Math.floor(Math.random() * notes.length)];
    birdEl.classList.add('jump');
    birdFx.classList.add('animate');
    playOwlHoot();
  });

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  const handleMove = (x, y) => {
    targetX = (window.innerWidth / 2 - x) / 28;
    targetY = (window.innerHeight / 2 - y) / 28;
  };
  document.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  document.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
  document.addEventListener('touchend', () => { targetX = 0; targetY = 0; });

  const smoothTilt = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    if (!card.classList.contains('thunder-shake')) {
      card.style.transform = `rotateY(${-currentX.toFixed(2)}deg) rotateX(${currentY.toFixed(2)}deg)`;
    }
    layerDistant.style.transform = `translate3d(${(currentX * 0.45).toFixed(2)}px, ${(currentY * 0.25).toFixed(2)}px, 0)`;
    layerMist.style.transform = `translate3d(${(currentX * 0.65).toFixed(2)}px, 0, 0)`;
    layerMidground.style.transform = `translate3d(${(-currentX * 0.45).toFixed(2)}px, ${(-currentY * 0.2).toFixed(2)}px, 0)`;
    layerHouse.style.transform = `translate3d(calc(-50% + ${(-currentX * 0.85).toFixed(2)}px), ${(-currentY * 0.35).toFixed(2)}px, 0)`;

    requestAnimationFrame(smoothTilt);
  };
  smoothTilt();
};
