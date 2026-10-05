import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          eFootball Lab
        </Link>
        <p>
          快速查询比赛风格、球员技巧、球员属性与增能，资料以游戏内说明为准。
        </p>
      </div>
      <p className="footer-credit">
        Designed by <strong>SwiftSIQI</strong>
      </p>
    </footer>
  );
}
