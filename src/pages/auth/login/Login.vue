<template>
  <form @submit.prevent="onsubmit">
    <va-input
      v-model="email"
      class="mb-4"
      type="email"
      :label="t('auth.email')"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
    />

    <va-input
      v-model="password"
      class="mb-4"
      type="password"
      :label="t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />

    <div v-if="loginError" class="error-message mb-4" :error-messages="loginError">
      {{ loginError }}
    </div>

    <div class="auth-layout__options flex items-center justify-between">
      <va-checkbox v-model="keepLoggedIn" class="mb-0" :label="t('auth.keep_logged_in')" />
      <router-link class="ml-1 va-link" :to="{ name: 'recover-password' }">{{
        t('auth.recover_password')
      }}</router-link>
    </div>

    <div class="flex justify-center mt-4">
      <va-button class="my-0" @click="onsubmit">{{ t('auth.login') }}</va-button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { Data, LoginResponse, makeRequest } from '../../../util/ApiClient'
  const { t } = useI18n()

  const email = ref('')
  const password = ref('')
  const keepLoggedIn = ref(false)
  const emailErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const loginError = ref('')
  const router = useRouter()

  const formReady = computed(() => !emailErrors.value.length && !passwordErrors.value.length)

  async function onsubmit() {
    if (!formReady.value) return

    emailErrors.value = email.value ? [] : ['El correo o el nombre de usario es requerido']
    passwordErrors.value = password.value ? [] : ['La contraseña es requireda']

    if (formReady.value) {
      try {
        const response = await makeRequest<Data<LoginResponse>>('/api/rest/v1/auth/login', {
          username: email.value,
          password: password.value,
        })
        console.log(response)
        localStorage.setItem('user', JSON.stringify(response))
        await router.push({ name: 'dashboard' })
      } catch (error) {
        loginError.value = 'Invalido email o contraseña'
      }
    }
  }
</script>

<style scoped>
  .error-message {
    color: red;
  }
</style>
