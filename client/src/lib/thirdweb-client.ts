import { createThirdwebClient, ThirdwebClient } from "thirdweb";

export const client: ThirdwebClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY || "",
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

