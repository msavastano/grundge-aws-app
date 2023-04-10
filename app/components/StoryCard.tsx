import { Form, useNavigate } from "@remix-run/react";
import * as React from "react";
import type { StoryProps } from "~/types";

export function StoryCard({
  id,
  title,
  author,
  words,
  excerpt,
  url,
  tags,
  mag,
  date,
  issue,
  img,
  admin,
}: StoryProps) {
  const d = new Date(date || "").toDateString();
  const navigate = useNavigate();
  return (
    <div>
      <section className="hidden sm:block">
        <div className="card card-side m-3 border border-solid bg-base-100 shadow-xl">
          <figure>
            <img
              src={img}
              alt={title}
              className="max-h-[300px] rounded-xl xs:hidden md:block"
            />
          </figure>
          <div className="card-body">
            <section className="flex flex-row justify-between">
              <h2 className="card-title p-1 font-extrabold italic hover:underline hover:opacity-60">
                <a href={url} rel="noreferrer" target="_blank">
                  {title} <span className="text-xs">(link)</span>
                </a>
              </h2>
              <h2 className="card-title underline">By {author}</h2>
            </section>
            <div className="rounded-lg border-4 p-3">
              <p className="text-lg font-medium xs:hidden md:block">
                {excerpt}...
              </p>
            </div>
            <section className="flex flex-row justify-between">
              <h2 className="card-title pr-2 xs:hidden">{words} words</h2>
              <h2 className="card-title">{d}</h2>
              <h2 className="card-title">
                {mag?.toUpperCase()} {issue ? ":" : null}{" "}
                {issue ? "Issue:" : null} {issue}
              </h2>
            </section>
            <section>
              {tags?.map((t) => {
                return (
                  <button
                    className="btn-outline btn-primary btn-sm btn m-1"
                    key={t}
                    onClick={() => {
                      navigate(`/stories/${t}`);
                    }}
                  >
                    {t}
                  </button>
                );
              })}
              {admin && (
                <button
                  className="btn-sm btn-circle btn m-2 bg-lime-900 text-2xl"
                  onClick={() => navigate(`/tags/${id}/new`)}
                >
                  +
                </button>
              )}
              {admin && (
                <>
                  <Form method="delete">
                    <button
                      className="btn-sm btn-circle btn bg-red-600"
                      type="submit"
                      name="_action"
                      value={`delete-${id}`}
                    >
                      X
                    </button>
                  </Form>
                  <button
                    className="btn-sm btn"
                    onClick={() => navigate(`/stories/${id}/edit`)}
                  >
                    edit
                  </button>
                </>
              )}
            </section>
          </div>
        </div>
      </section>
      <section className="justify-center xs:flex block sm:hidden">
        <div className="card image-full m-2 max-w-[500px] bg-base-100 shadow-xl dark:border-white border-2">
          <figure className="h-[300px] ">
            <img src={img} alt={title} />
          </figure>
          <div className="card-body">
            <h2 className="card-title p-1 font-extrabold italic hover:underline hover:opacity-60">
              <a href={url} rel="noreferrer" target="_blank">
                {title} <span className="text-xs">(link)</span>
              </a>
            </h2>
            <h3 className="card-title p-1 font-extrabold">By {author}</h3>
            <section>
              <div className="m-2 rounded-lg border-2 p-3">
                <p className="text-lg font-normal">{excerpt}...</p>
              </div>
              {tags?.map((t) => {
                return (
                  <button
                    className="btn-success btn-sm btn btn-primary m-1"
                    key={t}
                    onClick={() => {
                      navigate(`/stories/${t}`);
                    }}
                  >
                    {t}
                  </button>
                );
              })}
              {admin && (
                <button
                  className="btn-sm btn-circle btn m-2 bg-lime-900 text-2xl"
                  onClick={() => navigate(`/tags/${id}/new`)}
                >
                  +
                </button>
              )}
              {admin && (
                <Form method="delete">
                  <button
                    className="btn-sm btn-circle btn bg-red-600"
                    type="submit"
                    name="_action"
                    value={`delete-${id}`}
                  >
                    X
                  </button>
                </Form>
              )}
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
