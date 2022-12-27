import { compile } from "./mdx.ts";
import { build } from "unocss/cli";

await compile("./content");

await build({
  patterns: ["src/**/*"],
  outFile: "public/uno.css",
});

/**
 * Now start the server
 */
const server = Deno.run({
  cmd: [Deno.execPath(), "run", "-A", "./server.tsx"],
});

await server.status();
