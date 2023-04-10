import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { StoryCard } from "~/components/StoryCard";
import { getOneStory, getStoriesByTag } from "~/models/magazine.server";
import { getUserId } from "~/session.server";
import type { RootData } from "~/types";

export async function loader({ request, params }: LoaderArgs) {
  const tag = params.tag;
  const storyItems = await getStoriesByTag(tag);
  const stories = await Promise.all(storyItems.map((i) => {

    return getOneStory(i.sk.replace('story#', ''))
  }))

  const user = await getUserId(request);
  return json({ stories, user });
}

export default function TagStoriesPage() {
  const data = useLoaderData<typeof loader>();
  const root = useRouteLoaderData("root") as RootData;
  return (
    <div>
      {data.stories.map((story) => {
        return (
          <StoryCard
            id={story.id}
            mag={story.mag}
            title={story.name}
            img={story.img}
            url={story.url}
            key={story.name}
            author={story.author}
            excerpt={story.excerpt}
            words={story.words}
            date={story.pubDate}
            issue={story.volume}
            tags={story.tags}
            admin={root?.admin}
            />
        );
      })}
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Tag not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
