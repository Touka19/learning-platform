"use client";

import { BookOpen, Library, List } from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: BookOpen,
    label: "Мої курси",
    href: "/",
  },
  {
    icon: Library,
    label: "Каталог курсів",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Курси",
    href: "/teacher/courses",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
