import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import type { Magazine} from "~/models/magazine.server";
import { getMags1, scanMags } from "~/models/magazine.server";
import { getMags } from "~/models/magazine.server";
import { createMagazineST } from "~/models/magazine.server";
import { requireUser } from "~/session.server";
import { useUser } from "~/utils";
import { uploadImage } from "~/models/utils.server";

export async function action({ request }: ActionArgs) {
  await requireUser(request);
  const clonedData = request.clone();
  const formDatas = await clonedData.formData();
  const { _action, ...values } = Object.fromEntries(formDatas);
  let secure_url: string = "";
  if (_action === "create") {
    if (typeof values.name !== "string" || values.name.length === 0) {
      return json(
        {
          errors: {
            name: "Name is required",
            desc: null,
            display: null,
            url: null,
            img: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    if (typeof values.display !== "string" || values.display.length === 0) {
      return json(
        {
          errors: {
            name: null,
            desc: null,
            display: "display is required",
            url: null,
            img: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    if (typeof values.desc !== "string" || values.desc.length === 0) {
      return json(
        {
          errors: {
            name: null,
            desc: "desc is required",
            display: null,
            url: null,
            img: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    if (typeof values.url !== "string" || values.url.length === 0) {
      return json(
        {
          errors: {
            name: null,
            url: "url is required",
            display: null,
            desc: null,
            img: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    if (typeof values.img !== "string" || values.img.length === 0) {
      return json(
        {
          errors: {
            name: null,
            img: "img is required",
            display: null,
            url: null,
            desc: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    const mag = await createMagazineST({
      id: values.name,
      name: values.name,
      display: values.display,
      url: values.url,
      desc: values.desc,
      img: values.img,
    } as Magazine);
    console.log('mag', mag);

    return redirect(`/`);
  }

  if (_action === "upload") {
    const handlers = async ({
      name,
      data,
    }: {
      name: string;
      data: AsyncIterable<Uint8Array>;
    }) => {
      if (name !== "imgCloud") {
        return undefined;
      }
      const uploadedImage = await uploadImage(data);
      secure_url = uploadedImage.secure_url;
      return secure_url;
    };
    const uploadHandler = composeUploadHandlers(
      handlers,
      createMemoryUploadHandler()
    );
    const imgFormData = await parseMultipartFormData(request, uploadHandler);
    const imgCloud = imgFormData.get("imgCloud");
    if (typeof imgCloud !== "string" || imgCloud.length === 0) {
      return json(
        {
          errors: {
            imgCloud: "imgCloud needed",
            name: null,
            url: null,
            display: null,
            desc: null,
            img: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }
    return json({
      uploadedImage: secure_url,
      errors: {
        imgCloud: null,
        name: null,
        url: null,
        display: null,
        desc: null,
        img: null,
      },
    });
  }
  return redirect("/");
}

export async function loader({ request }: LoaderArgs) {
  const email = (await requireUser(request)).email;
  if (process.env.ADMIN !== email) {
    const searchParams = new URLSearchParams([
      ["redirectTo", new URL(request.url).pathname],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  // const mag = await getMagById({ id: 'mag#the-mag' });
  const mags = await getMags();
  const mags1 = await getMags1();
  const mags2 = await scanMags();

  console.log('index mags', mags);
  console.log('table mags', mags1);
  console.log('scan mags', mags2);
  return json({});
}

export default function NewMagazinePage() {
  const user = useUser();
  const data = useLoaderData();
  const actionData = useActionData<typeof action>();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const descRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const urlRef = React.useRef<HTMLInputElement>(null);
  const displayRef = React.useRef<HTMLInputElement>(null);
  const imgRef = React.useRef<HTMLInputElement>(null);
  const imgSourceRef = React.useRef<HTMLInputElement>(null);

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
      <p>{user.email}</p>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
      <Form method="post">
        <section className="flex flex-col">
          <input
            type="text"
            placeholder="Display Name"
            className="input-bordered input m-2 w-full max-w-xs"
            name="display"
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

          <div>
            <input
              name="name"
              className="input-bordered input m-2 w-full max-w-xs"
              placeholder="Slug"
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
            <textarea
              className="textarea-bordered textarea m-2"
              placeholder={"Description"}
              ref={descRef}
              cols={34}
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
              className="input-bordered input m-2 w-full max-w-xs"
              value={actionData?.uploadedImage}
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
            <button className="btn" type="submit" name="_action" value="create">
              Save
            </button>
          </div>
        </section>
      </Form>
      <div className="m-3 border-spacing-3 border">
        <h3 className="text-lg">Upload an image</h3>
        <Form method="post" encType="multipart/form-data" id="upload-form">
          <input ref={imgSourceRef}
            id="imgCloud"
            type="file"
            name="imgCloud"
            accept="image/*"
            className="file-input file-input-bordered w-full max-w-xs" />
          <div>
            <button className="btn" type="submit" name="_action" value="upload">
              {" "}
              Upload to Cloudinary{" "}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
