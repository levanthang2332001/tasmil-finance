import { Button } from "@/components/ui/button";
import { Eye, EyeOff, QrCode, Send, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import Receive from "./Receive";
import Transfer from "./Transfer";
import Withdraw from "./Withdraw";
import { useToolbar } from "@/store/useToolbar";

enum ActionType {
  TRANSFER = "transfer",
  RECEIVE = "receive",
  WITHDRAW = "withdraw",
  DEFAULT = "default",
}

const Action = () => {
  const balance = 12345.67;
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  const [type, setType] = useState<ActionType>(ActionType.DEFAULT);
  const { setIsOpen } = useToolbar();

  const ACTION_BUTTONS = [
    {
      icon: <QrCode className="size-4" />,
      label: "Receive",
      onClick: () => setType(ActionType.RECEIVE),
    },
    {
      icon: <Send className="size-4" />,
      label: "Withdraw",
      onClick: () => setType(ActionType.WITHDRAW),
    },
    {
      icon: <SlidersHorizontal className="size-4" />,
      label: "Transfer",
      onClick: () => setType(ActionType.TRANSFER),
    },
  ];

  const renderContent = () => {
    const result = {
      [ActionType.TRANSFER]: (
        <Transfer className="p-4" onClose={() => setType(ActionType.DEFAULT)} />
      ),
      [ActionType.RECEIVE]: <Receive className="p-4" onClose={() => setType(ActionType.DEFAULT)} />,
      [ActionType.WITHDRAW]: (
        <Withdraw className="p-4" onClose={() => setType(ActionType.DEFAULT)} />
      ),
      [ActionType.DEFAULT]: <Default />,
    };
    return result[type];
  };

  const Default = () => {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-1">
          <div className="text-2xl font-bold">
            $ {isBalanceVisible ? balance.toFixed(2) : "******"}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
          >
            {isBalanceVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </Button>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-muted-foreground" />
          <span className="text-sm text-muted-foreground">Ethereum</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-muted-foreground" />
          <span className="text-sm text-muted-foreground">Hyperliquid</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-5 pb-8">
          {ACTION_BUTTONS.map(({ icon, label, onClick }) => (
            <Button
              key={label}
              variant="outline"
              onClick={onClick}
              className="size-24 mx-auto bg-transparent p-2 flex text-xs flex-col items-center justify-center gap-1"
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return <div className="border-b">{renderContent()}</div>;
};

export default Action;
