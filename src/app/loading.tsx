export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999]">
      <div className="p-8 bg-card rounded-lg shadow-xl flex flex-col items-center">
        <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-6 text-lg font-medium text-foreground">Loading ad the add hub...</p>
      </div>
    </div>
  );
}
