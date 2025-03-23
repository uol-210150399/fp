import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { useApolloClient } from './lib/apollo-client';
import { ApolloProvider } from '@apollo/client/react';
import { Toaster } from "@/components/ui/sonner"

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://rsms.me/" },
  {
    rel: "stylesheet",
    href: "https://rsms.me/inter/inter.css",
  },
];

export function Layout() {

  return (
    <html lang="en" className="dark:bg-zinc-900 dark:lg:bg-zinc-950">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ClerkProvider
          publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        >
          <ApolloWrapper>
            <Outlet />
          </ApolloWrapper>
        </ClerkProvider>
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html >
  );
}

function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = useApolloClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
