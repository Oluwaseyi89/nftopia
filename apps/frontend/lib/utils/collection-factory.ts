import { CallData, hash, InvokeFunctionResponse, GetTransactionReceiptResponse } from "starknet";

interface StarknetEvent {
  keys: string[];
  data: string[];
}

export const createUserCollectionOnchain = async (signer: any, contractAddress: string) => {
  try {
    // 1. Prepare call
    const call = {
      contractAddress,
      entrypoint: "create_collection",
      calldata: CallData.compile({}), // no inputs
    };

    console.log("Contract Address: ", contractAddress);
    console.log("Signer: ", signer);

    // 2. Execute tx
    const result: InvokeFunctionResponse = await signer.execute(call);

    // 3. Wait for acceptance
    await signer.provider.waitForTransaction(result.transaction_hash);

    // 4. Get receipt
    const receipt: GetTransactionReceiptResponse = await signer.provider.getTransactionReceipt(
      result.transaction_hash
    );

    if ("events" in receipt) {
      const events = receipt.events as StarknetEvent[];

      // 5. Compute selector for CollectionCreated
      const collectionCreatedSelector = hash.getSelectorFromName("CollectionCreated");

      // 6. Find event
      const event = events.find(
        (e) => e.keys[0].toLowerCase() === collectionCreatedSelector.toLowerCase()
      );

      if (!event) throw new Error("CollectionCreated event not found");

      // 7. Decode event (from ABI we know [creator, collection])
      const creator = event.data[0];
      const collectionAddress = event.data[1];

      return {
        txHash: result.transaction_hash,
        creator,
        collectionAddress,
      };
    }

    throw new Error("Transaction accepted but no events found");
  } catch (error) {
    console.error("Collection creation failed:", error);
    throw error;
  }
};

