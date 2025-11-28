"use client";

import { useState, useCallback } from "react";

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

export function useConfirmModal() {
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "message" | "reply";
    replyId: string;
  }>({
    isOpen: false,
    type: "message",
    replyId: "",
  });

  const open = useCallback(
    (type: "message" | "reply" = "message", replyId = "") => {
      setModal({ isOpen: true, type, replyId });
    },
    []
  );

  const close = useCallback(() => {
    setModal({ isOpen: false, type: "message", replyId: "" });
  }, []);

  return {
    ...modal,
    open,
    close,
  };
}

export function useDeleteConfirm() {
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string;
  }>({
    isOpen: false,
    id: "",
  });

  const open = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, id });
  }, []);

  const close = useCallback(() => {
    setDeleteConfirm({ isOpen: false, id: "" });
  }, []);

  return {
    ...deleteConfirm,
    open,
    close,
  };
}

