import { FcGoogle } from "react-icons/fc";

const Register = () => {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl min-w-[350px] max-w-[400px] w-full">
      <div className="flex justify-center mb-6"></div>
      <h2 className="text-center mb-6 text-black text-2xl font-bold">
        Daftar Akun Baru
      </h2>
      <form>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-black">
            Nama Lengkap
          </label>
          <input
            type="text"
            placeholder="Masukkan nama lengkap"
            className="w-full px-3 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-black">Email</label>
          <input
            type="email"
            placeholder="Masukkan email"
            className="w-full px-3 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-black">Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            className="w-full px-3 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-lg font-semibold text-base mt-4 shadow-md hover:bg-gray-900 transition"
        >
          Daftar
        </button>
      </form>
      <button
        type="button"
        className="w-full py-3 mt-4 flex items-center justify-center border border-black rounded-lg font-semibold text-base gap-3 shadow hover:bg-gray-100 transition"
      >
        <FcGoogle size={25} />
        <span className="text-black">Sign up with Google</span>
      </button>
      <div className="text-center mt-6 text-base text-black">
        Sudah punya akun?{" "}
        <a href=" /login" className="text-black font-medium hover:underline">
          Login
        </a>
      </div>
    </div>
  );
};

export default Register;
