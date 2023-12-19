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

    <va-modal v-model="showModal" blur>
      <va-content anchor-class="inline-flex">
        <div class="flex items-center justify-between">
          <div class="profile-content">
            <va-avatar>
              <img :src="userProfile?.avatar || '/file.jpeg'" :alt="userProfile?.username" />
            </va-avatar>
            <h2 class="text-xl font-bold mb-2">Mi Perfil</h2>
            <p class="text-xl font-bold mb-2">
              Nombre de usuario: <span>{{ userData.username }}</span>
            </p>
            <p class="text-xl font-bold mb-2">
              Nombre: <span>{{ userData.firstname }}</span>
            </p>
            <p class="text-xl font-bold mb-2">
              Apellido: <span>{{ userData.lastname }}</span>
            </p>
            <p class="text-xl font-bold mb-2">
              Correo Electrónico: <span>{{ userData.email }}</span>
            </p>
            <p class="text-xl font-bold mb-2">
              Teléfono: <span>{{ userData.phone }}</span>
            </p>
          </div>
        </div>
      </va-content>
    </va-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useColors } from 'vuestic-ui'
  import axios from 'axios'
  import { loadUser } from '../../../../stores/global-store'
  import { Payload } from '../../../../util/ApiClient'
  import data from '../../../../pages/admin/ui/lists/data.json'

  const customers = ref(data.slice(0, 5))

  const { t } = useI18n()
  const { colors } = useColors()
  const showModal = ref(false)
  const isShown = ref(false)
  const showLargeModal = ref(true)

  const userProfile = ref(null)

  const userData = ref(loadUser().payload)

  const changeShowModal = () => {
    showModal.value = !showModal.value
  }

  const loadUserProfile = async () => {
    const user = loadUser()
    try {
      const response = await axios
        .get(import.meta.env.VITE_BASE_URL + '/api/rest/v1/users/' + loadUser().payload.id, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((res) => {
          return res.data
        })
      userProfile.value = response.data
      showModal.value = true
    } catch (error) {
      console.error('Error al cargar el perfil del usuario:', error)
    }
  }

  const logout = () => {
    localStorage.clear()
    window.location.href = 'auth/login'
  }
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
  .p-2 {
    cursor: pointer;
  }
</style>
