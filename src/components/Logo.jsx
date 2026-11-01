import { APP_NAME } from '../brand.js';
// Mark: a progress ring (goal), a check (done) and an amber dot (streak spark).
export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={APP_NAME}>
      <rect width="64" height="64" rx="16" fill="#2f6f5e" />
      <circle cx="32" cy="32" r="17" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="5" />
      <circle cx="32" cy="32" r="17" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeDasharray="80 107" transform="rotate(-90 32 32)" />
      <circle cx="15" cy="32" r="3.6" fill="#e3b04e" />
      <path d="M24.5 32.5l5.5 5.5 10-11" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export default function Logo({ size = 34, text = true }) {
  return <div className="logo"><LogoMark size={size} />{text && <b>{APP_NAME}</b>}</div>;
}
