/** The site mark: a small pizza (crust, cheese, three pepperoni) drawn as SVG so it follows the palette. */
export default function PizzaMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="24" cy="24" r="22" fill="#d98c2b" />
      <circle cx="24" cy="24" r="18" fill="#ffc72c" />
      <circle cx="17" cy="19" r="4.2" fill="#c9241b" />
      <circle cx="30.5" cy="16.5" r="3.4" fill="#c9241b" />
      <circle cx="29" cy="30" r="4.6" fill="#c9241b" />
      <circle cx="16" cy="31" r="2.6" fill="#c9241b" />
    </svg>
  );
}
