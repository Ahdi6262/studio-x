export function Footer() {
  return (
    <footer className="py-8 border-t border-border/40">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CreatorChain Hub. All rights reserved.
        </p>
        <div className="flex space-x-4">
          {/* Add social media icons or other links here if needed */}
        </div>
      </div>
    </footer>
  );
}
