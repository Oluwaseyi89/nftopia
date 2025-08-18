// "use client";

// import {
//   useConnect,
//   useAccount,
//   useDisconnect,
//   Connector,
// } from "@starknet-react/core";
// import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
// import { useTranslation } from "@/hooks/useTranslation";

// export default function ConnectWallet() {
//   const { t } = useTranslation();
//   const { connect, connectors } = useConnect();
//   const { address } = useAccount();
//   const { disconnect } = useDisconnect();

//   const { starknetkitConnectModal } = useStarknetkitConnectModal({
//     connectors: connectors as StarknetkitConnector[],
//   });

//   async function connectWallet() {
//     const { connector } = await starknetkitConnectModal();
//     if (!connector) {
//       return;
//     }
//     await connect({ connector: connector as Connector });
//   }
//   if (!address) {
//     return (
//       <button
//         onClick={connectWallet}
//         className=" hidden xl:block rounded-full px-6 py-2 bg-gradient-to-r from-[#4e3bff] to-[#9747ff] text-white hover:opacity-90"
//       >
//         {t("connectWallet.connect")}
//       </button>
//     );
//   }

//   return (
//     <div className="flex gap-2">
//       <div className="p-2 bg-[#4e3bff] rounded-lg ">
//         {t("connectWallet.connected")}: {address?.slice(0, 6)}...
//         {address?.slice(-4)}
//       </div>
//       <button
//         onClick={() => disconnect()}
//         className=" lg:block rounded-full px-6 py-2 bg-gradient-to-r from-[#4e3bff] to-[#9747ff] text-white hover:opacity-90"
//       >
//         {t("connectWallet.disconnect")}
//       </button>
//     </div>
//   );
// }

"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useWalletStore } from "@/lib/stores/use-wallet-store"; // ✅ new hook

export default function ConnectWallet() {
  const { t } = useTranslation();
  const { address, connectWallet, disconnectWallet } = useWalletStore();

  if (!address) {
    return (
      <button
        onClick={connectWallet}
        className="block rounded-full px-6 py-2 bg-gradient-to-r from-[#4e3bff] to-[#9747ff] 
                   text-white hover:opacity-90 text-sm sm:text-base w-full sm:w-auto"
      >
        {t("connectWallet.connect")}
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <div className="p-2 bg-[#4e3bff] rounded-lg text-white text-sm sm:text-base truncate max-w-[200px]">
        {t("connectWallet.connected")}: {address.slice(0, 6)}...
        {address.slice(-4)}
      </div>
      <button
        onClick={disconnectWallet}
        className="block rounded-full px-6 py-2 bg-gradient-to-r from-[#4e3bff] to-[#9747ff] 
                   text-white hover:opacity-90 text-sm sm:text-base w-full sm:w-auto"
      >
        {t("connectWallet.disconnect")}
      </button>
    </div>
  );
}

