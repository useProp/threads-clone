<template>
  <div class="bg-black fixed w-[calc(100%+1px)] h-full">
    <VitePwaManifest />

    <NuxtPage />

    <CreatePost
      :class="[
          {'max-h-[100vh] transition-all duration-200 ease-out visible': userStore.isMenuOverlay},
          {'max-h-0 transition-all duration-200 ease-out invisible': !userStore.isMenuOverlay},
      ]"
    />

    <Modal
        :class="[
          {'max-h-[100vh] transition-all duration-200 ease-out visible': userStore.isLogoutOverlay},
          {'max-h-0 transition-all duration-200 ease-out invisible': !userStore.isLogoutOverlay},
      ]"
    />
  </div>
</template>

<script setup>
  import { useUserStore } from '~/stores/user.js';
  const userStore = useUserStore();
</script>
