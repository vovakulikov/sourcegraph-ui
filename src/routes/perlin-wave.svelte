<script>
  import { onMount } from 'svelte';
  
  let canvas;
  let ctx;
  let time = 0;
  
  function noise(x, y, z) {
    // Simple pseudo-perlin noise implementation
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    
    // Hash coordinates
    const A = (X + Z) * 57;
    const B = (X + Z + 1) * 57;
    const AA = (A + Y) * 57;
    const AB = (A + Y + 1) * 57;
    const BA = (B + Y) * 57;
    const BB = (B + Y + 1) * 57;
    
    // Blend results from 8 corners of cube
    return lerp(w, lerp(v, lerp(u, grad(AA, x, y, z),
                                grad(BA, x - 1, y, z)),
                        lerp(u, grad(AB, x, y - 1, z),
                                grad(BB, x - 1, y - 1, z))),
                lerp(v, lerp(u, grad(AA + 1, x, y, z - 1),
                                grad(BA + 1, x - 1, y, z - 1)),
                        lerp(u, grad(AB + 1, x, y - 1, z - 1),
                                grad(BB + 1, x - 1, y - 1, z - 1))));
  }
  
  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  function lerp(t, a, b) {
    return a + t * (b - a);
  }
  
  function grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  
  function renderWave() {
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Create an image data object
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Scale for noise (reduced for larger patterns)
    const scale = 0.005;
    
    // Generate noise
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        // Generate a crisp wave pattern with perlin noise
        let value = noise(x * scale, y * scale, time) * 0.5 + 0.5;
        
        // Add contrast for crisper effect and shift toward orange
        value = Math.pow(value, 1.2); // Less contrast makes bigger color areas
        
        // Add grain effect for old photo look
        const grain = Math.random() * 0.1;
        value = Math.max(0, Math.min(1, value - 0.2 + grain));
        
        const i = (y * width + x) * 4;
        const color = Math.floor(value * 255);
        
        // RGBA values - more orange biased gradient with larger orange areas
        // Significantly biased toward orange: shifted threshold for orange appearance
        // Orange appears at lower values now
        data[i] = Math.min(255, Math.floor(value * 150 + 90));  // R: 90 to 240 (stronger orange)
        data[i + 1] = Math.floor(70 + value * 50);              // G: higher variation for orange
        data[i + 2] = Math.floor(100 - value * 100);            // B: less blue overall
        data[i + 3] = 255; // Alpha (opacity)
      }
    }
    
    // Put the image data back on the canvas
    ctx.putImageData(imageData, 0, 0);
    
    // Add vignette effect for old photo look
    const gradient = ctx.createRadialGradient(
      width/2, height/2, 0,
      width/2, height/2, Math.max(width, height) / 1.5
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = gradient;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillRect(0, 0, width, height);
    
    // Increment time to animate (significantly increased for much faster animation)
    time += 0.02;
    
    // Request next frame
    requestAnimationFrame(renderWave);
  }
  
  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d');
      
      // Set canvas size to full window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Handle resize
      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
      
      // Start animation
      renderWave();
    }
    
    return () => {
      // Cleanup listeners on component unmount
      window.removeEventListener('resize', () => {});
    };
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #000;
  }
</style>