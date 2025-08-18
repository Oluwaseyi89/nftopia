import { CallData, InvokeFunctionResponse, GetTransactionReceiptResponse } from "starknet";

interface StarknetEvent {
  keys: string[];
  data: string[];
}

export const createUserCollection = async (signer: any) => {
  try {
    const call = {
      contractAddress: "0x02668a6d3f3bcb3222cf7afd54c0133a18b2f53b510d4e5a347f3721e15d9f31",
      entrypoint: "create_collection",
      calldata: CallData.compile({}),
    };

    const result: InvokeFunctionResponse = await signer.execute(call);

    await signer.provider.waitForTransaction(result.transaction_hash);

    const receipt: GetTransactionReceiptResponse = await signer.provider.getTransactionReceipt(
      result.transaction_hash
    );

    // Narrow type → we only care about Accepted receipts
    if ("events" in receipt) {
      const events = receipt.events as StarknetEvent[];

      const event = events.find(
        (e) => e.keys[0].toLowerCase() === "0x..." // replace with event selector
      );

      if (!event) throw new Error("Collection creation event not found");

      return {
        txHash: result.transaction_hash,
        collectionAddress: event.data[1],
      };
    }

    throw new Error("Transaction was not accepted, no events found");
  } catch (error) {
    console.error("Collection creation failed:", error);
    throw error;
  }
};

