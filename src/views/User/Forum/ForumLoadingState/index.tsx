"use client";

const ForumLoadingState = () => {
  return (
    <div className="flex h-60 items-center justify-center text-neutral-500">
      <div>
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
        <p>Memuat artikel edukasi...</p>
      </div>
    </div>
  );
};

export default ForumLoadingState;

