"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Pessoas', path: '/dashboard/pessoas' },
    { name: 'Pacotes', path: '/dashboard/pacotes' },
    { name: 'Financeiro', path: '/dashboard/financeiro' },
    { name: 'Reservas', path: '/dashboard/reservas' },
  ];

  return (
    <div className="flex bg-black min-h-screen text-white">
      

      <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col p-4 sticky top-0 h-screen">
        <div className="px-4 py-5 mb-4 border-b border-gray-800">
          <span className="text-lg font-light tracking-widest text-gray-400 uppercase">Agência</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            
            const isActive = pathname.startsWith(item.path); 
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-3.5 text-sm transition-all border-b border-gray-800/60 first:rounded-t-xl last:rounded-b-xl last:border-none ${
                  isActive
                    ? 'bg-gray-900/80 text-white font-medium border-l-2 border-l-blue-500 pl-3'
                    : 'text-gray-400 hover:bg-gray-900/40 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>


      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}