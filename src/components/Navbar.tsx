"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Pill, Users } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname(); // ใช้เช็คว่าตอนนี้อยู่หน้าไหน

  // รายการเมนู
  const navItems = [
    { name: "หน้าหลัก", href: "/", icon: Home },
    { name: "ตารางวันนี้", href: "/schedule", icon: Calendar },
    { name: "รายการยา", href: "/medications", icon: Pill },
    { name: "แชร์ให้ญาติ", href: "/family?id=demo123", icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-zinc-950 border-t border-zinc-800 pb-safe md:relative md:border-t-0 md:border-b z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto md:max-w-4xl md:justify-center md:gap-12">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] md:text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}