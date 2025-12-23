import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-purple-500/30">
            {/* Navbar / Header */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
                            D
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Dimyaz Trade
                        </span>
                    </Link>

                    <nav className="flex items-center gap-6 text-sm font-medium text-gray-400">
                        <Link href="/markets" className="hover:text-white transition-colors">Markets</Link>
                        <Link href="/" className="text-white">Analysis</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};
