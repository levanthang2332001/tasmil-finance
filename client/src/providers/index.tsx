import { AptosProviders } from "./aptos";
import { ReactQueryClientProvider } from "./querry-provider";
import SuiProviders from "./sui";

// type WalletType = "sui" | "aptos";

// export function WalletAptosSuiProviders({
//   children,
//   walletType = "aptos"
// }: {
//   children: React.ReactNode;
//   walletType?: WalletType;
// }) {
//   if (walletType === "aptos") {
//     return (
//     <ReactQueryClientProvider>
//       <AptosProviders>{children}</AptosProviders>
//     </ReactQueryClientProvider>
//   );
//   } else if (walletType === "sui") {
//     return (
//       <ReactQueryClientProvider>
//         <SuiProviders>{children}</SuiProviders>
//       </ReactQueryClientProvider>
//     );
//   }
// }


export function WalletAptosSuiProviders({
  children
}: {
  children: React.ReactNode;
}) {
    return (
    <ReactQueryClientProvider>
      <AptosProviders>
        <SuiProviders>{children}</SuiProviders>
      </AptosProviders>
    </ReactQueryClientProvider>
  );
  
}