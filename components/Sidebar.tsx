"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { twMerge } from "tailwind-merge";

import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import useRandomColor from "@/hooks/useRandomColor";

export const revalidate = 0;
interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {
  const player = usePlayer();
  const pathname = usePathname();
  const [scroll, setScroll] = useState(false);
  const { randomColor } = useRandomColor();
  const Color = scroll ? randomColor : "";

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "Home",
        active: pathname !== "/search",
        href: "/",
      },
      {
        icon: BiSearch,
        label: "Search",
        active: pathname === "search",
        href: "/search",
      },
    ],
    [pathname]
  );

  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    scrollableRef?.current?.addEventListener("scroll", handleScroll);
    window.scrollTo(0, 0);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scrollableRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (typeof window === "undefined") return;
    const scrollTop = scrollableRef?.current?.scrollTop;
    if (scrollTop! >= 100) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  return (
    <div
      className={twMerge(
        `flex h-full`,
        player.activeId && "h-[calc(100%-120px)]"
      )}
    >
      <div className="hidden md:flex flex-col gap-y-2 bg-black h-full p-2 pb-0 w-[300px]">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item}></SidebarItem>
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library songs={songs}></Library>
        </Box>
      </div>
      <main
        ref={scrollableRef}
        className="relative h-full overflow-y-auto flex-1 py-2 pb-0 rounded-lg"
      >
        <div
          style={{ backgroundColor: Color }}
          className="fixed md:ml-[300px] top-0 z-50 opacity-90 left-0 w-[106%] h-20 mt-2 rounded-lg border-teal-500"
        ></div>
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
