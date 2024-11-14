import { defineStore } from 'pinia'
import { ref } from 'vue'
import { encryptMessage } from '@/services/encryptionService'
import type { EncryptedMessage } from '@/services/encryptionService'

export const useEncryptionStore = defineStore('encryption', () => {
  const result = ref<{ result: boolean; message: string } | null>(null)
  const encryptionResult = ref<EncryptedMessage | null>(null)
  const loading = ref(false)
  const jsonError = ref('')
  const jsonMessage = ref('')
  const recipientPublicKeyHex = ref<string>('')

  const validateJSON = (jsonString: string): boolean => {
    try {
      console.log(jsonString)
      JSON.parse(jsonString)
      jsonError.value = ''
      return true
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      jsonError.value = 'Invalid JSON format'
      return false
    }
  }

  const encrypt = async () => {
    loading.value = true
    try {
      if (!validateJSON(jsonMessage.value)) {
        throw new Error('Invalid JSON format')
      }

      if (!jsonMessage.value || !recipientPublicKeyHex.value) {
        throw new Error('Missing required parameters')
      }

      encryptionResult.value = await encryptMessage(jsonMessage.value, recipientPublicKeyHex.value)
      result.value = {
        result: true,
        message: 'Your message has been successfully encrypted.',
      }
    } catch (error) {
      result.value = {
        result: false,
        message: `Encryption error: ${error}`,
      }
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    result.value = null
    encryptionResult.value = null
    loading.value = false
    jsonError.value = ''
    jsonMessage.value = ''
    recipientPublicKeyHex.value=''
  }

  return {
    result,
    encryptionResult,
    loading,
    jsonError,
    jsonMessage,
    recipientPublicKeyHex,
    validateJSON,
    encrypt,
    reset,
  }
})
