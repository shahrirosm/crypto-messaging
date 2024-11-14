<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { Sun, Moon } from 'lucide-vue-next'

import { useDark, useToggle } from '@vueuse/core'
import EncryptionView from './views/EncryptionView.vue'
import TransactionView from './views/TransactionView.vue'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)
</script>

<template>
  <div class="min-h-screen bg-background p-4">
    <div class="mx-auto max-w-4xl">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Crypto Messaging</h1>
        <Button variant="ghost" size="icon" @click="toggleDark()" class="rounded-full">
          <Sun v-if="isDark" class="h-8 w-8" />
          <Moon v-else class="h-8 w-8" />
        </Button>
      </div>

      <Tabs default-value="encrypt" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
        </TabsList>
        <TabsContent value="encrypt">
          <EncryptionView />
        </TabsContent>
        <TabsContent value="send">
          <TransactionView />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

