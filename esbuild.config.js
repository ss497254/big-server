require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    minify: true,
    format: "cjs",
    platform: "node",
    outdir: "dist",
    color: true,
  })
  .then(console.log)
  .catch(console.error);
