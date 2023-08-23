const startTime = new Date().getTime();

require("esbuild")
  .build({
    entryPoints: ["src/**/*.ts"],
    minify: true,
    format: "cjs",
    // bundle: true,
    platform: "node",
    outdir: "dist",
    color: true,
  })
  .then(console.log)
  .catch(console.error)
  .finally(() =>
    console.log(
      // Print taken to complete the build
      `\x1b[32m\x1b[1m
        Done in ${(new Date().getTime() - startTime) / 1000}ms
        \x1b[0m`
    )
  );
