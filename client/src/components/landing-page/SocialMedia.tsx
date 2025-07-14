import { DiscordIcon, LinkedInIcon, XIcon } from "../icon";

interface SocialLink {
  href: string;
  icon: React.ReactNode;
}

const socialLinks: SocialLink[] = [
  {
    href: "https://x.com",
    icon: <XIcon className="w-6 h-6" />,
  },
  {
    href: "https://discord.com",
    icon: <DiscordIcon className="w-6 h-6" />,
  },
  {
    href: "https://linkedin.com",
    icon: <LinkedInIcon className="w-6 h-6" />,
  },
];

export default function SocialMedia() {
  return (
    <div className="flex justify-center gap-6">
      {socialLinks.map(({ href, icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-primary transition-colors"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
