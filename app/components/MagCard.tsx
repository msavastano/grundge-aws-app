import { Form, useNavigate } from "@remix-run/react";
import * as React from "react";
import type { MagProps } from "~/types";

export function MagCard({
  id,
  display,
  img,
  desc,
  url,
  name,
  admin,
}: MagProps) {
  const navigate = useNavigate();

  return (
    <div className="card image-full m-2 w-80 bg-base-100 shadow-xl dark:border-white border-2">
      <figure className="h-44 opacity-50">
        <img src={img} alt={name} />
      </figure>
      <div className="card-body">
        <div className="tooltip tooltip-secondary tooltip-top" data-tip={desc}>
          <h2 className="card-title">{display}</h2>
        </div>
        <div className="card-actions justify-end mt-12">
          {admin && (
            <>
              <Form method="delete">
                <button
                  className="btn-sm btn-circle btn bg-red-600"
                  type="submit"
                  name="_action"
                  value={`delete,${id},${name}`}
                >
                  X
                </button>
              </Form>
              <button
                className="btn-sm btn"
                onClick={() => navigate(`/mag/${name}/edit`)}
              >
                edit
              </button>
            </>
          )}
          <button
            className="btn-primary btn-sm btn shadow-md shadow-black hover:shadow-sm active:shadow-none"
            onClick={() => {
              window.open(`${url}`, "_blank");
            }}
          >
            WEBSITE
          </button>
          <button
            className="btn-primary btn-sm btn shadow-md shadow-black hover:shadow-sm active:shadow-none"
            onClick={() => {
              window.open(`/mag/${name}`, "_self");
            }}
          >
            Stories
          </button>
        </div>
      </div>
    </div>
  );
}
