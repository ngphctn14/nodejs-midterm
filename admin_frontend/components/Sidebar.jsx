import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, ChevronRight, LogOut } from 'lucide-react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { href: '/', icon: <LayoutDashboard className="w-5 h-5" />, text: 'Dashboard', hasSubnav: true },
    { href: '/feedbacks', icon: <MessageSquare className="w-5 h-5" />, text: 'Feedbacks management', hasSubnav: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out z-50 flex flex-col justify-between group
        ${isExpanded ? 'w-64' : 'w-18'} hover:w-64`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span
            className={`ml-3 text-white font-semibold text-lg whitespace-nowrap overflow-hidden transition-all duration-300
              ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
          >
            Admin Page
          </span>
        </div>
      </div>

      <ul className="flex-1 mt-4 space-y-1 px-2">
        {menuItems.map((item, index) => (
          <li key={index} className="relative">
            <a
              href={item.href}
              className="flex items-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-all duration-200 h-11 px-2"
              onClick={(e) => item.href === '#' && e.preventDefault()}
            >
              <span className="flex items-center justify-center w-8 h-8 text-lg">
                {item.icon}
              </span>
              <span
                className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 font-medium text-sm
                  ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
                style={{ fontFamily: "'Titillium Web', sans-serif" }}
              >
                {item.text}
              </span>
              {item.hasSubnav && (
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>

      <div className="p-2 border-t border-gray-700">
        <a
          href="#"
          className="flex items-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-all duration-200 h-11 px-2"
          onClick={(e) => e.preventDefault()}
        >
          <span className="flex items-center justify-center w-8 h-8 text-lg">
            <LogOut className="w-5 h-5" />
          </span>
          <span
            className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 font-medium text-sm
              ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
            style={{ fontFamily: "'Titillium Web', sans-serif" }}
          >
            Logout
          </span>
        </a>
      </div>
    </nav>
  );
};

export default Sidebar;
