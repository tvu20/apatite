"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const usePageLoading = () => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathnameRef = useRef(pathname);
  const prevSearchParamsRef = useRef(searchParams.toString());

  useEffect(() => {
    const pathnameChanged = prevPathnameRef.current !== pathname;
    const searchParamsChanged =
      prevSearchParamsRef.current !== searchParams.toString();

    if (pathnameChanged || searchParamsChanged) {
      // Defer state update to avoid synchronous setState in effect
      const startTimeoutId = setTimeout(() => {
        setIsPageLoading(true);
      }, 0);

      const endTimeoutId = setTimeout(() => {
        setIsPageLoading(false);
        prevPathnameRef.current = pathname;
        prevSearchParamsRef.current = searchParams.toString();
      }, 100);

      return () => {
        clearTimeout(startTimeoutId);
        clearTimeout(endTimeoutId);
      };
    }
  }, [pathname, searchParams]);

  return { isPageLoading };
};
