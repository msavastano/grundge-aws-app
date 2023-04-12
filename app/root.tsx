import type {
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { getThemeSession } from "./models/theme.server";
import { ThemeProvider } from "./theme";
import { useState } from "react";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    // NOTE: Architect deploys the public directory to /_static/
    { rel: "icon", href: "/_static/favicon.ico" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "FSF",
  viewport: "width=device-width,initial-scale=1",
});


export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const themeSession = await getThemeSession(request);
  const admin = user?.email === process.env.ADMIN;
  return json({
    user,
    admin,
    theme: themeSession.getTheme(),
  });
}

function App() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <html lang="en" data-theme={'garden'}>
      <head>
        <Meta />
        <Links />
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
      </head>
      <body className="h-screen w-screen">

        <Outlet context={[showMenu, setShowMenu]} />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
// export default function App() {
//   return (
//     <html lang="en" className="h-full">
//       <head>
//         <Meta />
//         <Links />
//       </head>
//       <body className="h-full">
//         <Outlet />
//         <ScrollRestoration />
//         <Scripts />
//         <LiveReload />
//       </body>
//     </html>
//   );
// }
export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}
