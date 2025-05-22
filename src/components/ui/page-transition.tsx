
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  const { animationsEnabled, reducedMotion } = useSelector((state: RootState) => state.ui);
  
  useEffect(() => {
    // Skip animation if we're on the index page or animations are disabled
    if (location.pathname === "/" || !animationsEnabled || reducedMotion) {
      setDisplayChildren(children);
      return;
    }

    setTransitionStage("fadeOut");
    
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage("fadeIn");
    }, 300);

    return () => clearTimeout(timeout);
  }, [location, children, animationsEnabled, reducedMotion]);

  // If animations are disabled, just render the children
  if (!animationsEnabled || reducedMotion) {
    return <>{children}</>;
  }

  return (
    <div
      className={`transition-all duration-300 ${
        transitionStage === "fadeIn" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
