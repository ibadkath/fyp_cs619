"use client";

import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Correct import for app directory
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // If the user is authenticated, ensure they are on the correct page
    if (status === "authenticated") {
      router.push("/UploadFile");
    }
  }, [status, router]);// Only run this effect when `session` or `router` changes

  const handleSignIn = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  if(status === "loading"){
    <div>loading...</div>
  }
  
  if (session) {
    return (
      <>
        <p>Signed in as {session.user?.email}</p> <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <div className="flex-grow flex justify-center items-start">
        <div className="w-full max-w-lg mt-36">
          <h2 className="text-3xl font-bold text-center text-white mb-20 items-baseline">
            AutoSum-Research Article Summary Generator
          </h2>
          <Card className=" p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Login
              </CardTitle>
              {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
              <Input placeholder="Enter Your Email" />
            </CardContent>
            <CardFooter>
              <Button className=" w-full" onClick={handleSignIn}>
                Sign In with Google
              </Button>
              {/* <button
        className="w-full py-2 mt-4 font-bold text-white bg-orange-400 rounded-md hover:bg-orange-500"
        onClick={() => signIn('google')}
      >
        Sign in with Google
      </button> */}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
