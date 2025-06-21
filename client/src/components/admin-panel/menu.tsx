"use client";

import { Ellipsis, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/useToast";
import { getMenuList } from "@/lib/menu-list";
import { cn } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { PrivateKeyDialog } from "../dialogs/PrivateKeyDialog";

interface MenuProps {
  isOpen: boolean | undefined;
}

interface InternalWallet {
  address: string;
}

interface CreateInternalWalletResponse extends InternalWallet {
  privateKey: string;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const { disconnect, account } = useWallet();
  const [internalWallet, setInternalWallet] = useState<InternalWallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // State for Private Key Dialog
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [isPKDialogOpen, setIsPKDialogOpen] = useState(false);

  // --- MOCK DATA AND API ---
  // Change this to `true` to mock the case where the wallet already exists.
  const MOCK_WALLET_EXISTS = false;

  const truncateAddress = (address: string) => {
    if (!address) return "";
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 5);
    return `${start}...${end}`;
  };

  const fetchInternalWallet = async () => {
    if (!account?.address) return;
    setIsLoading(true);
    console.log("MOCK: Fetching internal wallet...");

    setTimeout(() => {
      if (MOCK_WALLET_EXISTS) {
        console.log("MOCK: Wallet found.");
        setInternalWallet({
          address: "0x8e78f6c5b96d4e12c1b9a9f4c1e7f0c13c12",
        });
      } else {
        console.log("MOCK: No wallet found.");
        setInternalWallet(null);
      }
      setIsLoading(false);
    }, 1000);
  };

  const createInternalWallet = async () => {
    if (!account?.address) return;

    setIsLoading(true);
    console.log("MOCK: Creating internal wallet...");

    setTimeout(() => {
      const mockResponse: CreateInternalWalletResponse = {
        address: "0x8e78f6c5b96d4e12c1b9a9f4c1e7f0c13c12",
        privateKey: "0xb76b9f932065a3381452fa0281021315b8dc08ac6689a3074fa8354053ccbaeb",
      };

      console.log("MOCK: Wallet created successfully.");
      setInternalWallet({ address: mockResponse.address });
      setPrivateKey(mockResponse.privateKey);
      setIsPKDialogOpen(true); // Open the dialog
      setIsLoading(false);

      toast({
        title: "Tasmil Wallet created successfully!",
        // Assuming your toast has a success variant
        variant: "default",
        className: "bg-green-500 text-white",
      });
    }, 2000); // 2-second loading simulation
  };

  useEffect(() => {
    if (account?.address) {
      fetchInternalWallet();
    }
  }, [account?.address]);

  const renderGroupLabel = (groupLabel: string) => {
    if (!groupLabel) return <p className="pb-2"></p>;
    if (isOpen || isOpen === undefined)
      return (
        <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
          {groupLabel}
        </p>
      );

    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger className="w-full">
            <div className="w-full flex justify-center items-center">
              <Ellipsis className="h-5 w-5" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{groupLabel}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      <ScrollArea className="[&>div>div[style]]:!block">
        <nav className="mt-8 h-full w-full">
          <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
            {menuList.map(({ groupLabel, menus }, index) => (
              <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
                {renderGroupLabel(groupLabel)}
                {menus.map((menu) => {
                  const { href, label, icon: Icon, active, submenus } = menu;
                  const isActive = Boolean(active ?? pathname.startsWith(href));
                  if (!submenus?.length)
                    return (
                      <div className="w-full" key={href}>
                        <TooltipProvider disableHoverableContent>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className="w-full justify-start h-10 mb-1"
                                asChild
                              >
                                <Link href={href} className="flex items-center">
                                  <span className={isOpen ? "mr-4" : ""}>
                                    <Icon size={18} />
                                  </span>
                                  {isOpen && (
                                    <span className="max-w-[200px] truncate translate-x-0 opacity-100">
                                      {label}
                                    </span>
                                  )}
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    );
                  return (
                    <div className="w-full" key={href}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={isActive}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  );
                })}
              </li>
            ))}
            <li className="w-full grow flex flex-col justify-end">
              {/* Wallet Section */}
              <div className="w-full rounded-2xl p-3 mb-4 glass border border-white/5 space-y-2">
                <h3 className="text-center font-semibold text-base text-white/90">Wallet</h3>

                {/* Connected wallet address */}
                {account?.address && (
                  <div className="w-full rounded-lg p-3 bg-black/20">
                    <p className="text-gradient text-center font-mono font-semibold">
                      {truncateAddress(account.address.toString())}
                    </p>
                  </div>
                )}

                {/* Tasmil wallet */}
                <div className="w-full rounded-lg p-3 bg-black/20">
                  {isLoading && !internalWallet ? (
                    <p className="text-center text-sm text-white/70 animate-pulse">
                      Checking wallet...
                    </p>
                  ) : internalWallet ? (
                    <div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-white/60">Tasmil Wallet</p>
                        <Ellipsis className="h-4 w-4 text-white/60 cursor-pointer" />
                      </div>
                      <p className="text-gradient text-left font-mono font-semibold mt-1">
                        {truncateAddress(internalWallet.address)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm mb-3 text-white/70">
                        You haven&apos;t created a Tasmil Wallet yet.
                      </p>
                      <Button
                        onClick={createInternalWallet}
                        className="w-full h-10 gradient-outline font-semibold"
                        disabled={isLoading}
                        variant="ghost" // Use ghost to remove most default styles
                      >
                        {isLoading ? "Creating..." : "Create Tasmil Wallet"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Disconnect button */}
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => disconnect()}
                      variant="outline"
                      className="w-full justify-start h-10 mb-5"
                    >
                      <span className={cn(isOpen ? "mr-4" : "")}>
                        <LogOut size={18} />
                      </span>
                      {isOpen && <p className="whitespace-nowrap opacity-100">Disconnect Wallet</p>}
                    </Button>
                  </TooltipTrigger>
                  {!isOpen && <TooltipContent side="right">Disconnect Wallet</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </li>
          </ul>
        </nav>
      </ScrollArea>
      <PrivateKeyDialog
        isOpen={isPKDialogOpen}
        onClose={() => setIsPKDialogOpen(false)}
        privateKey={privateKey}
      />
    </>
  );
}
