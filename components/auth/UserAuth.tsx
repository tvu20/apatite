"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function UserAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (session?.user?.email) {
    return (
      <div>
        <p>{session.user.email}</p>
        <button onClick={() => signOut()}>log out</button>
      </div>
    );
  }

  return <button onClick={() => signIn("github")}>login</button>;
}
