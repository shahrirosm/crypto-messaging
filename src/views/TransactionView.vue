<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Send, CheckCircle, XCircle, Loader2, CircleAlert } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { useTransactionStore } from '@/stores/transaction'

const store = useTransactionStore()
const handleSend = async () => {
  store.sendTransaction()
}
</script>

<template>
  <template v-if="store.result">
    <Alert
      v-if="store.result.status === 'confirmed'"
      variant="default"
      class="mb-4 bg-green-500 text-white"
    >
      <CheckCircle class="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{{ store.result.message }}</AlertDescription>
    </Alert>
    <Alert
      v-if="store.result.status === 'pending'"
      variant="default"
      class="mb-4 bg-yellow-500 text-white"
    >
      <CircleAlert class="h-4 w-4" />
      <AlertTitle>Transaction Pending</AlertTitle>
      <AlertDescription>{{ store.result.message }}</AlertDescription>
    </Alert>
    <Alert v-if="store.result.status === 'error'" class="mb-4 bg-red-500 text-white">
      <XCircle class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ store.result.message }}</AlertDescription>
    </Alert>
  </template>
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
          v-model="store.ethAmount"
          placeholder="Enter ETH amount"
          type="number"
          step="0.0001"
        />
      </div>
      <div class="space-y-2">
        <label for="send-ciphertext" class="text-sm font-medium">Public Key</label>
        <Input
          id="send-public-key"
          v-model="store.publicKey"
          placeholder="Enter the generated public key"
        />
      </div>
      <div class="space-y-2">
        <label for="send-recipient-address" class="text-sm font-medium">Recipient Address</label>
        <Input
          id="send-recipient-address"
          v-model="store.recipientAddress"
          placeholder="Enter the recipient's Ethereum address"
        />
      </div>
      <Button class="w-full" @click="handleSend" :disabled="store.loading">
        <template v-if="store.loading">
          <Loader2 class="h-4 w-4 mr-2 animate-spin" />
          Sending...
        </template>
        <template v-else>
          <Send class="h-4 w-4 mr-2" />
          Send Encrypted Message
        </template>
      </Button>
      <div v-if="store.transactionHash" class="mt-4 p-4 bg-muted rounded-md">
        <div class="mb-2">
          <h2 class="text-sm font-medium">Network</h2>
          <p class="text-sm break-all">Sepolia</p>
        </div>
        <div class="mb-2">
          <h3 class="text-sm font-medium">
            Transaction Hash
            <span v-if="!store.isConfirmed" class="text-yellow-500">(Pending)</span>
          </h3>
          <p class="text-sm break-all">{{ store.transactionHash }}</p>
        </div>
        <div class="mb-2">
          <h3 class="text-sm font-medium">Recipient Address</h3>
          <p class="text-sm break-all">{{ store.transactionRecipient }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
