let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  return audioCtx;
}

export function playClickSound(type: "tactile" | "sparkle" | "success" | "slider" = "tactile") {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser security policy requires user gesture)
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;

  if (type === "tactile") {
    // Crisp, futuristic woodblock-like click button
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Quick pitch swoop for energetic tactile feel
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);

    gain.gain.setValueAtTime(0.08, now); // Low comfortable volume
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } else if (type === "sparkle") {
    // Futuristic digital chime/sparkle for selecting premium clothing layers
    const playTone = (freq: number, delay: number, dur: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(vol * 0.06, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + dur);
    };

    playTone(880, 0, 0.15, 0.8);
    playTone(1320, 0.04, 0.2, 0.7);
    playTone(1760, 0.08, 0.25, 0.6);
  } else if (type === "success") {
    // Elegant minor major seventh sweeping chord for completing diagnosis
    const freqs = [349.23, 440.00, 523.25, 659.25, 880.00]; // F major 7
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + i * 0.05);

      gain.gain.setValueAtTime(0.03, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.6);
    });
  } else if (type === "slider") {
    // Super quiet organic ticking sound for slider sliding
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }
}
