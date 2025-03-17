import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import { ClerkApp, ClerkProvider } from "@clerk/remix";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://rsms.me/" },
  {
    rel: "stylesheet",
    href: "https://rsms.me/inter/inter.css",
  },
];

export function Layout() {
  return (
    <html lang="en" className=" dark:bg-zinc-900 dark:lg:bg-zinc-950">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  return (
    <ClerkProvider {...{
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    }}>
      <div>
        <Outlet />
      </div>
    </ClerkProvider>
  );
}

export default ClerkApp(App, {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
});

export function HydrateFallback() {
  return <p>Loading...</p>;
}
