import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number | string };

type IconBaseProps = IconProps & { children: React.ReactNode };

const IconBase = ({ size = 24, children, ...props }: IconBaseProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

export const Home = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </IconBase>
);

export const Calendar = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </IconBase>
);

export const CalendarDays = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M7 14h2M11 14h2M15 14h2M7 18h2M11 18h2" />
  </IconBase>
);

export const User = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </IconBase>
);

export const Users = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="9" r="3" />
    <path d="M2 20a6 6 0 0 1 12 0M10 20a6 6 0 0 1 12 0" />
  </IconBase>
);

export const Settings = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a7.7 7.7 0 0 0 .1-2l2-1.2-2-3.4-2.3.6a7 7 0 0 0-1.7-1L13.9 3h-3.8l-.6 2.9a7 7 0 0 0-1.7 1l-2.3-.6-2 3.4 2 1.2a7.7 7.7 0 0 0 .1 2l-2 1.2 2 3.4 2.3-.6a7 7 0 0 0 1.7 1l.6 2.9h3.8l.6-2.9a7 7 0 0 0 1.7-1l2.3.6 2-3.4z" />
  </IconBase>
);

export const LogOut = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </IconBase>
);

export const Bell = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </IconBase>
);

export const Menu = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </IconBase>
);

export const X = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </IconBase>
);

export const Search = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </IconBase>
);

export const Shield = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5z" />
  </IconBase>
);

export const Upload = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3v12" />
    <path d="M7 8l5-5 5 5" />
    <path d="M5 21h14" />
  </IconBase>
);

export const MapPin = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 22s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11" />
    <circle cx="12" cy="11" r="3" />
  </IconBase>
);

export const Clock = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6l4 2" />
  </IconBase>
);

export const Stethoscope = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M6 3v4a4 4 0 0 0 8 0V3" />
    <path d="M10 14a4 4 0 0 0 8 0v-1" />
    <circle cx="18" cy="13" r="2" />
  </IconBase>
);

export const FileText = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v5h5" />
    <path d="M9 13h6M9 17h6M9 9h2" />
  </IconBase>
);

export const ArrowRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </IconBase>
);

export const ArrowLeft = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M19 12H5" />
    <path d="M11 6 5 12l6 6" />
  </IconBase>
);

export const Star = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 2l3 6 6 .9-4.5 4.4 1.1 6.2L12 16l-5.6 3.5 1.1-6.2L3 8.9 9 8z" />
  </IconBase>
);

export const CheckCircle = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l2.5 2.5L16 9" />
  </IconBase>
);

export const XCircle = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15 9 9 15M9 9l6 6" />
  </IconBase>
);

export const Eye = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
);

export const EyeOff = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 3l18 18" />
    <path d="M10.5 6.5A9.5 9.5 0 0 1 12 6c6 0 10 6 10 6a16 16 0 0 1-4.5 4.7" />
    <path d="M6.3 6.3A16 16 0 0 0 2 12s4 6 10 6a9.5 9.5 0 0 0 4.2-1" />
    <path d="M9.8 9.8a3 3 0 0 0 4.2 4.2" />
  </IconBase>
);

export const Lock = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </IconBase>
);

export const Mail = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </IconBase>
);

export const Loader2 = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M21 12a9 9 0 1 1-9-9" />
  </IconBase>
);

export const Frown = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9h.01M15 9h.01" />
    <path d="M16 16a4 4 0 0 0-8 0" />
  </IconBase>
);

export const AlertTriangle = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M10.3 3.2 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </IconBase>
);

export const AlertCircle = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </IconBase>
);

export const MessageSquare = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </IconBase>
);

export const Check = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20 6 9 17l-5-5" />
  </IconBase>
);

export const ChevronRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 18l6-6-6-6" />
  </IconBase>
);

export const ChevronLeft = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M15 18l-6-6 6-6" />
  </IconBase>
);

export const ChevronDown = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M6 9l6 6 6-6" />
  </IconBase>
);

export const ExternalLink = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M14 3h7v7" />
    <path d="M10 14 21 3" />
    <path d="M21 14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
  </IconBase>
);

export const Trash2 = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
    <path d="M10 11v6M14 11v6" />
  </IconBase>
);

export const Heart = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z" />
  </IconBase>
);

export const Award = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M8 12l-2 8 6-3 6 3-2-8" />
  </IconBase>
);

export const RefreshCw = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.5 9A9 9 0 0 1 20 6.5L23 10" />
    <path d="M20.5 15A9 9 0 0 1 4 17.5L1 14" />
  </IconBase>
);

export const Filter = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M22 3H2l8 9v6l4 3v-9z" />
  </IconBase>
);

export const Download = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M5 21h14" />
  </IconBase>
);

export const Plus = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 5v14M5 12h14" />
  </IconBase>
);

export const MoreVertical = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 5h.01M12 12h.01M12 19h.01" />
  </IconBase>
);
