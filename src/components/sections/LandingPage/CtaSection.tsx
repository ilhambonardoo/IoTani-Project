import { motion } from "framer-motion";
import Image from "next/image";

const CtaSection = () => {
  return (
    <section className="pt-24">
      <motion.div
        className="flex flex-3"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div className="bg-white rounded-2xl h-[500px] w-96 mx-auto">
          <Image
            src={"/Cabai/petani"}
            alt=""
            width={370}
            height={234}
            className="rounded-2xl bg-stone-600 object-contain mx-auto mt-2"
          ></Image>
          <div className="flex flex-col gap-2 ml-4 mt-2">
            <h1 className="text-black font-bold text-4xl"> Judul </h1>
            <h2 className="text-black font-semibold text-[20px]">
              {" "}
              Keterangan{" "}
            </h2>
            <p className="text-black">Desikripsi</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
