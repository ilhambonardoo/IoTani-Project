"use client";

import { motion } from "framer-motion";
import Image from "next/legacy/image";
import { FaSave, FaTimes, FaImage } from "react-icons/fa";

interface ChiliFormProps {
  isEditing: boolean;
  formData: {
    name: string;
    description: string;
    imageUrl: string;
    characteristics: string;
    uses: string;
  };
  uploadPreview: string | null;
  selectedFile: File | null;
  fileRef: React.RefObject<HTMLInputElement | null>;
  isSubmitting: boolean;
  onFormDataChange: (data: ChiliFormProps["formData"]) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ChiliForm = ({
  isEditing,
  formData,
  uploadPreview,
  fileRef,
  isSubmitting,
  onFormDataChange,
  onFileChange,
  onSave,
  onCancel,
}: ChiliFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-2xl bg-white p-6 shadow-lg"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-800">
          {isEditing ? "Edit Cabai" : "Tambah Cabai Baru"}
        </h2>
        <button
          onClick={onCancel}
          className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Nama Cabai *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              onFormDataChange({ ...formData, name: e.target.value })
            }
            placeholder="Contoh: Cabai Rawit, Cabai Merah, dll"
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Deskripsi *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              onFormDataChange({ ...formData, description: e.target.value })
            }
            placeholder="Deskripsi singkat tentang cabai ini..."
            rows={4}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Karakteristik
          </label>
          <textarea
            value={formData.characteristics}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                characteristics: e.target.value,
              })
            }
            placeholder="Karakteristik cabai (tingkat kepedasan, warna, bentuk, dll)"
            rows={3}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Kegunaan
          </label>
          <textarea
            value={formData.uses}
            onChange={(e) =>
              onFormDataChange({ ...formData, uses: e.target.value })
            }
            placeholder="Kegunaan cabai dalam masakan atau budidaya"
            rows={3}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Gambar
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-700 hover:bg-neutral-50"
            >
              <FaImage size={18} />
              Pilih Gambar
            </button>
            {uploadPreview && (
              <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                <Image
                  src={uploadPreview}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            )}
            {isEditing && formData.imageUrl && !uploadPreview && (
              <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                <Image
                  src={formData.imageUrl}
                  alt="Current"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-600 disabled:opacity-50"
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          >
            <FaSave size={18} />
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </motion.button>
          <button
            onClick={onCancel}
            className="rounded-lg border border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Batal
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChiliForm;




