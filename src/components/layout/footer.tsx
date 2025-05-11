import React from 'react';

export const Footer = React.memo(function Footer() {
  return (
    <footer className="py-8 border-t border-border/40">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} HEX THE ADD HUB. All rights reserved.
        </p>
        <div className="flex space-x-4">
          {/* Placeholder for social media or other links */}
          {/* Example:
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
            Terms of Service
          </Link>
          */}
        </div>
      </div>
    </footer>
  );
});
Footer.displayName = 'Footer';
