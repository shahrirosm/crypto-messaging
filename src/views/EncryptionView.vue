<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast, Toaster } from '@/components/ui/toast'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, LockKeyhole, Copy } from 'lucide-vue-next'
import { useEncryptionStore } from '@/stores/encryption'

const store = useEncryptionStore()
const { toast } = useToast()

const validateJSON = () => {
  store.validateJSON(store.jsonMessage)
}

const handleEncrypt = () => {
  store.encrypt()
}

const resetForm = () => {
  store.reset()
}

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: `${label} has been copied to clipboard.`,
    })
  } catch (error) {
    console.error(error)
    toast({
      title: 'Failed to copy',
      description: 'Please try again.',
      variant: 'destructive',
    })
  }
}
</script>

<template>
  <Toaster/>
  <template v-if="store.result">
    <Alert v-if="store.result.result" variant="default" class="mb-4 bg-green-500 text-white">
      <CheckCircle class="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{{ store.result.message }}</AlertDescription>
    </Alert>
    <Alert v-else variant="destructive" class="mb-4 bg-red-500 text-white">
      <XCircle class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ store.result.message }}</AlertDescription>
    </Alert>
  </template>
  <Card>
    <CardHeader>
      <CardTitle>Encrypt JSON Message</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <template v-if="!store.encryptionResult">
        <div class="space-y-2">
          <label for="json" class="text-sm font-medium">JSON Message</label>
          <Textarea
            id="json"
            v-model="store.jsonMessage"
            placeholder="Enter your JSON message here"
            class="min-h-[200px]"
            @input="validateJSON"
          />
          <div v-if="store.jsonError" class="text-red-500 text-sm">
            {{ store.jsonError }}
          </div>
        </div>
        <div class="space-y-2">
          <label for="recipient-key" class="text-sm font-medium">Recipient's public key</label>
          <Input
            id="recipient-key"
            v-model="store.recipientPublicKeyHex"
            placeholder="Enter recipient's public key"
          />
        </div>
        <Button class="w-full" @click="handleEncrypt" :disabled="!!store.jsonError">
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
              :model-value="store.encryptionResult.ciphertext"
              readonly
              class="min-h-[100px] bg-muted pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              class="absolute right-2 top-2"
              @click="copyToClipboard(store.encryptionResult.ciphertext, 'Ciphertext')"
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
              :model-value="store.encryptionResult.publicKey"
              readonly
              class="bg-muted pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              class="absolute right-2 top-1/2 -translate-y-1/2"
              @click="copyToClipboard(store.encryptionResult.publicKey, 'Public Key')"
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
              :model-value="store.encryptionResult.nonce"
              readonly
              class="bg-muted pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              class="absolute right-2 top-1/2 -translate-y-1/2"
              @click="copyToClipboard(store.encryptionResult.nonce, 'Nonce')"
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
</template>
