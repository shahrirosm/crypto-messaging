import { ethers } from "ethers";

export async function sendTransactionWithMetaMask(
  ciphertext: string,
  value: string,
  recipientAddress: string,
): Promise<string> {
  console.log('htee')
  if (typeof window.ethereum !== 'undefined') {
    console.log('ethh')
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Ensure the user is on Sepolia network
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(11155111)) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
      }
      // const recipientAddress = '0x2929225d38de0837d8368BB7AB42D5Cc73900C28'
      if (!ciphertext.startsWith("0x")) {
        ciphertext = "0x" + ciphertext;
      }

      const estimatedGas = await provider.estimateGas({
        to: recipientAddress,
        data: ciphertext,
      });

      console.log("Estimated Gas:", estimatedGas.toString());

      const tx = {
        to: recipientAddress,
        value: ethers.parseEther("0.0"),
        gasLimit: estimatedGas,
        gas: 21000,
        data: ciphertext,
      }

      const txResponse = await signer.sendTransaction(tx);
      console.log("Transaction sent:", txResponse);

      const receipt = await txResponse.wait();
      console.log("Transaction confirmed:", receipt);

      return txResponse.hash;
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw error
    }
  } else {
    throw new Error('MetaMask is not detected in the browser.')
  }
}
