import React from 'react';

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center px-8 py-4 sticky top-0 z-50 bg-transparent">
            <div className="text-2xl font-bold text-inherit">
                Chatopia
            </div>
            <div className="flex gap-4">
                <button className="px-4 py-2 rounded cursor-pointer font-medium transition-all duration-200 bg-transparent text-inherit border border-current hover:bg-gray-500/10">
                    Login
                </button>
                <button className="px-4 py-2 rounded cursor-pointer font-medium transition-all duration-200 bg-blue-500 text-white border border-blue-500 hover:bg-blue-600">
                    Signup
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
