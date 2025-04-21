import ConnectWallet from "../ConnectWallet";
import Logo from "../Logo";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6">
      <Logo />
      <Navbar className="absolute left-1/2 -translate-x-1/2" />
      <ConnectWallet />
    </div>
  );
};

export default Header;
