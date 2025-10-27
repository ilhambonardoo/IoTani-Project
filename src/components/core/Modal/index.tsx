"use client ";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useRef, ReactNode } from "react";

const Modal = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const overlay = useRef(null);
  const close: MouseEventHandler = (e) => {
    if (e.target === overlay.current) {
      router.back();
    }
  };
  return (
    <div
      onClick={close}
      ref={overlay}
      className="fixed z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/60"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-32 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default Modal;
