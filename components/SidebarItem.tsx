import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { IconType } from "react-icons";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
}) => {
  return (
    <Link
      href={href}
      className={twMerge(
        `flex flex-row h-auto w-full items-center gap-x-4 text-md font-medium cursor-pointer hover:text-white transition text-neutral-400 py-1`,
        active && "text-white"
      )}
    >
      <Icon size={26}></Icon>
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};

export default SidebarItem;
