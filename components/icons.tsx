import type { SVGProps } from 'react';

export function CursorClickIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.151 2.51 9.911 4 5 22m0 0l5.57.188 2.239.777 2.89 5.136 7.965-2.898-.777-13.95 4.051-2.122 2.122-5.657 5.656-2.12 2.122"
      />
    </svg>
  );
}
