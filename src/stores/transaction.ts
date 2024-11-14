import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  sendTransactionWithMetaMask,
  getTransactionConfirmation,
} from '@/services/transactionService'

export const useTransactionStore = defineStore('transaction', () => {
  const result = ref<{ result: boolean; message: string; status: string } | null>(null)
  const publicKey = ref('')
  const ethAmount = ref('')
  const recipientAddress = ref('')
  const transactionHash = ref('')
  const transactionRecipient = ref<string | null>(null)
  const loading = ref(false)
  const isConfirmed = ref(false)

  const sendTransaction = async () => {
    loading.value = true
    try {
      if (
        !publicKey.value ||
        ethAmount.value === '' ||
        isNaN(Number(ethAmount.value)) ||
        !recipientAddress.value
      ) {
        throw new Error('Invalid input parameters')
      }

      const txResponse = await sendTransactionWithMetaMask(
        publicKey.value,
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

      if (receipt) {
        isConfirmed.value = true
      }

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
    publicKey.value = ''
    ethAmount.value = ''
    recipientAddress.value = ''
    transactionRecipient.value = ''
  }

  return {
    result,
    transactionHash,
    loading,
    sendTransaction,
    reset,
    publicKey,
    ethAmount,
    recipientAddress,
    isConfirmed,
    transactionRecipient,
  }
})
