export const libs = [
  "tvmjs_runtime.wasi.js",
  "tvmjs.bundle.js",
  "tokenizers_wasm.js",
  "stable_diffusion.js",
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/' + src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function loadScripts(scripts) {
  for (let src of scripts) {
    await loadScript(src);
  }
}

export const runStableDiffusion = async (config, canvas, skipLibs = false) => {
  if (!skipLibs) {
    window.tvmjsGlobalEnv = window.tvmjsGlobalEnv || {};

    await loadScripts(libs);
  }

  globalThis.tvmjsGlobalEnv.getTokenizer = async () => {
    if (!globalThis.tvmjsGlobalEnv.initialized) {
      await globalThis.Tokenizer.init();
    }

    globalThis.tvmjsGlobalEnv.initialized = true;

    return new globalThis.Tokenizer.TokenizerWasm(
      await (await fetch("tokenizer.json")).text()
    );
  };

  globalThis.tvmjsGlobalEnv.canvas = globalThis.tvmjsGlobalEnv.canvas || canvas;

  const { prompts } = config;

  globalThis.tvmjsGlobalEnv.prompts = prompts?.length
    ? prompts
    : [["A photo of an astronaut riding a horse on mars", ""]];

  await globalThis.tvmjsGlobalEnv.asyncOnGenerate();
};

export const StableDiffusion = async (el, config = {}) => {
  if (!el) return;

  const canvas = document.createElement("canvas");
  canvas.height = 256;
  canvas.width = 256;

  el.append(canvas);

  await runStableDiffusion(config, canvas);

  const img = convertCanvasToImage(canvas);
  return img; 
};

function convertCanvasToImage(canvas) {
  const dataURL = canvas.toDataURL("image/png");
  const img = new Image();
  img.src = dataURL;
  return img;
}

