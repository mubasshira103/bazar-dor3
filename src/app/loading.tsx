export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7faf7] px-4">
      <div className="flex flex-col items-center text-center">
        {/* Website Name */}

        <p className="mb-10 text-sm text-gray-500">সঠিক তথ্য, সচেতন বাজার</p>

        {/* Loading Spinner */}
        <div className="relative mb-7 h-14 w-14">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-green-100 border-t-green-700" />
        </div>

        {/* Loading Text */}
        <h2 className="mb-2 text-xl font-bold text-gray-800">দয়া করে অপেক্ষা করুন...</h2>

        <p className="max-w-xs text-sm leading-6 text-gray-500">
          আমরা আপনার জন্য বাজারের সর্বশেষ তথ্য নিয়ে আসছি।
        </p>

        {/* Loading Dots */}
        <div className="mt-6 flex gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-700" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-700 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-700 [animation-delay:300ms]" />
        </div>
      </div>
    </main>
  );
}
