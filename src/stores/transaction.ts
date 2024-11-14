import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  sendTransactionWithMetaMask,
  getTransactionConfirmation,
} from '@/services/transactionService'

export const useTransactionStore = defineStore('transaction', () => {
  const result = ref<{ result: boolean; message: string; status: string } | null>(null)
  const ciphertext = ref('')
  const ethAmount = ref('')
  const recipientAddress = ref('')
  const transactionHash = ref('')
  const transactionRecipient = ref<string | null>(null)
  const loading = ref(false)
  const isConfirmed = ref(false)

  const sendTransaction = async () =>
    // ciphertext: string,
    // ethAmount: string,
    // recipientAddress: string
    {
      loading.value = true
      try {
        if (
          !ciphertext.value ||
          ethAmount.value === '' ||
          isNaN(Number(ethAmount.value)) ||
          !recipientAddress.value
        ) {
          throw new Error('Invalid input parameters')
        }

        const txResponse = await sendTransactionWithMetaMask(
          ciphertext.value,
          ethAmount.value,
          recipientAddress.value,
        )

        transactionHash.value = txResponse.hash
        transactionRecipient.value = txResponse.to

        result.value = {
          result: true,
          message: 'Transaction pending...',
          status: 'pending',
        }

        const receipt = await getTransactionConfirmation(transactionHash.value)

        console.log('Transaction confirmed:', receipt)
        isConfirmed.value = true
        result.value = {
          result: true,
          message: 'Transaction confirmed successfully',
          status: 'confirmed',
        }
      } catch (error) {
        result.value = {
          result: false,
          message: `Transaction error: ${error}`,
          status: 'error',
        }
      } finally {
        loading.value = false
      }
    }

  const reset = () => {
    result.value = null
    transactionHash.value = ''
    loading.value = false
    isConfirmed.value = false
  }

  return {
    result,
    transactionHash,
    loading,
    sendTransaction,
    reset,
    ciphertext,
    ethAmount,
    recipientAddress,
    isConfirmed,
    transactionRecipient
  }
})
