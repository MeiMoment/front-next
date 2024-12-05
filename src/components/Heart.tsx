import React from "react";
import { HeartFilled } from "@ant-design/icons";

const Heart = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <div className="flex items-center text-lg uppercase hover:bg-black/40 mt-4">
      <HeartFilled className="text-red-500 text-xl mr-2" />
      <span>{children}</span>
    </div>
  );
}

export default Heart;
