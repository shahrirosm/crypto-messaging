<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Sun, Moon, CheckCircle, Copy, Send, XCircle, LockKeyhole } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toast'
import { Badge } from './components/ui/badge'

import { encryptMessage } from '@/services/encryptionService'
import type { EncryptedMessage } from '@/services/encryptionService'
import { sendTransactionWithMetaMask } from '@/services/transactionService'
import { useDark, useToggle } from '@vueuse/core'

const { toast } = useToast()
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)
const jsonMessage = ref('')

const result = ref<{ result: boolean; message: string } | null>(null)
const jsonError = ref('')

const recipientPublicKeyHex = ref<string>('')
const encryptionResult = ref<EncryptedMessage | null>(null)

const ciphertext = ref('')
const ethAmount = ref('')
const recipientAddress = ref('')
const transactionHash = ref('')

const validateJSON = () => {
  try {
    JSON.parse(jsonMessage.value)
    jsonError.value = ''
  } catch (error) {
    jsonError.value = 'Invalid JSON format'
  }
}
const handleEncrypt = async () => {
  if (jsonError.value) {
    result.value = {
      result: false,
      message: 'Please fix the JSON format before encrypting.',
    }
    return
  }

  try {
    if (jsonMessage.value && recipientPublicKeyHex.value) {
      encryptionResult.value = await encryptMessage(jsonMessage.value, recipientPublicKeyHex.value)
      console.log('here')
      if (encryptionResult.value) {
        result.value = {
          result: true,
          message: 'Your message has been successfully encrypted.',
        }
      }
    }
  } catch (error) {
    result.value = {
      result: false,
      message: `Encryption error: ${error}`,
    }
  }
}

const resetForm = () => {
  encryptionResult.value = null
  jsonMessage.value = ''
  recipientPublicKeyHex.value = ''
  result.value = null
}

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: `${label} has been copied to clipboard.`,
    })
  } catch (error) {
    toast({
      title: 'Failed to copy',
      description: 'Please try again.',
      variant: 'destructive',
    })
  }
}

const handleSend = async () => {
  try {
    console.log('hare')
    if (ciphertext.value && ethAmount.value && recipientAddress.value) {
      console.log(ciphertext.value)
      console.log(ethAmount.value)
      console.log(recipientAddress.value)
      transactionHash.value = await sendTransactionWithMetaMask(
        ciphertext.value,
        ethAmount.value,
        recipientAddress.value,
      )
    }else{
      console.log('asdasdfga')
      console.log(ciphertext.value)
      console.log(ethAmount.value)
      console.log(recipientAddress.value)
    }
    if (transactionHash.value) {
      toast({
        title: 'Transaction Sent',
        description: `Transaction hash: ${transactionHash.value}`,
      })
    }
  } catch (error) {
    result.value = {
      result: false,
      message: `Transaction error: ${error}`,
    }
  }
}
</script>

<template>
  <Toaster />
  <div class="min-h-screen bg-background p-4">
    <div class="mx-auto max-w-4xl">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Crypto Messaging</h1>
        <Button variant="ghost" size="icon" @click="toggleDark()" class="rounded-full">
          <Sun v-if="isDark" class="h-8 w-8" />
          <Moon v-else class="h-8 w-8" />
        </Button>
      </div>
      <template v-if="result">
        <Alert v-if="result.result" variant="default" class="mb-4 bg-green-500 text-white">
          <CheckCircle class="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{{ result.message }}</AlertDescription>
        </Alert>
        <Alert v-else variant="destructive" class="mb-4 bg-red-500 text-white">
          <XCircle class="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{{ result.message }}</AlertDescription>
        </Alert>
      </template>
      <Tabs default-value="encrypt" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
        </TabsList>
        <TabsContent value="encrypt">
          <Card>
            <CardHeader>
              <CardTitle>Encrypt JSON Message</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <template v-if="!encryptionResult">
                <div class="space-y-2">
                  <label for="json" class="text-sm font-medium">JSON Message</label>
                  <Textarea
                    id="json"
                    v-model="jsonMessage"
                    placeholder="Enter your JSON message here"
                    class="min-h-[200px]"
                    @input="validateJSON"
                  />
                  <div v-if="jsonError" class="text-red-500 text-sm">
                    {{ jsonError }}
                  </div>
                </div>
                <div class="space-y-2">
                  <label for="recipient-key" class="text-sm font-medium"
                    >Recipient's public key</label
                  >
                  <Input
                    id="recipient-key"
                    v-model="recipientPublicKeyHex"
                    placeholder="Enter recipient's public key"
                  />
                </div>
                <Button class="w-full" @click="handleEncrypt" :disabled="!!jsonError">
                  <LockKeyhole class="h-4 w-4" />
                  Encrypt
                </Button>
              </template>
              <template v-else>
                <div class="space-y-2">
                  <label for="ciphertext" class="text-sm font-medium">Ciphertext</label>
                  <div class="relative">
                    <Textarea
                      id="ciphertext"
                      :model-value="encryptionResult.ciphertext"
                      readonly
                      class="min-h-[100px] bg-muted pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      class="absolute right-2 top-2"
                      @click="copyToClipboard(encryptionResult.ciphertext, 'Ciphertext')"
                    >
                      <Copy class="h-4 w-4" />
                      <span class="sr-only">Copy ciphertext</span>
                    </Button>
                  </div>
                </div>
                <div class="space-y-2">
                  <label for="public-key" class="text-sm font-medium">Public Key</label>
                  <div class="relative">
                    <Input
                      id="public-key"
                      :model-value="encryptionResult.publicKey"
                      readonly
                      class="bg-muted pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      class="absolute right-2 top-1/2 -translate-y-1/2"
                      @click="copyToClipboard(encryptionResult.publicKey, 'Public Key')"
                    >
                      <Copy class="h-4 w-4" />
                      <span class="sr-only">Copy public key</span>
                    </Button>
                  </div>
                </div>
                <div class="space-y-2">
                  <label for="nonce" class="text-sm font-medium">Nonce</label>
                  <div class="relative">
                    <Input
                      id="nonce"
                      :model-value="encryptionResult.nonce"
                      readonly
                      class="bg-muted pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      class="absolute right-2 top-1/2 -translate-y-1/2"
                      @click="copyToClipboard(encryptionResult.nonce, 'Nonce')"
                    >
                      <Copy class="h-4 w-4" />
                      <span class="sr-only">Copy nonce</span>
                    </Button>
                  </div>
                </div>

                <Button class="w-full" @click="resetForm">
                  <LockKeyhole class="h-4 w-4" />
                  Encrypt New Message
                </Button>
              </template>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center justify-between">
                Send Encrypted Message
                <Badge variant="secondary" class="ml-2">Sepolia Network</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <label for="send-eth-amount" class="text-sm font-medium">ETH Amount</label>
                <Input
                  id="send-eth-amount"
                  v-model="ethAmount"
                  placeholder="Enter ETH amount"
                  type="number"
                  step="0.0001"
                  min="0"
                />
              </div>
              <div class="space-y-2">
                <label for="send-ciphertext" class="text-sm font-medium">Ciphertext</label>
                <Textarea
                  id="send-ciphertext"
                  v-model="ciphertext"
                  placeholder="Enter the ciphertext"
                  class="min-h-[100px]"
                />
              </div>
              <div class="space-y-2">
                <label for="send-recipient-address" class="text-sm font-medium"
                  >Recipient Address</label
                >
                <Input
                  id="send-recipient-address"
                  v-model="recipientAddress"
                  placeholder="Enter the recipient's Ethereum address"
                />
              </div>
              <Button class="w-full" @click="handleSend">
                <Send class="h-4 w-4" />
                Send Encrypted Message
              </Button>
              <div v-if="transactionHash" class="mt-4 p-4 bg-muted rounded-md">
                <h3 class="text-sm font-medium mb-2">Transaction Hash:</h3>
                <p class="text-xs break-all">{{ transactionHash }}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
