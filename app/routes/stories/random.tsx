import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";

import { useLoaderData } from "@remix-run/react";
import { StoryCard } from "~/components/StoryCard";

import { getAllStories } from "~/models/magazine.server";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getUserId(request);
  const s = await getAllStories();
  let int = 0;
  if (s.length) {
    int = Math.floor(Math.random() * s.length);
  }
  return json({ story: s[int], user });
}

export default function TagPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      {data?.story ? (
        <StoryCard
          id={data.story?.id || ""}
          mag={data?.story?.mag}
          title={data?.story?.name || ""}
          img={data?.story?.img}
          url={data?.story?.url}
          key={data?.story?.name}
          author={data?.story?.author}
          excerpt={data?.story?.excerpt}
          words={data?.story?.words}
          date={data?.story?.pubDate}
          issue={data?.story?.volume}
          tags={data?.story?.tags}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
