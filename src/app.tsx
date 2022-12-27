import { MDXProvider } from "@mdx-js/react";
import Docs from "./content/docs.js";
import GitHub from "./components/Github.tsx";

import useAsset from "ultra/hooks/use-asset.js";

const Image = (
  { src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>,
) => {
  return <img src={useAsset(src)} {...props} />;
};

export default function App() {
  console.log("Hello world!");
  return (
    <MDXProvider
      components={{
        img: Image,
      }}
    >
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Ultra</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
          <link rel="stylesheet" href={useAsset("/style.css")} />
          <link rel="preload" as="style" href={useAsset("/uno.css")} />
          <link rel="stylesheet" href={useAsset("/uno.css")} />
        </head>
        <body cz-shortcut-listen={"true"}>
          <main>
            <h1>
              <span></span>__<span></span>
            </h1>
            <p>
              Welcome to{" "}
              <strong className="text-yellow-500">Ultra</strong>. This is a barebones starter for your web
              app.
            </p>
            <GitHub />
            <Docs />
            <p>
              Take{" "}
              <a
                href="https://ultrajs.dev/docs"
                target="_blank"
              >
                this
              </a>, you may need it where you are going. It will show you how to
              customize your routing, data fetching, and styling with popular
              libraries.
            </p>
          </main>
        </body>
      </html>
    </MDXProvider>
  );
}
