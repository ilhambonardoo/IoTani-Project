import { ReactNode } from "react";

export default function layoutAuth({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="bg-black">{children}</div>
    </>
  );
}
