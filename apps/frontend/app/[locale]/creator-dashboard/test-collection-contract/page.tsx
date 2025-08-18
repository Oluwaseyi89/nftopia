// frontend/src/components/CreateCollectionButton.tsx
import { useState } from 'react';
import { createUserCollection } from './CollectionFactory';

export default function CreateCollectionButton({ signer, walletAddress }: { 
  signer: any, 
  walletAddress: string 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateCollection = async () => {
    if (!walletAddress || !signer) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await createUserCollection(signer);
      alert(`Collection created! Address: ${result.collectionAddress}`);
      console.log('Transaction hash:', result.txHash);
    } catch (err) {
      console.error(err);
      setError("Failed to create collection");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleCreateCollection}
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create New Collection'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}



// // Example page component
// import { useState } from 'react';
// import { connect } from 'get-starknet';
// import CreateCollectionButton from '../components/CreateCollectionButton';

// export default function CollectionPage() {
//   const [signer, setSigner] = useState<any>(null);
//   const [walletAddress, setWalletAddress] = useState("");
//   const [error, setError] = useState("");

//   const connectWallet = async () => {
//     try {
//       const starknet = await connect({ modalMode: "alwaysAsk" });

//       if (!starknet?.isConnected) {
//         throw new Error("Wallet not connected");
//       }

//       const account = starknet.account;
//       setWalletAddress(account.address);
//       setSigner(account);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to connect wallet");
//     }
//   };

//   return (
//     <div>
//       {!walletAddress ? (
//         <button onClick={connectWallet}>Connect Wallet</button>
//       ) : (
//         <>
//           <p>Connected: {walletAddress}</p>
//           <CreateCollectionButton 
//             signer={signer} 
//             walletAddress={walletAddress} 
//           />
//         </>
//       )}
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// }