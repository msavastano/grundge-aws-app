import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { requireUserId } from "~/session.server";

import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import * as React from "react";
import type { Tag} from "~/models/magazine.server";
import {
  createStoryTagST,
  deleteStoryTag,
  updateStoryST,
  getOneStory,
  createTagST
} from "~/models/magazine.server";

export async function loader({ params, request }: LoaderArgs) {
  await requireUserId(request);
  const story = await getOneStory(params.storyId);
  return json({ story });
}

export async function action({ request, params }: ActionArgs) {
  await requireUserId(request);
  const formData = await request.formData();
  const tg = formData.get("tag")?.toString().toLowerCase().trim();
  const storyId = params.storyId || "";
  const { _action } = Object.fromEntries(formData);
  const story = await getOneStory(params.storyId);
  if (_action.toString().includes("delete")) {
    const tag = _action.toString().replace("delete-", "");
    story.tags = story.tags.filter((t) => t !== tag)
    await updateStoryST(story)
    await deleteStoryTag({storyId, tag});
    return redirect(`/tags/${params.storyId}/new`);
  } else {
    if (typeof tg !== "string" || tg.length === 0) {
      return json(
        {
          errors: {
            tag: "tag is required",
          },
        },
        { status: 400 }
      );
    }

    if (tg.indexOf(" ") >= 0) {
      return json(
        {
          errors: {
            tag: "tag cannot have whitespace",
          },
        },
        { status: 400 }
      );
    }

    if (/[\s~`!@#$%\^&*+=\\[\]\\';,/{}|\\":<>\?()\._]/g.test(tg)) {
      return json(
        {
          errors: {
            tag: "tag should only include [A-Za-z] or [0-9] or -",
          },
        },
        { status: 400 }
      );
    }

    story.tags.push(tg);
    await updateStoryST(story)
    await createTagST({ tag: tg } as Tag);

    await createStoryTagST({
      tag: tg,
      storyId: storyId
    });
     
    return redirect(`/tags/${storyId}/new`);
   
  }
}

export default function NewTagPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  let formRef = React.useRef<HTMLFormElement>(null);
  const tagRef = React.useRef<HTMLInputElement>(null);
  let transition = useTransition();
  let isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "create";
  React.useEffect(() => {
    if (actionData?.errors?.tag) {
      tagRef.current?.focus();
    }
  }, [actionData]);

  React.useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  return (
    <div >
      <h3 className="text-4xl">Story Tags</h3>
      <h5 className="text-2xl">{data.story?.name}</h5>

      {data?.story?.tags?.map((t) => {
        return (
          <div key={t}>
            <Form  method="delete">
              <span  className="text-3lg">{t.toUpperCase()}</span>
              <button
                
                className="btn-sm btn-circle btn m-2 bg-red-500"
                type="submit"
                name="_action"
                value={`delete-${t}`}
                
              >
                X
              </button>
            </Form>
          </div>
        );
      })}

      <Form ref={formRef} method="post">
        <input
          className="input-bordered input m-2 w-full max-w-xs"
          ref={tagRef}
          name="tag"
          autoFocus
          type="text"
          aria-invalid={actionData?.errors?.tag ? true : undefined}
          aria-errormessage={
            actionData?.errors?.tag ? "title-error" : undefined
          }
        />
        {actionData?.errors?.tag && <div>{actionData.errors.tag}</div>}
        <div className="text-left">
          <button
            className="btn"
            name="_action"
            value="create"
            type="submit"
            disabled={isAdding}
          >
            Add
          </button>
        </div>
      </Form>
    </div>
  );
}
