<template>
  <div class="profile-dropdown-wrapper">
    <va-dropdown v-model="isShown" class="profile-dropdown" stick-to-edges :offset="[13, 0]">
      <template #anchor>
        <span class="profile-dropdown__anchor">
          <slot />
          <va-icon class="px-2" :name="isShown ? 'angle_up' : 'angle_down'" :color="colors.primary" />
        </span>
      </template>
      <va-dropdown-content class="profile-dropdown__content">
        <va-list-item class="p-2" @click="loadUserProfile">
          {{ t(`user.profile`) }}
        </va-list-item>
        <va-list-item class="p-2" @click="logout">
          {{ t(`user.logout`) }}
        </va-list-item>
      </va-dropdown-content>
    </va-dropdown>
    <va-modal v-model:active="showModal">
      <div v-if="userProfile">
        <h2>{{ (userProfile as Payload).email }}</h2>
        <p>{{ (userProfile as Payload).role }}</p>
      </div>
    </va-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, UnwrapRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useColors } from 'vuestic-ui'
  import axios from 'axios'
  import { loadUser } from '../../../../stores/global-store'
  import { Data, Payload } from '../../../../util/ApiClient'
  import { Ref } from '@vue/reactivity'

  const { t } = useI18n()
  const { colors } = useColors()
  const showModal = ref(false)
  const isShown = ref(false)

  const userProfile: Ref<UnwrapRef<null>> = ref(null)

  const loadUserProfile = async () => {
    showModal.value = true
    const user = loadUser()
    try {
      const response = await axios
        .get('http://localhost:5000/api/rest/v1/users/profile', {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((res) => {
          return res.data
        })
      console.log(showModal.value)
      userProfile.value = response.data
    } catch (error) {
      console.error('Error al cargar el perfil del usuario:', error)
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/logout') // Asume que '/api/logout' es la ruta de tu API que maneja el cierre de sesión
    } catch (error) {
      console.error('Error al cerrar la sesión:', error)
    }
  }

  /*withDefaults(
    defineProps<{
      options?: { name: string; redirectTo: string }[]
    }>(),
    {
      options: () => [
        {
          name: 'profile',
          redirectTo: '',
        },
        {
          name: 'logout',
          redirectTo: 'login',
        },
      ],
    },
  )*/
</script>

<style lang="scss" scoped>
  .profile-dropdown {
    cursor: pointer;

    &__anchor {
      display: inline-block;
    }

    &__item {
      display: block;
      color: var(--va-gray);

      &:hover,
      &:active {
        color: var(--va-primary);
      }
    }
  }
</style>
