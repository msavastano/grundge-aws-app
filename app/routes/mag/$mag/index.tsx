import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { deleteStory, getAllMagStories } from "~/models/magazine.server";
import { getUser, requireUserId } from "~/session.server";
import { StoryCard } from "~/components/StoryCard";
import type { RootData } from "~/types";

export async function loader({ request, params }: LoaderArgs) {
  const storyItems = await getAllMagStories(params.mag || '');
  storyItems.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));
  const user = (await getUser(request))?.email === process.env.ADMIN;
  return json({ storyItems, user });
}

export async function action({ request, params }: ActionArgs) {
  await requireUserId(request);
  const clonedData = request.clone();
  const formDatas = await clonedData.formData();
  const { _action } = Object.fromEntries(formDatas);
  if (_action.toString().includes("delete")) {
    const storyId = _action.toString().replace("delete-", "");
    await deleteStory({id: storyId, mag: params.mag || ''});
    return redirect("/");
  }
  return null;
}

export default function MagazineStoriesPage() {
  const data = useLoaderData<typeof loader>();
  const root = useRouteLoaderData("root") as RootData;
  return (
    <>
      {data.storyItems.map((s) => {
        return (
          <StoryCard
            id={s.id}
            key={s.id}
            title={s.name}
            author={s.author}
            words={s.words}
            excerpt={s.excerpt}
            url={s.url}
            tags={s.tags}
            mag={s.mag}
            date={s.pubDate}
            issue={s.volume}
            img={s.img}
            admin={root?.admin}
          />
        );
      })}
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Mag not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
