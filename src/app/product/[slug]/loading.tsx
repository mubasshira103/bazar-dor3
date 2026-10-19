export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7faf7] px-4">
      <div className="flex flex-col items-center text-center">
        {/* Website Name */}

        {/* Loading Spinner */}
        <div className="relative mb-7 h-14 w-14">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-green-100 border-t-green-700" />
        </div>

        {/* Loading Text */}
        <h2 className="mb-2 text-xl font-bold text-gray-800">দয়া করে অপেক্ষা করুন...</h2>
      </div>
    </main>
  );
}
