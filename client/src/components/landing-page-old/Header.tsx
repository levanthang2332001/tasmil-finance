import { PATHS } from "@/constants/routes";
import Logo from "../sidebar/Logo";
import { Button } from "../ui/button";
import Navbar from "./Navbar";
import Link from "next/link";
import { Rocket } from "lucide-react";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between backdrop-blur-sm px-6">
      <Logo />
      <Navbar className="absolute left-1/2 -translate-x-1/2" />
      <Link href={PATHS.DASHBOARD} target="_blank" rel="noopener noreferrer">
        <Button variant="galaxy">
          <Rocket className="mr-2 h-4 w-4" />
          Launch App
        </Button>
      </Link>
    </div>
  );
};

export default Header;
