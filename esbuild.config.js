const startTime = new Date().getTime();

const pretty = (x) => `\x1b[32m\x1b[1m${x}\x1b[0m`;

require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    minify: true,
    format: "cjs",
    bundle: true,
    platform: "node",
    outdir: "dist",
    color: true,
  })
  .then(console.log)
  .catch(console.error)
  .finally(() =>
    console.log(
      // Print taken to complete the build
      pretty(`Done in ${new Date().getTime() - startTime}ms`)
    )
  );
