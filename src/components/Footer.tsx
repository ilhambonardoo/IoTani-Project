const Footer = () => {
  return (
    <footer className="border-t border-slate-700/50 py-8 bg-whie">
      <div className="container mx-auto px-6 text-center text-black">
        <p>
          &copy; {new Date().getFullYear()} IoTani. Semua Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
