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

  if (user) {
    return null; // prevents showing landing page during redirect
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-black/10">
        <h1 className="text-2xl font-bold">AI Notes</h1>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 gap-12">
        {/* Text */}
        <div className="text-center md:text-left max-w-xl">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            AI note u need the most.
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            Upload your PDFs and let AI generate concise, smart, and structured notes —
            so you can focus on learning, not summarizing.
          </p>
          {console.log("production url",process.env.NEXT_PUBLIC_API_URL)}

          <div className="mt-8 flex gap-4 justify-center md:justify-start">
            <SignInButton mode="modal" redirectUrl="/dashboard">
              <Button className="bg-black text-white hover:bg-gray-800">
                Get Started
              </Button>
            </SignInButton>

            <Button
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-md h-72 md:h-96">
          <Image
            src="/download-pdf.png" 
            alt="AI Notes Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>

      </main>
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-black/10">
        © {new Date().getFullYear()} AI Notes. All rights reserved.
      </footer>
    </div>
  );
}
