
"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      CheckUser();
      router.push("/dashboard"); // redirect if already logged in
    }
  }, [user, isLoaded]);

  const createUser = useMutation(api.user.createUser);
  const CheckUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName,
    });
    console.log(result);
  };

  if (user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 backdrop-blur-lg bg-white/50 border-b border-white/20 shadow-sm">
        <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">
          AI IntelliNotes
        </h1>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 gap-12">
        {/* Text Section */}
        <div className="text-center md:text-left max-w-xl space-y-6">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text">
            Transform your PDFs into the AI notes you actually need
          </h2>

          <p className="text-lg text-gray-700">
            Upload your PDFs and let AI craft concise, structured notes — helping you
            focus on learning, not summarizing.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <SignInButton mode="modal" redirectUrl="/dashboard">
              <Button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-medium rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all">
                Get Started
              </Button>
            </SignInButton>

            <Button
              variant="outline"
              className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl text-lg font-medium hover:bg-indigo-600 hover:text-white hover:scale-105 transition-all"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-md h-72 md:h-96 animate-float">
          <Image
            src="/download-pdf.png"
            alt="AI Notes Illustration"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-300 bg-white/40 backdrop-blur-md">
        © {new Date().getFullYear()} AI Notes. All rights reserved.
      </footer>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translatey(0px);
          }
          50% {
            transform: translatey(-15px);
          }
          100% {
            transform: translatey(0px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
