"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function UserAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (session?.user?.email) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="font-[family-name:var(--font-geist-sans)]">
          {session.user.email}
        </p>
        <button
          onClick={() => signOut()}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-[family-name:var(--font-geist-sans)]"
        >
          log out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-[family-name:var(--font-geist-sans)]"
    >
      login
    </button>
  );
}
