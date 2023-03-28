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
import type { Story } from "~/models/magazine.server";
import { createStoryST, createStoryTagST } from "~/models/magazine.server";
import { requireUser } from "~/session.server";
import { uploadImage } from "~/models/utils.server";

export async function loader({ request }: LoaderArgs) {
  const email = (await requireUser(request)).email;
  if (process.env.ADMIN !== email) {
    const searchParams = new URLSearchParams([
      ["redirectTo", new URL(request.url).pathname],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  // const magazineItems = await getMagazineItems();
  return null;  // json({ magazineItems });
}

export async function action({ request }: ActionArgs) {
  await requireUser(request);
  const clonedData = request.clone();
  const formDatas = await clonedData.formData();
  const { _action } = Object.fromEntries(formDatas);
  let secure_url: string = "";
  if (_action === "create") {
    const pubDate =formDatas.get("pubDate");
    const volume = formDatas.get("volume");
    const mag = formDatas.get("mag");
    const name = formDatas.get("name");
    const author = formDatas.get("author");
    const excerpt = formDatas.get("excerpt");
    const img = formDatas.get("img");
    const url = formDatas.get("url");
    const words = parseInt(formDatas.get("words") as string);

    if (typeof name !== "string" || name.length === 0) {
      return json(
        {
          errors: {
            name: "name needed",
            url: null,
            img: null,
            pubDate: null,
            volume: null,
            mag: null,
            author: null,
            words: null,
            excerpt: null,
            imgCloud: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    if (!pubDate) {
      return json(
        {
          errors: {
            name: null,
            url: null,
            img: null,
            pubDate: "Date needed",
            volume: null,
            mag: null,
            author: null,
            words: null,
            excerpt: null,
            imgCloud: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    if (typeof url !== "string" || url.length === 0) {
      return json(
        {
          errors: {
            name: null,
            url: "url needed",
            img: null,
            pubDate: null,
            volume: null,
            mag: null,
            author: null,
            words: null,
            excerpt: null,
            imgCloud: null,
          },
          uploadedImage: secure_url,
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
            url: null,
            pubDate: null,
            mag: null,
            author: null,
            words: null,
            excerpt: null,
            volume: null,
            imgCloud: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    if (typeof mag !== "string" || mag.length === 0) {
      return json(
        {
          errors: {
            name: null,
            url: null,
            img: null,
            pubDate: null,
            volume: null,
            mag: "Magazine needed",
            author: null,
            words: null,
            excerpt: null,
            imgCloud: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    if (typeof author !== "string" || author.length === 0) {
      return json(
        {
          errors: {
            name: null,
            url: null,
            img: null,
            pubDate: null,
            volume: null,
            mag: null,
            author: "Author needed",
            words: null,
            excerpt: null,
            imgCloud: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    if (typeof excerpt !== "string" || excerpt.length === 0) {
      return json(
        {
          errors: {
            name: null,
            url: null,
            img: null,
            pubDate: null,
            volume: null,
            mag: null,
            author: null,
            words: null,
            excerpt: "Excerpt needed",
            imgCloud: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    if (typeof words !== "number" || !words) {
      return json(
        {
          errors: {
            name: null,
            words: "words needed",
            pubDate: null,
            url: null,
            img: null,
            volume: null,
            mag: null,
            author: null,
            excerpt: null,
            imgCloud: null,
          },
          uploadedImage: secure_url,
        },
        { status: 400 }
      );
    }

    const story = await createStoryST({
      name,
      url,
      img,
      author,
      pubDate,
      volume,
      mag,
      excerpt,
      words,
    } as Story);
    console.log('story', story);
    const rando = Math.random() * 100;
    const storyTag = await createStoryTagST({ storyId: story.id, tag: rando.toString() })
    console.log('storyTag', storyTag);
    // await createTag({ id: storyTag.id || 'null', tag: storyTag.tag })

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
            words: null,
            pubDate: null,
            url: null,
            img: null,
            volume: null,
            mag: null,
            author: null,
            excerpt: null,
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
        words: null,
        pubDate: null,
        url: null,
        img: null,
        volume: null,
        mag: null,
        author: null,
        excerpt: null,
      },
    });
  }
  return redirect("/");
}

export default function NewStoryPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const nameRef = React.useRef<HTMLInputElement>(null);
  const pubDateRef = React.useRef<HTMLInputElement>(null);
  const urlRef = React.useRef<HTMLInputElement>(null);
  const authorRef = React.useRef<HTMLInputElement>(null);
  const imgRef = React.useRef<HTMLInputElement>(null);
  const volumeRef = React.useRef<HTMLInputElement>(null);
  const wordsRef = React.useRef<HTMLInputElement>(null);
  const excerptRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const magRef = React.useRef<HTMLInputElement & HTMLSelectElement>(null);
  const imgSourceRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.img) {
      imgRef.current?.focus();
    } else if (actionData?.errors?.pubDate) {
      pubDateRef.current?.focus();
    } else if (actionData?.errors?.url) {
      urlRef.current?.focus();
    } else if (actionData?.errors?.excerpt) {
      excerptRef.current?.focus();
    } else if (actionData?.errors?.volume) {
      volumeRef.current?.focus();
    } else if (actionData?.errors?.mag) {
      magRef.current?.focus();
    } else if (actionData?.errors?.words) {
      wordsRef.current?.focus();
    } else if (actionData?.errors?.author) {
      authorRef.current?.focus();
    } else if (actionData?.errors?.imgCloud) {
      imgSourceRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div>
      <h3 className="text-lg">New Story</h3>
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div>
          <input
            type="text"
            placeholder="Story Name"
            className="input-bordered input m-2 w-full max-w-xs"
            name="name"
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
            type="text"
            placeholder="Date Published"
            className="input-bordered input m-2 w-full max-w-xs"
            name="pubDate"
            ref={pubDateRef}
            aria-invalid={actionData?.errors?.pubDate ? true : undefined}
            aria-errormessage={
              actionData?.errors?.pubDate ? "title-error" : undefined
            }
          />

          {actionData?.errors?.pubDate && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.pubDate}
            </div>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Author"
            className="input-bordered input m-2 w-full max-w-xs"
            name="author"
            ref={authorRef}
            aria-invalid={actionData?.errors?.author ? true : undefined}
            aria-errormessage={
              actionData?.errors?.author ? "title-error" : undefined
            }
          />

          {actionData?.errors?.author && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.author}
            </div>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Volume"
            className="input-bordered input m-2 w-full max-w-xs"
            name="volume"
            ref={volumeRef}
            aria-invalid={actionData?.errors?.volume ? true : undefined}
            aria-errormessage={
              actionData?.errors?.volume ? "title-error" : undefined
            }
          />

          {actionData?.errors?.volume && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.volume}
            </div>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Word Count"
            className="input-bordered input m-2 w-full max-w-xs"
            name="words"
            ref={wordsRef}
            aria-invalid={actionData?.errors?.words ? true : undefined}
            aria-errormessage={
              actionData?.errors?.words ? "title-error" : undefined
            }
          />

          {actionData?.errors?.words && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.words}
            </div>
          )}
        </div>

        <div>
          <textarea
            className="textarea-bordered textarea m-2"
            placeholder="Excerpt"
            ref={excerptRef}
            cols={34}
            name="excerpt"
            aria-invalid={actionData?.errors?.excerpt ? true : undefined}
            aria-errormessage={
              actionData?.errors?.excerpt ? "body-error" : undefined
            }
          />

          {actionData?.errors?.excerpt && (
            <div className="pt-1 text-red-700" id="body-error">
              {actionData.errors.excerpt}
            </div>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="URL"
            className="input-bordered input m-2 w-full max-w-xs"
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
            type="text"
            placeholder="Img URL"
            className="input-bordered input m-2 w-full max-w-xs"
            value={actionData?.uploadedImage}
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

        <div>
          <select
            name="mag"
            className="input-bordered input m-2 w-full max-w-xs"
            placeholder="magazine"
            ref={magRef}
            aria-invalid={actionData?.errors?.mag ? true : undefined}
            aria-errormessage={
              actionData?.errors?.mag ? "title-error" : undefined
            }
          >
            {/* {data.magazineItems.map((m) => {
              return ( */}
                <option key={'clfplb95i000008l93n3p51ee'} value={'clfplb95i000008l93n3p51ee'}>
                  {'clfplb95i000008l93n3p51ee'}
                </option>
              {/* );
            })} */}
          </select>

          {actionData?.errors?.mag && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.mag}
            </div>
          )}
        </div>

        <div className="text-left">
          <button className="btn" type="submit" name="_action" value="create">
            Save
          </button>
        </div>
      </Form>
      <h6>Upload an image</h6>
      <Form method="post" encType="multipart/form-data" id="upload-form">
        <div>
          <input
            ref={imgSourceRef}
            id="imgCloud"
            type="file"
            name="imgCloud"
            accept="image/*"
            className="file-input file-input-bordered w-full max-w-xs"
          />
        </div>
        <div>
          <button className="btn" type="submit" name="_action" value="upload">
            {" "}
            Upload to Cloudinary{" "}
          </button>
        </div>
      </Form>
    </div>
  );
}
