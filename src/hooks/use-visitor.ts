import { useEffect, useRef } from "react";
import { visitorService } from "@/lib/visitor";

/**
 * Hook to track a visitor on a page
 * @param username The username of the profile being visited
 * @param pagePath The path of the page being visited
 */
export function useTrackVisitor(username: string | undefined, pagePath: string) {
  const tracked = useRef(false);

  useEffect(() => {
    if (username && !tracked.current) {
      visitorService.trackVisitor(username, pagePath);
      tracked.current = true;
    }
  }, [username, pagePath]);
}
