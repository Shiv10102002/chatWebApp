import React from "react";
import { classNames } from "../utils";

const Input = (props) => {
  return (
    <input
      {...props}
      className={classNames(
        "block w-full rounded-xl outline outline-[1px] outline-zinc-400 border-0 py-4 px-5 bg-gray-100 text-gray-700 font-light placeholder:text-black/70",
        props.className || ""
      )}
    />
  );
};

export default Input;
