<script lang="ts" setup>
import { AppSetup } from './utils/app'
AppSetup()
const locale = useState<string>('locale.setting')

useHead({
  title: 'ForeStage',
  titleTemplate: '%s - ForeStage',
})
</script>

<template>
  <Html :lang="locale">
    <Body class="relative bg-hd-white text-hd-dark antialiased transition-colors duration-300">
      <NuxtLayout>
        <NuxtLoadingIndicator :height="5" :duration="3000" :throttle="400" />
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>
