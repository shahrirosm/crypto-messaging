<template>
  <div class="space-y-4 p-6">
    <Card>
      <CardHeader>
        <CardTitle>Send Transaction via MetaMask</CardTitle>
        <CardDescription>Enter your JSON message to encrypt</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="jsonMessage">Encrypted Message (Ciphertext):</Label>
            <Textarea
              id="jsonMessage"
              v-model="ciphertext"
              rows="5"
              placeholder="Enter your ciphertext here"
            />
          </div>
          <div>
            <Label for="value">Amount in ETH:</Label>
            <Input
              v-model.number="value"
              id="value"
              type="number"
              placeholder="Enter amount in ETH"
            />
          </div>
          <div>
            <Label for="value">Recipient Address:</Label>
            <Input
              v-model="recipientAddress"
              id="recipientAddress"
              placeholder="Enter recipient address"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex flex-row justify-end">
        <Button variant="default" class="w-full"> Send Transaction </Button>
      </CardFooter>
    </Card>
    <div v-if="!transactionHash" class="mt-4 p-4 bg-green-100 rounded-md">
      <p class="text-green-800 font-semibold">Transaction sent successfully!</p>
      <p class="text-sm break-all"><strong>Hash:</strong> asdd</p>
    </div>

    <div v-if="error" class="mt-4 p-4 bg-red-100 rounded-md">
      <p class="text-red-800 font-semibold">Error:</p>
      <p class="text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { sendTransactionWithMetaMask } from 'src/services/transactionService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const ciphertext = ref<string>('')
const value = ref<number>(0.01) // Default value of 0.01 ETH
const recipientAddress = ref<string>('0x2929225d38de0837d8368BB7AB42D5Cc73900C28') // Default recipient address
const transactionHash = ref<string | null>(null)
const error = ref<string | null>(null)
</script>
