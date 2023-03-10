import { serve } from "https://deno.land/std@0.164.0/http/server.ts";
import { type Context, createServer, createRouter } from "ultra/server.ts";
import App from "./src/app.tsx";

// Wouter
import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";
import { SearchParamsProvider } from "./src/wouter/index.tsx";

// React Helmet Async
import { HelmetProvider } from "react-helmet-async";
import useServerInsertedHTML from "ultra/hooks/use-server-inserted-html.js";

// React Query
import { QueryClientProvider } from "@tanstack/react-query";
import { useDehydrateReactQuery } from "./src/react-query/useDehydrateReactQuery.tsx";
import { queryClient } from "./src/react-query/query-client.ts";

import { getStarCount } from "./src/api/github.ts";


const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

// deno-lint-ignore no-explicit-any
const helmetContext: Record<string, any> = {};

function ServerApp({ context }: { context: Context }) {
  useServerInsertedHTML(() => {
    const { helmet } = helmetContext;
    return (
      <>
        {helmet.title.toComponent()}
        {helmet.priority.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {helmet.script.toComponent()}
      </>
    );
  });

  useDehydrateReactQuery(queryClient);

  const requestUrl = new URL(context.req.url);

  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <Router hook={staticLocationHook(requestUrl.pathname)}>
          <SearchParamsProvider value={requestUrl.searchParams}>
            <App />
          </SearchParamsProvider>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

/**
 * Create our API router
 */
const api = createRouter();

/**
 * An example API route
 */
api.get("/posts", (context) => {
  return context.json([{
    id: 1,
    title: "Test Post",
  }]);
});

api.get("/github", async (context) => {
  const data = await getStarCount();
  return context.json(data);
});

/**
 * Mount the API router to /api
 */
server.route("/api", api);

server.get("*", async (context) => {
  // clear query cache
  queryClient.clear();

  await queryClient.prefetchQuery(getStarCount.keys(), getStarCount);


  /**
   * Render the request
   */
  const result = await server.render(<ServerApp context={context} />);

  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});
if (import.meta.main) {
  serve(server.fetch, { port: 1337 });
}
export default server;
