import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ClerkProvider, SignedIn, ClerkLoading } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ColorTheming";
import SideBar from "@/components/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import { ToastProvider } from "@/components/ui/toast"; // Import ToastProvider
import { Toast } from "@/components/ui/toast";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sanity",
  description: "Therapist App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`dark:text-gray-100 text-slate-600 ${inter.className}`}>
          <StreamVideoProvider>
            <ToastProvider> {/* Wrap everything in ToastProvider */}
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <ClerkLoading>
                  <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col space-y-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl skeleton" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px] skeleton" />
                        <Skeleton className="h-4 w-[200px] skeleton" />
                      </div>
                    </div>
                  </div>
                </ClerkLoading>
                <SignedIn>
                  <div className="flex">
                    <div className="hidden lg:block w-[320px]">
                      <SideBar />
                    </div>
                    <div className="flex flex-col h-screen w-full overflow-y-auto lg:pb-0 pb-[5rem]">
                      <Navbar />
                      <div className="mt-16 p-2 md:p-4">
                        {children}
                        <Toast />
                      </div>
                    </div>
                  </div>
                  <div className="fixed bottom-4 right-4 z-10">
                    <ModeToggle />
                  </div>
                </SignedIn>
              </ThemeProvider>
            </ToastProvider>
          </StreamVideoProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
