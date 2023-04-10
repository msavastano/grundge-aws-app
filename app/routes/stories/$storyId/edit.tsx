import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import type { Story} from "~/models/magazine.server";
import { getAllMags, getOneStory, updateStoryST } from "~/models/magazine.server";
import { requireUser } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const email = (await requireUser(request)).email;
  if (process.env.ADMIN !== email) {
    const searchParams = new URLSearchParams([
      ["redirectTo", new URL(request.url).pathname],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  const story = await getOneStory(params.storyId);

  const magazineItems = await getAllMags();
  return { story, magazineItems };
}

export async function action({ request, params }: ActionArgs) {
  await requireUser(request);
  const clonedData = request.clone();
  const formDatas = await clonedData.formData();
  const id = params.storyId || "";
  const { _action } = Object.fromEntries(formDatas);
  if (_action === "update") {
    const pubDate = formDatas.get("pubDate");
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
          },
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
            url: "url needed",
            img: null,
            pubDate: null,
            volume: null,
            mag: null,
            author: null,
            words: null,
            excerpt: null,
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
            url: null,
            pubDate: null,
            mag: null,
            author: null,
            words: null,
            excerpt: null,
            volume: null,
          },
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
          },
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
          },
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
          },
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
          },
        },
        { status: 400 }
      );
    }

    const story = await getOneStory(params.storyId);
    await updateStoryST({
      id,
      name,
      url,
      img,
      author,
      pubDate,
      volume,
      mag: mag,
      excerpt,
      words,
      tags: story.tags
    } as Story)

    return redirect(`/`);
  }
  return redirect(`/stories/${params.storyId}/edit`);
}

export default function EditStoryPage() {
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
    }
  }, [actionData]);

  return (
    <div>
      <h4 className="text-2xl">Edit Story</h4>
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
            defaultValue={data?.story?.name}
            className="input-bordered input m-2 w-full max-w-xs"
            name="name"
            placeholder={"Story Name"}
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
            defaultValue={data?.story?.pubDate}
            className="input-bordered input m-2 w-full max-w-xs"
            name="pubDate"
            placeholder={"Date Published"}
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
            defaultValue={data?.story?.author}
            className="input-bordered input m-2 w-full max-w-xs"
            name="author"
            placeholder={"Author"}
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
            defaultValue={data?.story?.volume}
            className="input-bordered input m-2 w-full max-w-xs"
            name="volume"
            placeholder={"Volume"}
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
            defaultValue={data?.story?.words}
            className="input-bordered input m-2 w-full max-w-xs"
            name="words"
            placeholder={"Word Count"}
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
            defaultValue={data?.story?.excerpt}
            className="input-bordered input m-2 w-full max-w-xs"
            placeholder={"Excerpt"}
            ref={excerptRef}
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
            defaultValue={data?.story?.url}
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
            defaultValue={data?.story?.img}
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

        <div>
          <select
            defaultValue={data.story?.mag}
            className="input-bordered input m-2 w-full max-w-xs"
            name="mag"
            ref={magRef}
            aria-invalid={actionData?.errors?.mag ? true : undefined}
            aria-errormessage={
              actionData?.errors?.mag ? "title-error" : undefined
            }
          >
            {data.magazineItems.map((m) => {
              return (
                <option
                  key={m.id}
                  value={m.name}
                  defaultChecked={data.story?.mag === m.display}
                >
                  {m.display}
                </option>
              );
            })}
          </select>

          {actionData?.errors?.mag && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.mag}
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
