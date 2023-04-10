import * as React from "react";

type Props = {
  children: JSX.Element | string;
  type: "button" | "submit" | "reset" | undefined;
  variant?: "outlined" | "standard" | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const outlined =
  "text-blue-600 bg-transparent outline outline-1 hover:bg-gray-100 focus:bg-gray-200 active:bg-gray-300";
const standard =
  "bg-blue-600 text-white hover:bg-blue-800 focus:bg-blue-900 active:bg-blue-900 focus:outline-none";

export function PrimaryButton({ children, type, variant, onClick }: Props) {
  let v = undefined;
  if (variant === "outlined") {
    v = outlined;
  } else {
    v = standard;
  }
  return (
    <button
      type={type}
      className={`rounded px-6  py-2.5 text-lg font-medium uppercase leading-tight
      shadow-md transition duration-150 ease-in-out marker:inline-block
      hover:shadow-md  focus:shadow-md focus:ring-0 active:shadow-none ${v}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
