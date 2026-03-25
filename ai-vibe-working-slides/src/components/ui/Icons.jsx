export function WaveTrackIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 33C12.667 33 12.667 17 17.333 17C22 17 22 47 26.667 47C31.333 47 31.333 11 36 11C40.667 11 40.667 53 45.333 53C50 53 50 25 54.667 25"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="54.667" cy="25" r="5.333" fill="currentColor" />
    </svg>
  );
}
