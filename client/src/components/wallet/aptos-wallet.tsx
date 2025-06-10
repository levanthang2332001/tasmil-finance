"use client";

import {
  AboutAptosConnect,
  AboutAptosConnectEducationScreen,
  WalletItem,
  WalletSortingOptions,
  groupAndSortWallets,
  isInstallRequired,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { ArrowLeft, ArrowRight, ChevronDown, LogOut, SquareArrowOutUpRight } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useToast } from "@/hooks/shared/use-toast";
import { Image } from "@/components/ui/image";
import { CustomImage, Source, ImageFallback } from "@/components/ui/custom-image";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { FaRegCopy } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { IoCheckmarkOutline } from "react-icons/io5";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";

export function AptosConnectWallet({ walletSortingOptions = {} }: { walletSortingOptions?: WalletSortingOptions }) {
  const { account, connected, disconnect, wallet } = useWallet();
  const { toast } = useToast();
  const [isWalletOpen, setWalletModalOpen] = useState(false);

  const closeDialog = useCallback(() => setWalletModalOpen(false), [setWalletModalOpen]);

  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address.toString());
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      });
    }
  }, [account?.address, toast]);

  return connected ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-full px-3 py-4">
          <Image src={wallet?.icon ?? ""} alt={wallet?.name ?? ""} width={20} height={20} className="rounded-full" />
          <Typography>{account?.ansName || truncateAddress(account?.address.toString()) || "Unknown"}</Typography>
          <CustomImage className="h-5 w-5">
            <Source src="/images/avatar/default_avatar.png" />
            <ImageFallback>{account?.ansName}</ImageFallback>
          </CustomImage>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[465px]">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
        </VisuallyHidden.Root>

        {/* body */}
        <div className="flex flex-col items-center gap-4 pb-2 pt-4">
          <CustomImage className="h-12 w-12">
            <Source src="/images/avatar/default_avatar.png" />
            <ImageFallback>
              <Typography>{account?.ansName}</Typography>
            </ImageFallback>
          </CustomImage>
          <div onClick={copyAddress} className="flex cursor-pointer flex-row items-center gap-2 rounded-full border border-ring/30 px-3 py-2">
            <Typography>{account?.ansName || truncateAddress(account?.address.toString()) || "Unknown"}</Typography>
            <FaRegCopy size={18} />
          </div>
          <div className="flex w-full flex-row items-center justify-between px-4">
            <Typography>Wallet Balance</Typography>
            <div className="flex flex-row items-center gap-2">
              <Image src="/images/token/aptos.png" alt="APT" width={20} height={20} />
              <Typography>1,500 APT</Typography>
            </div>
          </div>
          <Separator />
          <div className="flex w-full flex-row items-center justify-between">
            <Typography>Recent Transactions</Typography>
            <Button variant={"secondary"} size={"default"}>
              View On Explorer
            </Button>
          </div>

          <div className="flex w-full flex-col">
            <Link href="/" className="flex flex-row gap-2 rounded-md p-2 hover:bg-third/20">
              <IoCheckmarkOutline size={22} />
              <div className="flex flex-1 flex-col">
                <Typography>Lend zUSDC</Typography>
                <Typography className="text-sm text-muted-foreground">Deposit - 8 zUSDC</Typography>
              </div>
              <SquareArrowOutUpRight size={18} className="text-muted-foreground" />
            </Link>

            <Link href="/" className="flex flex-row gap-2 rounded-md p-2 hover:bg-third/20">
              <IoCheckmarkOutline size={22} />
              <div className="flex flex-1 flex-col">
                <Typography>Approved zUSDC</Typography>
              </div>
              <SquareArrowOutUpRight size={18} className="text-muted-foreground" />
            </Link>

            <Link href="/" className="flex flex-row gap-2 rounded-md p-2 hover:bg-third/20">
              <IoCheckmarkOutline size={22} />
              <div className="flex flex-1 flex-col">
                <Typography>Farm APT-zUSDC 3X</Typography>
                <Typography className="text-sm text-muted-foreground">Deposit - 100 APT + 100 USDC</Typography>
              </div>
              <SquareArrowOutUpRight size={18} className="text-muted-foreground" />
            </Link>
          </div>
          <Separator />
          <Button variant="secondary" className="py-4" onClick={disconnect}>
            <Typography>Disconnect Wallet</Typography>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Dialog open={isWalletOpen} onOpenChange={setWalletModalOpen}>
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <ConnectWalletDialog close={closeDialog} {...walletSortingOptions} />
    </Dialog>
  );
}

interface ConnectWalletDialogProps extends WalletSortingOptions {
  close: () => void;
}

function ConnectWalletDialog({ close, ...walletSortingOptions }: ConnectWalletDialogProps) {
  const { wallets = [] } = useWallet();

  const { availableWallets, installableWallets } = groupAndSortWallets(wallets, walletSortingOptions);

  return (
    <DialogContent className="max-h-screen overflow-auto">
      <AboutAptosConnect renderEducationScreen={renderEducationScreen}>
        <DialogHeader>
          <DialogTitle className="flex flex-col text-center leading-snug">
            <div className="ps-6 text-xl font-semibold">Connect Wallet</div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 pt-10">
          <Typography>
            By connecting a wallet, you agree to Shabu&apos;s{" "}
            <Link
              href="/terms-of-use.txt"
              target="_blank"
              className="text-accent-foreground underline underline-offset-4"
            >
              Terms of Use
            </Link>{" "}
            and have read and understand it&apos;s{" "}
            <Link href="/risks.txt" target="_blank" className="text-accent-foreground underline underline-offset-4">
              Risks
            </Link>
            .
          </Typography>
        </div>

        <div className="flex flex-col gap-3 pt-3">
          {availableWallets.map((wallet) => (
            <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
          ))}
          {!!installableWallets.length && (
            <Collapsible className="flex flex-col gap-3">
              <CollapsibleTrigger asChild>
                <Button size="sm" variant="ghost" className="gap-2">
                  <Typography>More wallets</Typography>
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-3">
                {installableWallets.map((wallet) => (
                  <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </AboutAptosConnect>
    </DialogContent>
  );
}

interface WalletRowProps {
  wallet: any;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={onConnect}
      className="flex items-center justify-between gap-4 rounded-md bg-third px-4 py-3"
    >
      <div className="flex items-center gap-4">
        <WalletItem.Icon className="h-6 w-6" />
        <WalletItem.Name className="text-base font-normal" />
      </div>
      {isInstallRequired(wallet) ? (
        <Button variant="secondary" asChild>
          <WalletItem.InstallLink />
        </Button>
      ) : (
        <WalletItem.ConnectButton asChild>
          <Button>Connect</Button>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}

function renderEducationScreen(screen: AboutAptosConnectEducationScreen) {
  return (
    <>
      <DialogHeader className="grid grid-cols-[1fr_4fr_1fr] items-center space-y-0">
        <Button variant="ghost" size="icon" onClick={screen.cancel}>
          <ArrowLeft />
        </Button>
        <DialogTitle className="text-center text-base leading-snug">
          <Typography>About Aptos Connect</Typography>
        </DialogTitle>
      </DialogHeader>

      <div className="mt-14 flex h-[162px] items-end justify-center pb-3">
        <screen.Graphic />
      </div>
      <div className="flex flex-col gap-2 pb-4 text-center">
        <screen.Title className="text-xl" />
        <screen.Description className="text-sm text-muted-foreground [&>a]:text-accent-foreground [&>a]:underline [&>a]:underline-offset-4" />
      </div>

      <div className="grid grid-cols-3 items-center">
        <Button size="sm" variant="ghost" onClick={screen.back} className="justify-self-start">
          <Typography>Back</Typography>
        </Button>
        <div className="flex items-center gap-2 place-self-center">
          {screen.screenIndicators.map((ScreenIndicator, i) => (
            <ScreenIndicator key={i} className="py-4">
              <div className="h-0.5 w-6 bg-third transition-colors [[data-active]>&]:bg-primary" />
            </ScreenIndicator>
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={screen.next} className="gap-2 justify-self-end">
          {screen.screenIndex === screen.totalScreens - 1 ? "Finish" : "Next"}
          <ArrowRight size={16} />
        </Button>
      </div>
    </>
  );
}
