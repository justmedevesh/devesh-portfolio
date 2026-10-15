/* Monochrome line icons (inherit currentColor) used by the dock and windows. */

const base = {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
};

export const HomeIcon = () => (<svg {...base}><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>);
export const UserIcon = () => (<svg {...base}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>);
export const MonitorIcon = () => (<svg {...base}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /><path d="m7 12 3-3 2 2 4-4" /></svg>);
export const BriefcaseIcon = () => (<svg {...base}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="M3 13h18" /></svg>);
export const CapIcon = () => (<svg {...base}><path d="m2 9 10-5 10 5-10 5-10-5Z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /><path d="M22 9v6" /></svg>);
export const AwardIcon = () => (<svg {...base}><circle cx="12" cy="9" r="6" /><path d="M9 14.5 7.5 22l4.5-2.5 4.5 2.5L15 14.5" /></svg>);
export const FolderIcon = () => (<svg {...base}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /></svg>);
export const DocIcon = () => (<svg {...base}><path d="M6 3h8l5 5v13H6z" /><path d="M14 3v5h5M9 13h7M9 17h5" /></svg>);
export const MailIcon = () => (<svg {...base}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>);
export const TerminalIcon = () => (<svg {...base}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M12 15h5" /></svg>);
export const GridIcon = () => (<svg {...base} strokeWidth="2.6"><path d="M6 6h.01M12 6h.01M18 6h.01M6 12h.01M12 12h.01M18 12h.01M6 18h.01M12 18h.01M18 18h.01" /></svg>);
export const GithubIcon = () => (<svg {...base}><path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.2 4.4 4.4 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.5 2.5 5.5 2.8 5.5 2.8a4.4 4.4 0 0 0-.1 3.2A4.7 4.7 0 0 0 4 9.2c0 4.7 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21" /></svg>);
export const LinkedinIcon = () => (<svg {...base}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></svg>);
export const SunIcon = () => (<svg {...base}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>);
export const MoonIcon = () => (<svg {...base}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>);
export const WifiIcon = () => (<svg {...base}><path d="M2 8.5a15 15 0 0 1 20 0M5 12a10.5 10.5 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01" /></svg>);
export const VolumeIcon = () => (<svg {...base}><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg>);
export const PowerIcon = () => (<svg {...base}><path d="M12 3v9" /><path d="M6.4 6.4a8 8 0 1 0 11.2 0" /></svg>);
export const MinIcon = () => (<svg {...base} strokeWidth="2.4"><path d="M5 12h14" /></svg>);
export const MaxIcon = () => (<svg {...base} strokeWidth="2.4"><rect x="5" y="5" width="14" height="14" rx="1" /></svg>);
export const CloseIcon = () => (<svg {...base} strokeWidth="2.4"><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const ImageIcon = () => (<svg {...base}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></svg>);
export const LinkIcon = () => (<svg {...base}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>);
export const GlobeIcon = () => (<svg {...base}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>);
export const XIcon = () => (<svg {...base}><path d="M4 4l16 16M20 4 4 20" /></svg>);
export const InstagramIcon = () => (<svg {...base}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg>);
export const FacebookIcon = () => (<svg {...base}><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2V3Z" /></svg>);
export const YoutubeIcon = () => (<svg {...base}><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3V9Z" /></svg>);
export const MediumIcon = () => (<svg {...base}><ellipse cx="7" cy="12" rx="4.5" ry="5" /><ellipse cx="16" cy="12" rx="2.2" ry="4.6" /><path d="M21 7.5v9" /></svg>);
export const KaggleIcon = () => (<svg {...base}><path d="M7 3v18M7 13l9-9M10.5 10.5 17 21" /></svg>);
export const WhatsappIcon = () => (<svg {...base}><path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3l-4.5 1.5Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2L9 9.5Z" /></svg>);
export const TelegramIcon = () => (<svg {...base}><path d="M21 4 3 11l6 2 2 6 3-4 5 4 2-15Z" /><path d="m9 13 8-6" /></svg>);
export const PhoneIcon = () => (<svg {...base}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>);

/** Platforms the admin can pick for a social link → icon + default label. */
export const SOCIAL_PLATFORMS = {
  github: { label: 'GitHub', Icon: GithubIcon, hint: 'https://github.com/username' },
  linkedin: { label: 'LinkedIn', Icon: LinkedinIcon, hint: 'https://linkedin.com/in/username' },
  x: { label: 'X (Twitter)', Icon: XIcon, hint: 'https://x.com/username' },
  instagram: { label: 'Instagram', Icon: InstagramIcon, hint: 'https://instagram.com/username' },
  facebook: { label: 'Facebook', Icon: FacebookIcon, hint: 'https://facebook.com/username' },
  youtube: { label: 'YouTube', Icon: YoutubeIcon, hint: 'https://youtube.com/@channel' },
  medium: { label: 'Medium', Icon: MediumIcon, hint: 'https://medium.com/@username' },
  kaggle: { label: 'Kaggle', Icon: KaggleIcon, hint: 'https://kaggle.com/username' },
  whatsapp: { label: 'WhatsApp', Icon: WhatsappIcon, hint: 'https://wa.me/9779800000000' },
  telegram: { label: 'Telegram', Icon: TelegramIcon, hint: 'https://t.me/username' },
  email: { label: 'Email', Icon: MailIcon, hint: 'you@example.com' },
  phone: { label: 'Phone', Icon: PhoneIcon, hint: 'tel:+9779800000000' },
  website: { label: 'Website', Icon: GlobeIcon, hint: 'https://example.com' },
};

export const socialIcon = (platform) => (SOCIAL_PLATFORMS[platform] || SOCIAL_PLATFORMS.website).Icon;
export const StarIcon = () => (<svg {...base}><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3Z" /></svg>);
export const DraftIcon = () => (<svg {...base}><path d="M4 20h4L19 9l-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></svg>);
