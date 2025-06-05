'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { LogOut, User, Calendar, Plus, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed z-50 w-full border-b border-white/15 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Desktop Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold" onClick={closeMobileMenu}>
              EventManager
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-4">
              <Link 
                href="/events" 
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === '/events' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Events
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                      pathname === '/dashboard' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/events/new" 
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                      pathname === '/events/new' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    Create Event
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              <Link 
                href="/events" 
                onClick={closeMobileMenu}
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  pathname === '/events' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Events
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    href="/dashboard" 
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      pathname === '/dashboard' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Dashboard
                    </div>
                  </Link>
                  <Link 
                    href="/events/new" 
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      pathname === '/events/new' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Event
                    </div>
                  </Link>
                </>
              )}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-border">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="w-full justify-start flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/login" onClick={closeMobileMenu}>Login</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register" onClick={closeMobileMenu}>Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
