import { ethers } from 'ethers'

export async function sendTransactionWithMetaMask(
  publicKey: string,
  amount: string,
  recipientAddress: string,
): Promise<ethers.TransactionResponse> {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const network = await provider.getNetwork()
      if (network.chainId !== BigInt(11155111)) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        })
      }

      if (!publicKey.startsWith('0x')) {
        publicKey = '0x' + publicKey
      }

      const estimatedGas = await provider.estimateGas({
        to: recipientAddress,
        data: publicKey,
      })

      const tx = {
        to: recipientAddress,
        value: ethers.parseEther(amount.toString()),
        gasLimit: estimatedGas,
        gas: 21000,
        data: publicKey,
      }

      const txResponse = await signer.sendTransaction(tx)

      return txResponse
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw error
    }
  } else {
    throw new Error('MetaMask is not detected in the browser.')
  }
}

export async function getTransactionConfirmation(
  transactionHash: string,
): Promise<ethers.TransactionReceipt | null> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not detected in the browser.')
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const receipt = await provider.waitForTransaction(transactionHash)
    return receipt
  } catch (error) {
    console.error('Error getting transaction confirmation:', error)
    throw error
  }
}
