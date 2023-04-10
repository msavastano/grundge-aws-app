import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import type { ChangeEvent} from "react";
import { useEffect, useRef, useState } from "react";

import { getAllTags } from "~/models/magazine.server";

export async function loader() {
  const tags = await getAllTags();
  tags.sort((a, b) => (a.tag > b.tag ? 1 : -1));
  return json({ tags });
}
export default function TagsPage() {

  const searchRef = useRef<HTMLInputElement>(null);
  const { tags } = useLoaderData<typeof loader>();
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(tags);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    
    setSearch(e.target.value)
    e.preventDefault()
  }

  useEffect(() => {
    setFiltered(tags.filter((t) => t.tag.toLowerCase().includes(search.toLowerCase())))
  }, [search, tags])

  const navigate = useNavigate();
  return (
    <div className="mt-2">
      <section className="flex justify-center">
        <span className="ml-5 font-semibold">
          <span className="ml-5 font-serif text-3xl">T</span>
          <span className="text-xl text-stone-500">ags</span>
        </span>
      </section>
      <section className="flex justify-center">
          <input
            ref={searchRef}
            onChange={handleSearchChange}
            id="search"
            name="search"
            type="text"
            placeholder="Search tags"
            className="input-bordered input-primary input w-full max-w-xs mt-5"
          />
      </section>
      <section className="m-3 flex justify-center">
        <div className="card w-4/5">
          <div className="card-body flex flex-row flex-wrap justify-center">
            {filtered.map(({ tag }: { tag: string }) => {
              return (
                <button
                  className="btn-outline btn-primary btn-link btn-sm btn m-1"
                  key={tag}
                  onClick={() => {
                    navigate(`/stories/${tag}`);
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
