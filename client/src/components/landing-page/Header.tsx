import Logo from "../Logo";
import { AptosConnectWallet } from "../wallet/aptos-wallet";
import SuiConnectWallet from "../wallet/sui-wallet";
import Navbar from "./Navbar";

type HeaderProps = {
  walletType?: "sui" | "aptos";
};

const Header = ({ walletType = "aptos" }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6">
      <Logo />
      <Navbar className="absolute left-1/2 -translate-x-1/2" />
      {walletType === "aptos" ? <AptosConnectWallet /> : <SuiConnectWallet />}
    </div>
  );
};

export default Header;
