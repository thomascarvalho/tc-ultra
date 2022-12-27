import { createBuilder } from "ultra/build.ts";
import { compile } from "./mdx.ts";
import { build } from "unocss/cli";


const builder = createBuilder({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
});

builder.ignore([
  "./README.md",
  "./importMap.json",
  "./.git/**",
  "./.vscode/**",
  "./.github/**",
  "./.gitignore",
  "./content/**/*",
  "*.json"
]);

/**
 * Compile our mdx
 */
await compile("./content");
builder.log.success("Compiled MDX");

/**
 * unocss
 */
await build({
  patterns: ["src/**/*"],
  outFile: "public/uno.css",
});

// deno-lint-ignore no-unused-vars
const result = await builder.build();
