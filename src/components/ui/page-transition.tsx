
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location.pathname === "/") return;

    setTransitionStage("fadeOut");
    
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage("fadeIn");
    }, 300);

    return () => clearTimeout(timeout);
  }, [location, children]);

  return (
    <div
      className={`transition-all duration-300 ${
        transitionStage === "fadeIn" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
