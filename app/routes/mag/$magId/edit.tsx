import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import type { Magazine} from "~/models/magazine.server";
import { getOneMag, updateMagST } from "~/models/magazine.server";
import { requireUser } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const email = (await requireUser(request)).email;
  if (process.env.ADMIN !== email) {
    const searchParams = new URLSearchParams([
      ["redirectTo", new URL(request.url).pathname],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  const mag = await getOneMag(params.magId);
  return { mag };
}

export async function action({ request, params }: ActionArgs) {
  await requireUser(request);
  const clonedData = request.clone();
  const formDatas = await clonedData.formData();
  const { _action } = Object.fromEntries(formDatas);
  if (_action === "update") {
    const name = formDatas.get("name");
    const display = formDatas.get("display");
    const url = formDatas.get("url");
    const desc = formDatas.get("desc");
    const img = formDatas.get("img");

    if (typeof display !== "string" || display.length === 0) {
      return json(
        {
          errors: {
            name: null,
            desc: null,
            display: "display is required",
            url: null,
            img: null,
          },
        },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.length === 0) {
      return json(
        {
          errors: {
            name: "Name is required",
            desc: null,
            display: null,
            url: null,
            img: null,
          },
        },
        { status: 400 }
      );
    }

    if (typeof url !== "string" || url.length === 0) {
      return json(
        {
          errors: {
            name: null,
            url: "url is required",
            display: null,
            desc: null,
            img: null,
          },
        },
        { status: 400 }
      );
    }

    if (typeof desc !== "string" || desc.length === 0) {
      return json(
        {
          errors: {
            name: null,
            desc: "desc is required",
            display: null,
            url: null,
            img: null,
          },
        },
        { status: 400 }
      );
    }

    if (typeof img !== "string" || img.length === 0) {
      return json(
        {
          errors: {
            name: null,
            img: "img is required",
            display: null,
            url: null,
            desc: null,
          },
        },
        { status: 400 }
      );
    }

    const mag = await getOneMag(params.magId);
    await updateMagST
    ({
      id: mag.id,
      name,
      url,
      img,
      display,
      desc,
    } as Magazine)

    return redirect(`/`);
  }
  return redirect(`/mag/${params.magId}/edit`);
}

export default function EditMagPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const descRef = React.useRef<HTMLInputElement>(null);
  const urlRef = React.useRef<HTMLInputElement>(null);
  const displayRef = React.useRef<HTMLInputElement>(null);
  const imgRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.desc) {
      descRef.current?.focus();
    } else if (actionData?.errors?.display) {
      displayRef.current?.focus();
    } else if (actionData?.errors?.url) {
      urlRef.current?.focus();
    } else if (actionData?.errors?.img) {
      imgRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div>
      <h4 className="text-2xl">Edit Magazine</h4>
      <Form method="post">
        <div>
          <input
            defaultValue={data?.mag.display}
            className="input-bordered input m-2 w-full max-w-xs"
            name="display"
            placeholder={"Display"}
            ref={displayRef}
            aria-invalid={actionData?.errors?.display ? true : undefined}
            aria-errormessage={
              actionData?.errors?.display ? "title-error" : undefined
            }
          />

          {actionData?.errors?.display && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.display}
            </div>
          )}
        </div>

        <div>
          <input
            defaultValue={data?.mag.name}
            className="input-bordered input m-2 w-full max-w-xs"
            name="name"
            placeholder={"Slug"}
            ref={nameRef}
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "title-error" : undefined
            }
          />

          {actionData?.errors?.name && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.name}
            </div>
          )}
        </div>

        <div>
          <input
            defaultValue={data?.mag?.desc}
            className="input-bordered input m-2 w-full max-w-xs"
            placeholder={"Description"}
            ref={descRef}
            name="desc"
            aria-invalid={actionData?.errors?.desc ? true : undefined}
            aria-errormessage={
              actionData?.errors?.desc ? "body-error" : undefined
            }
          />

          {actionData?.errors?.desc && (
            <div className="pt-1 text-red-700" id="body-error">
              {actionData.errors.desc}
            </div>
          )}
        </div>

        <div>
          <input
            defaultValue={data?.mag.url}
            className="input-bordered input m-2 w-full max-w-xs"
            placeholder={"URL"}
            name="url"
            ref={urlRef}
            aria-invalid={actionData?.errors?.url ? true : undefined}
            aria-errormessage={
              actionData?.errors?.url ? "title-error" : undefined
            }
          />

          {actionData?.errors?.url && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.url}
            </div>
          )}
        </div>

        <div>
          <input
            defaultValue={data?.mag.img}
            className="input-bordered input m-2 w-full max-w-xs"
            placeholder={"Img URL"}
            name="img"
            ref={imgRef}
            aria-invalid={actionData?.errors?.img ? true : undefined}
            aria-errormessage={
              actionData?.errors?.img ? "title-error" : undefined
            }
          />

          {actionData?.errors?.img && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.img}
            </div>
          )}
        </div>

        <div className="text-left">
          <button type="submit" name="_action" value="update" className="btn">
            Update
          </button>
        </div>
      </Form>
    </div>
  );
}
