<script lang="ts">
	import { THEME_STATE } from '@sourcegraph/ui'

	let canvas: HTMLCanvasElement | null = $state(null);

	$effect(() => {
		if (!canvas) {
			return
		}

		// Set canvas size to full window
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Handle resize
		window.addEventListener('resize', () => {
			if (!canvas) {
				return
			}
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		});

		initAnimation(canvas)
	})

	function initAnimation(canvas: HTMLCanvasElement): void {
		const gl = canvas.getContext('webgl');

		if (!gl) {
			return
		}

		function compileShader(type, source) {
			const shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw new Error(gl.getShaderInfoLog(shader));
			}
			return shader;
		}

		const vsSource = `
    attribute vec4 aPosition;
    void main() {
      gl_Position = aPosition;
    }
  `;

		const shaderScript = document.getElementById('fragShader')

		if (!shaderScript) {
			return;
		}

		const fsSource = shaderScript.textContent;
		const vs = compileShader(gl.VERTEX_SHADER, vsSource);
		const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
		const program = gl.createProgram();

		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		gl.useProgram(program);

		const positionLoc = gl.getAttribLocation(program, 'aPosition');
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1, -1, 1, -1, -1, 1,
			-1, 1, 1, -1, 1, 1,
		]), gl.STATIC_DRAW);

		gl.enableVertexAttribArray(positionLoc);
		gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

		const iResolution = gl.getUniformLocation(program, 'iResolution');
		const iTime = gl.getUniformLocation(program, 'iTime');
		const isDarkMode = gl.getUniformLocation(program, 'isDarkMode');

		let start = Date.now();
		// Function to check if dark mode is active
		function isDarkThemeActive() {
			return THEME_STATE.currentMode === 'dark';
		}

		// Set up theme change listener
		const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		darkModeMediaQuery.addEventListener('change', () => {
			// Theme was changed, update will happen on next render
		});

		// Document-level theme change listener (for manual theme switches)
		const observer = new MutationObserver(() => {
			// Theme change detected, update will happen on next render
		});
		observer.observe(document.documentElement, { 
			attributes: true, 
			attributeFilter: ['data-sg-theme', 'data-sg-theme-mode']
		});

		function render() {
			let t = (Date.now() - start) * 0.001;
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.uniform2f(iResolution, canvas.width, canvas.height);
			gl.uniform1f(iTime, t);
			
			// Pass theme state to shader (1.0 for dark mode, 0.0 for light mode)
			const darkMode = isDarkThemeActive() ? 1.0 : 0.0;
			gl.uniform1f(isDarkMode, darkMode);
			
			gl.drawArrays(gl.TRIANGLES, 0, 6);
			requestAnimationFrame(render);
		}
		render();
	}
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        display: block;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-color: var(--sg-sys-bg-canvas, #000);
    }
</style>
