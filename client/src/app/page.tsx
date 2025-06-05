import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with gradient background */}
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        {/* Floating shapes for visual interest */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-25"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full">
                🎉 Where memories begin
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Every Event<br />
              <span className="text-4xl md:text-5xl">Tells a Story</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              From intimate gatherings to grand celebrations, we help you create moments that matter. 
              Join a community where every event is an opportunity to connect, learn, and grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3">
                <Link href="/events">Discover Events</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950 px-8 py-3">
                <Link href="/register">Start Creating</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
