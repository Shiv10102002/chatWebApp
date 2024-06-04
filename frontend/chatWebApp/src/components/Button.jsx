import React from "react";
import { classNames } from "../utils";

const Button = ({
  fullWidth,
  severity = "primary",
  size = "base",
  ...props
}) => {
  return (
    <button
      {...props}
      className={classNames(
        "rounded-full inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm",
        fullWidth ? "w-full" : "",
        severity === "secondary"
          ? "bg-green-700 hover:bg-green-500 disabled:bg-secondary/50 outline outline-[1px] outline-zinc-400"
          : severity === "danger"
          ? "bg-red-700 hover:bg-red-500 disabled:bg-danger/50"
          : "bg-green-700 hover:bg-green-500 disabled:bg-primary/50",
        size === "small" ? "text-sm px-3 py-1.5" : "text-base px-4 py-3",
        props.className || ""
      )}
    >
      {props.children}
    </button>
  );
};

export default Button;
