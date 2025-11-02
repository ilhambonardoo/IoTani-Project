const DataPage = ({
  children,
  analytics,
  kelembabanTanah,
  phTanah,
  suhuTanah,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  kelembabanTanah: React.ReactNode;
  phTanah: React.ReactNode;
  suhuTanah: React.ReactNode;
}) => {
  return (
    <>
      <div className="px-22 pt-10 from-stone-600 to-stone-100 bg-gradient-to-b">
        {children}
      </div>
      <div className="px-22 py-15 space-y-6 from-gray-100 bg-gradient-to-b to-stone-400">
        <div className="flex flex-col space-y-2 text-center">
          <span className="font-extrabold text-[72px] leading-tight text-gray-900">
            Status Tanah: Live
          </span>
          <p className="text-xl text-gray-600">
            Pantau kelembaban, pH, dan suhu lahan Anda secara langsung.
          </p>
        </div>

        {analytics}
        <div>{kelembabanTanah}</div>
        <div className="flex gap-2">
          {phTanah}
          {suhuTanah}
        </div>
      </div>
    </>
  );
};

export default DataPage;
