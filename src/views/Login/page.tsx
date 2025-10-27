import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl min-w-[350px] max-w-[400px] w-full">
      <h2 className="text-center mb-6 text-black text-2xl font-bold">
        Login Akun
      </h2>
      <form>
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
          Login
        </button>
      </form>
      <button
        type="button"
        className="w-full py-3 mt-4 flex items-center justify-center border border-black rounded-lg font-semibold gap-3 text-base shadow hover:bg-gray-100 transition"
      >
        <FcGoogle size={25} />
        <span className="text-black">Login dengan Google</span>
      </button>
      <div className="text-center mt-6 text-base text-black">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="text-black font-medium hover:underline"
        >
          Daftar
        </Link>
      </div>
    </div>
  );
};

export default Login;
