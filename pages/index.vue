<script setup>
  import MainLayout from '~/layouts/MainLayout.vue';
  import { useUserStore} from '~/stores/user.js';

  const userStore = useUserStore();
  const user = useSupabaseUser();

  const posts = ref([]);
  const isPosts = ref(false);
  const isLoading = ref(false);

  const onDeleted = async () => {
    posts.value = await userStore.getAllPosts();
  }

  watchEffect(() => {
    if (!user?.value) {
      return navigateTo('/auth');
    }
  });

  onBeforeMount(async () => {
   try {
     isLoading.value = true;
     await userStore.getAllPosts();
   } catch (e) {
     console.log(e);
   } finally {
     isLoading.value = false;
   }
  });

  onMounted(() => {
    watchEffect(() => {
      posts.value = userStore.posts;
      if (userStore?.posts?.length > 0) {
        isPosts.value = true;
      }
    });
  });

  watch(() => posts.value, () => {
    posts.value = userStore.posts;
    if (userStore?.posts?.length > 0) {
      isPosts.value = true;
    }
  }, { deep: true });
</script>

<template>
  <MainLayout>
    <div id="IndexPage" class="w-full overflow-auto">
      <div class="mx-auto min-w-[500px] overflow-hidden">
        <div id="Posts" class="px-4 max-w-[600px] mx-auto">

          <div  class="text-white" v-if="isPosts" v-for="post in posts" :key="post">
            <Post :post="post" @isDeleted="onDeleted" />
          </div>
          <div v-else>
            <client-only>
              <div v-if="isLoading" class="flex items-center justify-center mt-20 w-full mx-auto">
                <div class="flex flex-col items-center justify-center text-white mx-auto">
                  <Icon
                    name="eos-icons:bubble-loading"
                    size="50"
                    style="color: white"
                  />
                  <div class="w-full mt-1">Loading...</div>
                </div>
              </div>
              <div v-else class="flex items-center justify-center mt-20 w-full mx-auto">
                <div class="flex flex-col items-center justify-center text-white mx-auto">
                  <Icon
                      name="tabler:mood-empty"
                      size="50"
                      style="color: white"
                  />
                  <div class="w-full mt-1">Make the first post!</div>
                </div>
              </div>
            </client-only>
          </div>

        </div>
      </div>
    </div>
  </MainLayout>
</template>