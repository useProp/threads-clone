<script setup>
  import { useUserStore } from '~/stores/user.js';

  const userStore = useUserStore();

  const runtimeConfig = useRuntimeConfig();

  const isMenu = ref(false);
  const isLiking = ref(false);
  const isDeleting = ref(false);

  const emit = defineEmits(['isDeleted']);
  const props = defineProps({ post: Object });

  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const hasLikedComputed = computed(() => {
    console.log('----------------post', props.post)
    if (!user?.value) return;
    const isPostHasLikes = props.post.likes.find(l => l.userId === user.value.identities[0].user_id && l.postId === props.post.id);
    return !!isPostHasLikes;
  });

  const likesAmountTextComputed = computed(() => {
    const isPostHasLikes = props.post.likes.length > 1;
    const isPostHasZeroLikes = props.post.likes.length <= 0;
    return isPostHasLikes || isPostHasZeroLikes ? 'likes' : 'like';
  });

  const deletePost = async (id, picture) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      isDeleting.value = true;
      isMenu.value = false;
      const { data, error } = await client
          .storage
          .from('threads-clone-files')
          .remove([picture]);

      if (error) throw error;

      await useFetch(`/api/delete-post/${id}`, { method: 'delete' });
      emit('isDeleted', true);
    } catch (e) {
      console.log('deletePost', e);
    } finally {
      isDeleting.value = false;
    }
  }

  const likePost = async (postId) => {
    try {
      isLiking.value = true;
      await useFetch('/api/like-post', {
        method: 'post',
        body: {
          userId: user.value.identities[0].user_id,
          postId,
        }
      });
      await userStore.getAllPosts();
    } catch (e) {
      console.log('likePost', e);
    } finally {
      isLiking.value = false;
    }
  }

  const unlikePost = async (id) => {
    try {
      isLiking.value = true;
      await useFetch(`/api/unlike-post/${id}`, { method: 'delete' });
      await userStore.getAllPosts();
    } catch (e) {
      console.log('unlikePost', e);
    } finally {
      isLiking.value = false;
    }
  }

  const likesFn = () => {
    if (props.post.likes <= 0) {
      likePost(props.post.id);
      return;
    }

    const { id } = props.post.likes.find(l => l.userId === user.value.identities[0].user_id && l.postId === props.post.id);
    unlikePost(id);
  }
</script>

<template>
  <div class="z-50 bottom-0 w-full h-full">
    <div class="py-2 w-full">
      <div class="flex items-center justify-between">

        <div class="flex items-center text-white">
          <img class="rounded-full h-[35px]" :src="post.image">
          <div class="ml-2 font-semibold text-[18px]">{{ post.name }}</div>
        </div>

        <div
            v-if="user?.identities[0]?.user_id === post.userId"
            @click="isMenu = !isMenu" class="relative"
        >
          <button
              :disabled="isDeleting"
              class="flex items-center text-white p-1 h-[24px] w-[24px] hover:bg-gray-800 rounded-full cursor-pointer"
              :class="isMenu ? 'bg-gray-800' : ''"
          >
            <Icon v-if="!isDeleting" name="bi:three-dots" size="18" style="color: white" />
            <Icon v-else name="eos-icons:bubble-loading" size="18" style="color: white" />
          </button>

          <div
              @click="deletePost(post.id, post.picture)"
              v-if="isMenu" class="absolute border border-gray-600 right-0 z-20 mt-1 rounded"
          >
            <button
              class="flex items-center rounded gap-2 text-red-500 justify-between bg-black w-full pl-4 pr-3 py-1 hover:bg-gray-900"
            >
              <div>Delete</div>
              <Icon name="solar:trash-bin-trash-broken" size="20" stlye="color: white" />
            </button>
          </div>
        </div>

      </div>

      <div class="relative flex items-center w-full">
        <div class="w-[42px] mx-auto">
          <div class="absolute ml-4 mt-1 top-0 w-[1px] bg-gray-700 h-full" />
        </div>

          <div class="bg-black rounded-lg w-[calc(100% - 50px)] text-sm w-full font-light">
            <div class="py-2 text-gray-300">{{ post.text }}</div>
            <img
                v-if="post && post.picture"
                :src="runtimeConfig.public.bucketUrl + post.picture"
                class="mx-auto w-full mt-2 pr-2 rounded"
                alt="picture"
            />

            <div class="absolute mt-2 w-full ml-2">
              <button
                :disabled="isLiking"
                @click="likesFn()"
                class="flex items-center gap-1"
              >
                <Icon
                    v-if="!hasLikedComputed"
                    class="p-1 text-white hover:bg-gray-800 rounded-full cursor-pointer"
                    name="mdi:cards-heart-outline"
                    size="28"
                />
                <Icon
                    v-else
                    class="p-1 text-red-500 hover:bg-gray-800 rounded-full cursor-pointer"
                    size="28"
                    name="mdi:cards-heart"
                />
              </button>
              <div class="relative text-sm text-gray-500">
                <div>
                  <span v-if="!isLiking">{{ post.likes.length }}</span>
                  <span v-else>
                    <Icon
                      name="eos-icons:bubble-loading"
                      size="13"
                      style="color: white"
                    />
                  </span>
                  {{ likesAmountTextComputed }}
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>

    <div class="relative inline-block text-gray-500 pt-1 pb-1.5">
      <div class="flex items-center">
        <div class="flex items-center flex-wrap text-white gap-1 w-[42px]">
          <div class="flex gap-0.5">
            <img class="rounded-full h-[14px] mt-2" src="https://picsum.photos/id/202/50">
            <img class="rounded-full h-[17px]" src="https://picsum.photos/id/223/50">
          </div>
          <div class="flex items-center">
            <img class="rounded-full h-[11px] ml-4" src="https://picsum.photos/id/99/50">
          </div>
        </div>
      </div>
    </div>

    <div class="h-[1px] bg-gray-800 w-full mt-3"/>
  </div>
</template>