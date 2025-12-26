import React from 'react';

export default function Logo() {
    return (
        <div className="group flex items-center text-3xl font-futura tracking-tight">
            <span>im</span>
            <span>e</span>
            <span>d</span>
            <span className="relative inline-block">
                i
                <svg
                    className="absolute top-[-40px] left-0 h-12 w-4 fill-current origin-bottom rotate-[45deg] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[50deg]"
                    viewBox="0 0 100 300"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Simplified vane lines */}
                    <path d="M50 0C30 50 20 100 25 150C30 200 40 250 50 300" fill="none" stroke="black" strokeWidth="10" />
                    {/* Central shaft */}
                    <path d="M50 0 L50 300" fill="none" stroke="black" strokeWidth="5" />
                    {/* Add more paths for detailed stripes if desired */}
                </svg>
            </span>
            <span>acorp.com</span>
        </div>
    );
}