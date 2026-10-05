import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          eflab
        </Link>
      </div>
      <p className="footer-credit">
        Designed by <strong>SwiftSIQI</strong>
      </p>
    </footer>
  );
}
