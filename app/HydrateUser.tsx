'use client'
import { clearUser, setUser } from "@/features/userSlice";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function HydrateUser() {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(setUser(session.user));
    } else if (status === "unauthenticated") {
      dispatch(clearUser());
    }
  }, [status, session, dispatch]);

  return null;
}