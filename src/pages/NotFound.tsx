
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-bubble-light to-bubble-blue/30 p-4">
      <div className="text-center max-w-md bubble-card animate-fade-in">
        <div className="w-24 h-24 bg-bubble-light/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icons.helpCircle className="h-12 w-12 text-bubble-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-bubble-primary">404</h1>
        <p className="text-xl text-bubble-dark mb-6">Oops! Page not found</p>
        <p className="text-bubble-neutral mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button className="bg-bubble-primary hover:bg-bubble-secondary" asChild>
          <a href="/">
            <Icons.home className="mr-2 h-4 w-4" />
            Return to Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
