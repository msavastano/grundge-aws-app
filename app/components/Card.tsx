import * as React from "react";

type Props = {
  children: JSX.Element | string;
  title: string;
  img?: string;
  alt?: string;
  shortDesc?: string;
};

export function CustomCard({ children, title, img, alt, shortDesc }: Props) {
  return (
    <div className="m-4 h-[26rem] w-[26rem] rounded-lg bg-white shadow-lg dark:bg-slate-400">
      <div className="flex justify-center bg-slate-300 bg-opacity-50">
        {img && <img className="h-60 rounded-t-lg" src={img} alt={alt || ""} />}
      </div>
      <div className="p-6">
        <h5 className="mb-2 text-xl font-medium leading-tight text-gray-900">
          {title}
        </h5>
        <p className="mb-2 text-lg leading-tight text-gray-700">{shortDesc}</p>
        <p className="mb-4 text-base text-gray-700">{children}</p>
      </div>
    </div>
  );
}
