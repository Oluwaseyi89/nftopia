import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RpcProvider, Account, Contract, CallData } from 'starknet';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StarknetService {
  private provider: RpcProvider;
  private account: Account;
  private contract: Contract;

  constructor() {
    this.provider = new RpcProvider({ nodeUrl: process.env.STARKNET_RPC_URL });
    this.account = new Account(
      this.provider,
      process.env.STARKNET_ACCOUNT_ADDRESS,
      process.env.STARKNET_PRIVATE_KEY,
      '1' 
    );

    const contractClassPath = path.resolve(
      __dirname,
      '..',
      '..',
      'src',
      'starknet',
      'abis',
      'nftopia_CollectionFactory.contract_class.json'
    );

    const contractClass = JSON.parse(fs.readFileSync(contractClassPath, 'utf-8'));
    const abi = contractClass.abi;

    this.contract = new Contract(
      abi,
      process.env.COLLECTION_FACTORY_CONTRACT_ADDRESS,
      this.account
    );
  }

  async mint(to: string, tokenId: string, tokenUri: string) {
    try {
      const callData = CallData.compile({
        to,
        token_id: tokenId,
        uri: tokenUri,
      });

      const res = await this.account.execute({
        contractAddress: this.contract.address,
        entrypoint: 'mint',
        calldata: callData,
      });

      return res;
    } catch (err) {
      console.error('Starknet mint error:', err);
      throw new InternalServerErrorException('Minting on Starknet failed');
    }
  }

  async getOwnerOf(tokenId: string) {
    try {
      const result = await this.contract.call('owner_of', [tokenId]);
      return result;
    } catch (err) {
      console.error('Starknet read error:', err);
      throw new InternalServerErrorException('Read from Starknet failed');
    }
  }
}




// // src/starknet/starknet.service.ts
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Provider, Account, Contract, json, CallData } from 'starknet';

// @Injectable()
// export class StarknetService {
//   private provider: Provider;
//   private factoryContract: Contract;
//   private factoryAddress = '0x02668a6d3f3bcb3222cf7afd54c0133a18b2f53b510d4e5a347f3721e15d9f31';

//   constructor(private configService: ConfigService) {
//     this.initialize();
//   }

//   private async initialize() {
//     this.provider = new Provider({
//       sequencer: {
//         network: 'sepolia',
//         baseUrl: this.configService.get<string>('STARKNET_SEPOLIA_RPC'),
//       }
//     });

//     // Load the raw ABI (you'll need to import or fetch this)
//     const factoryAbi = await this.getFactoryAbi();
    
//     this.factoryContract = new Contract(
//       factoryAbi,
//       this.factoryAddress,
//       this.provider
//     );
//   }

//   private async getFactoryAbi() {
//     // You can either:
//     // 1. Import it directly if you have the JSON file
//     // 2. Fetch it from a block explorer API
//     // Example for option 1:
//     return json.parse(
//       fs.readFileSync('./path/to/CollectionFactory_abi.json').toString('ascii')
//     );
//   }

//   async createUserCollection(signedTx: string): Promise<{ txHash: string, collectionAddress: string }> {
//     try {
//       // Submit the user-signed transaction
//       const txResponse = await this.provider.sendTransaction(signedTx);
      
//       // Wait for transaction acceptance
//       await this.provider.waitForTransaction(txResponse.transaction_hash);
      
//       // Get transaction receipt to parse events
//       const receipt = await this.provider.getTransactionReceipt(txResponse.transaction_hash);
      
//       // Find the CollectionCreated event
//       const event = receipt.events.find(e => 
//         e.keys[0] === '0x...' // Replace with your event key from ABI
//       );
      
//       if (!event) {
//         throw new Error('Collection creation event not found');
//       }
      
//       // The collection address is in the event data
//       const collectionAddress = event.data[1]; // Adjust index based on your event
      
//       return {
//         txHash: txResponse.transaction_hash,
//         collectionAddress: collectionAddress
//       };
//     } catch (error) {
//       throw new Error(`Failed to create collection: ${error.message}`);
//     }
//   }
// }


// src/starknet/starknet.controller.ts
// import { Controller, Post, Body } from '@nestjs/common';
// import { StarknetService } from './starknet.service';

// @Controller('collections')
// export class StarknetController {
//   constructor(private readonly starknetService: StarknetService) {}

//   @Post('create')
//   async createCollection(@Body('signedTx') signedTx: string) {
//     return this.starknetService.createUserCollection(signedTx);
//   }
// }





//////Backend sponsored transactions
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Provider, Contract, Account, json, uint256 } from 'starknet';
// import * as fs from 'fs';

// @Injectable()
// export class ContractService {
//   private provider: Provider;
//   private contract: Contract;
//   private account: Account;

//   constructor(private configService: ConfigService) {
//     this.initialize();
//   }

//   private async initialize() {
//     this.provider = new Provider({
//       sequencer: {
//         network: 'sepolia',
//         baseUrl: this.configService.get<string>('SEPOLIA_RPC_URL'),
//       }
//     });

//     this.account = new Account(
//       this.provider,
//       this.configService.get<string>('WALLET_ADDRESS'),
//       this.configService.get<string>('PRIVATE_KEY')
//     );

//     const contractAddress = this.configService.get<string>('COLLECTION_FACTORY_ADDRESS');
//     const compiledContract = await json.parse(
//       fs.readFileSync('./path/to/CollectionFactory_abi.json').toString('ascii')
//     );

//     this.contract = new Contract(
//       compiledContract.abi,
//       contractAddress,
//       this.provider
//     );
//     this.contract.connect(this.account);
//   }

//   // New method to create collection
//   async createCollection(): Promise<{ txHash: string, collectionAddress: string }> {
//     try {
//       // Execute the create_collection function
//       const tx = await this.contract.invoke('create_collection', []);
      
//       // Wait for transaction to be accepted
//       await this.provider.waitForTransaction(tx.transaction_hash);
      
//       // Get the transaction receipt to find emitted events
//       const receipt = await this.provider.getTransactionReceipt(tx.transaction_hash);
      
//       // Find the CollectionCreated event
//       const event = receipt.events.find(e => 
//         e.keys[0] === '0x...' // Replace with your event key
//       );
      
//       if (!event) {
//         throw new Error('Collection creation event not found');
//       }
      
//       // The collection address is in the event data
//       const collectionAddress = event.data[1]; // Adjust index based on your event structure
      
//       return {
//         txHash: tx.transaction_hash,
//         collectionAddress: collectionAddress
//       };
//     } catch (error) {
//       throw new Error(`Failed to create collection: ${error.message}`);
//     }
//   }

//   // Add other contract interaction methods as needed...
// }





//// User sponsored Txn backend strucure
// src/transaction/transaction.service.ts
// import { Injectable } from '@nestjs/common';
// import { Provider, Account, Contract } from 'starknet';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class TransactionService {
//   private provider: Provider;

//   constructor(private configService: ConfigService) {
//     this.provider = new Provider({
//       sequencer: {
//         network: 'mainnet', // or 'sepolia'
//       },
//     });
//   }

//   async relayUserTransaction(signedTx: string) {
//     try {
//       // Submit to StarkNet (no private key needed!)
//       const txResponse = await this.provider.sendTransaction(signedTx);
      
//       // Optional: Wait for acceptance
//       await this.provider.waitForTransaction(txResponse.transaction_hash);
      
//       return {
//         txHash: txResponse.transaction_hash,
//       };
//     } catch (error) {
//       throw new Error(`Transaction failed: ${error.message}`);
//     }
//   }
// }

///Backend Controller class
// src/transaction/transaction.controller.ts
// import { Body, Controller, Post } from '@nestjs/common';
// import { TransactionService } from './transaction.service';

// @Controller('transactions')
// export class TransactionController {
//   constructor(private readonly txService: TransactionService) {}

//   @Post('relay')
//   async relayTransaction(@Body('signedTx') signedTx: string) {
//     return this.txService.relayUserTransaction(signedTx);
//   }
// }


/////User sponsored Txn Frontend structure
// frontend/src/services/starknet.ts
// import { Contract, Provider, Account } from 'starknet';

// export const createCollection = async (userAccount: Account) => {
//   const factoryAddress = '0x123...'; // Your factory address
  
//   const call = {
//     contractAddress: factoryAddress,
//     entrypoint: 'create_collection',
//     calldata: [], // Add args if needed
//   };

//   // User signs with THEIR wallet
//   const signedTx = await userAccount.signTransaction(call);
  
//   // Send to backend
//   const response = await fetch('/api/transactions/relay', {
//     method: 'POST',
//     body: JSON.stringify({ signedTx }),
//   });
  
//   return response.json();
// };

// frontend/src/components/WalletConnector.tsx
// import { useStarknet } from '@starknet-react/core';

// function WalletButton() {
//   const { connect, connectors } = useStarknet();

//   return (
//     <button onClick={() => connect(connectors[0])}>
//       Connect Wallet
//     </button>
//   );
// }


// use starknet::syscalls::deploy_syscall;

// let (contract_address, _) = deploy_syscall(
//     class_hash,  // Class hash of the contract to deploy
//     salt,        // Unique salt for address determinism
//     calldata,    // Constructor arguments
//     false        // Not deployable by anyone
// ).expect('Deployment failed');

// use array::ArrayTrait;

// let (address, _) = deploy_syscall(
//     class_hash,
//     salt,
//     array![].span(),  // Empty calldata
//     false
// ).expect("Deployment failed");
