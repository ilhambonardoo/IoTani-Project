export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="px-25">{children}</div>
    </>
  );
}
