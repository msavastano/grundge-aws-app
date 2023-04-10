import type { LoaderArgs} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useOutletContext } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  return json({});
}

export default function HomePage() {
  const [showMenu] = useOutletContext<Boolean[]>();
  return (
    <div className="">
      <main>
        {showMenu ? (
          <section
            id="mobile-menu"
            className="top-68 justify-content-center animate-open-menu absolute w-full origin-top flex-col text-5xl"
          >
            <nav
              className="flex min-h-screen flex-col items-center py-8"
              aria-label="mobile"
            >
              <a href="/" className="w-full py-6 text-center hover:opacity-90">
                Home
              </a>
              <a
                href="/tags"
                className="w-full py-6 text-center hover:opacity-90"
              >
                Tags
              </a>
              <a
                href="/about"
                className="w-full py-6 text-center hover:opacity-90"
              >
                About
              </a>
            </nav>
          </section>
        ) : (
          <div>
            <div
              className="hero min-h-screen"
              style={{
                backgroundImage: `url("https://res.cloudinary.com/djmxtsbdq/image/upload/v1674047110/remix/pl_fefgbi.png")`,
              }}
            >
              <div className="hero-overlay bg-opacity-50"></div>
              <div className="hero-content text-center text-neutral-content">
                <div className="max-w-3xl">
                  <figure className="p-2">
                    <blockquote className="relative rounded-3xl bg-transparent py-12 pl-14 pr-8">
                      <h4 className="mb-3 text-left text-2xl font-bold text-white">
                        speculative fiction
                      </h4>
                      <p
                        className="text-1xl mt-2 text-left text-white before:absolute before:top-0 before:left-0 before:translate-x-2
                  before:translate-y-2 before:transform before:font-serif before:text-9xl before:opacity-25 
                  before:content-['\201C'] after:absolute after:-bottom-20 after:right-0
                  after:-translate-x-2 after:-translate-y-2 after:transform after:font-serif after:text-9xl after:opacity-25 
                  after:content-['\201D'] sm:text-3xl"
                      >
                        a broad literary genre encompassing any fiction with
                        supernatural, fantastical, or futuristic elements
                      </p>
                    </blockquote>
                    <figcaption className="mt-2 pr-2 text-right text-xl italic text-white sm:text-2xl">
                      &#8212;Dictionary.com
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}