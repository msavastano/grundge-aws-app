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
        {showMenu ? (
          <section
            id="mobile-menu"
            className="top-68 justify-content-center animate-open-menu absolute w-full origin-top flex-col text-4xl"
          >
            <nav
              className="flex min-h-screen flex-col items-center py-8"
              aria-label="mobile"
            >
              <a href="/" className="w-full py-6 text-center hover:opacity-90">
                home
              </a>
              <a
                href="/mag"
                className="w-full py-6 text-center hover:opacity-90"
              >
                magazines
              </a>
              <a
                href="/tags"
                className="w-full py-6 text-center hover:opacity-90"
              >
                tags
              </a>
              <a
                className="w-full py-6 text-center hover:opacity-90"
                href="/stories/random"
              >
                random
              </a>
              <a
                href="/about"
                className="w-full py-6 text-center hover:opacity-90"
              >
                about
              </a>
            </nav>
          </section>
        ) : (
          <>
            <header className="sticky top-0 z-50 backdrop-blur-lg">
              <section className="mx-auto flex justify-between p-4">
                <span className="mx-left flex">
                  <span>
                    <img
                      className="h-10"
                      alt="planet"
                      src="https://res.cloudinary.com/djmxtsbdq/image/upload/v1675621603/remix/planet-head_yfezct.png"
                    />
                  </span>
                  &nbsp;
                  <span className="font-semibold">
                    {" "}
                    <span className="font-serif text-4xl">F</span>
                    <span className="text-xl text-stone-500">ree</span> &nbsp;
                    <span className="font-serif text-4xl">S</span>
                    <span className="text-xl text-stone-500">
                      peculative
                    </span>{" "}
                    &nbsp;
                    <span className="font-serif text-4xl">F</span>
                    <span className="text-xl text-stone-500">iction </span>
                  </span>
                </span>
                <div>
                  <button
                    id="hamburger-button"
                    className="relative h-8 w-8 cursor-pointer text-3xl md:hidden"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    &#9776;
                    {/* <div
  className="absolute top-4 -mt-0.5 h-1 w-8 rounded bg-white transition-all duration-500 before:absolute before:h-1 before:w-8 before:-translate-x-4 before:-translate-y-3 before:rounded before:bg-white before:transition-all before:duration-500 before:content-[''] after:absolute after:h-1 after:w-8 after:-translate-x-4 after:translate-y-3 after:rounded after:bg-white after:transition-all after:duration-500 after:content-['']">
</div> */}
                  </button>
                  <nav
                    className="hidden space-x-8 text-xl md:block"
                    aria-label="main"
                  >
                    <a
                      className="text-lg font-semibold hover:opacity-70"
                      href="/"
                    >
                      home
                    </a>
                    <a
                      className="text-lg font-semibold hover:opacity-70"
                      href="/mag"
                    >
                      mags
                    </a>
                    <a
                      className="text-lg font-semibold hover:opacity-70"
                      href="/tags"
                    >
                      tags
                    </a>
                    <a
                      className="text-lg font-semibold hover:opacity-70"
                      href="/stories/random"
                    >
                      random
                    </a>
                    <a
                      className="text-lg font-semibold hover:opacity-70"
                      href="/about"
                    >
                      about
                    </a>
                  </nav>
                </div>
              </section>
            </header>
            <Outlet context={[showMenu, setShowMenu]} />
            <footer className="footer p-10 text-base-content">
              <div>
                <span className="footer-title">Site</span>
                <a href="/" className="link-hover link">
                  Home
                </a>
                <a href="mag" className="link-hover link">
                  Mags
                </a>
                <a href="/tags" className="link-hover link">
                  Tags
                </a>
                <a href="/stories/random" className="link-hover link">
                  Random
                </a>
              </div>
              <div>
                <span className="footer-title">Company</span>
                <a href="/about" className="link-hover link">
                  About
                </a>
              </div>
              {/* <div>
                <ToggleThemeBtn />
              </div> */}
                {/* <div className="dropdown-bottom dropdown-end dropdown">
                  <label tabIndex={0} className="btn m-1">
                    Theme
                  </label>
                  
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
                    >
                      <li>
                        <button onClick={toggleTheme}>Toggle Theme  </button>
                      </li>
                    </ul>
                  
                </div> */}
            </footer>
            <footer className="footer border-t border-base-300 bg-base-200 px-10 py-4 text-base-content">
              <div className="grid-flow-col items-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  className="fill-current"
                >
                  <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
                </svg>
                <p>Copyright © 2023 - All right reserved by EmSav</p>
              </div>
            </footer>
          </>
        )}
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
