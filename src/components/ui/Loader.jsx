export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center">
      
      {/* Spinner */}
      <div className="w-14 h-14 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>

      {/* Text */}
      <p className="mt-4 text-white font-medium tracking-wide">
        Processing...
      </p>

    </div>
  );
}