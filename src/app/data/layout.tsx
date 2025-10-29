const DataPage = ({
  children,
  analytics,
  kelembabanTanah,
  phTanah,
  suhuTanah,
  modal,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  kelembabanTanah: React.ReactNode;
  phTanah: React.ReactNode;
  suhuTanah: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <>
      <div>{children}</div>
      <div className="p-6 space-y-6">
        {analytics}
        <div>{kelembabanTanah}</div>
        <div className="flex  gap-2">
          {phTanah}
          {suhuTanah}
        </div>
        {modal}
      </div>
    </>
  );
};

export default DataPage;
