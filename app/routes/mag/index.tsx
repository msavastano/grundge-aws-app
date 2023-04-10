import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { MagCard } from "~/components/MagCard";
import { deleteMag, getAllMags } from "~/models/magazine.server";
import { requireUserId } from "~/session.server";
import type { MagProps, RootData } from "~/types";

export async function loader({ request }: LoaderArgs) {
  const magItems = await getAllMags();
  return json({ magItems });
}

export async function action({ request }: ActionArgs) {
  await requireUserId(request);
  const clonedData = request.clone();
  const formDatas = await clonedData.formData();
  const { _action } = Object.fromEntries(formDatas);
  if (_action.toString().includes("delete")) {
    const del = _action.toString().split(',')
    await deleteMag({id: del[1], mag: del[2]});
    return redirect("/mag");
  }
  return null;
}

export default function MagPage() {
  const data = useLoaderData();
  const root = useRouteLoaderData("root") as RootData;
  return (
    <div className="mt-2">
      <section className="flex justify-center">
        <span className="ml-5 font-semibold">
          <span className="ml-5 text-3xl font-serif">M</span>
          <span className="text-xl text-stone-500">agazines</span>
        </span>
      </section>
      <section className="flex w-full flex-wrap items-center justify-center p-3">
        {data.magItems.map((m: MagProps) => {
          return (
            <MagCard
              id={m.id}
              key={m.id}
              display={m.display}
              img={m.img}
              desc={m.desc}
              url={m.url}
              name={m.name}
              admin={root.admin}
            />
          );
        })}
      </section>
    </div>
  );
}
