<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ToastPosition, useToast } from 'vuestic-ui'
  import * as z from 'zod'
  import { ErrorResult, handleErrors, sendUpdateDataToServer } from '../../../util/ApiClient'
  import { loadUser } from '../../../stores/global-store'
  import { AxiosError } from 'axios'

  const { init } = useToast()
  const props = defineProps({
    showForm: {
      type: Boolean,
      required: true,
    },
    openForm: {
      type: Function,
      required: true,
    },
    closeProfile: {
      type: Function,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
    fetchUsers: {
      type: Function,
      required: true,
    },
  })
  const user = computed(() => ({
    username: props.userData.username,
    firstname: props.userData.firstname,
    lastname: props.userData.lastname,
    email: props.userData.email,
    role: props.userData.role,
    status: props.userData.status,
    id: props.userData.id,
  }))

  const username = ref(user.value.username)
  const nameAndLastName = ref(user.value.firstname + ' ' + user.value.lastname)

  const toastDuration = ref(3000)
  const toastPosition = ref<ToastPosition>('bottom-right')

  function getInitialValues() {
    return {
      toastColor: 'rgb(21, 141, 227)',
      toastTitle: 'Accion Ejecutada',
      toastText: 'Usuario actualizado en el servidor correctamente',
    }
  }

  const status = ref([
    { label: 'ACTIVE', description: 'Usuario activado' },
    { label: 'DEACTIVE', description: 'Usuario desactivado' },
  ])

  const statusSelectModel = ref(status.value.find((s) => s.label === user.value.status)!)

  const initialValues = getInitialValues()
  const toastColor = ref(initialValues.toastColor)
  const toastTitle = ref(initialValues.toastTitle)
  const toastText = ref(initialValues.toastText)

  function launchToast() {
    init({
      message: toastText.value,
      position: toastPosition.value,
      duration: Number(toastDuration.value),
      title: toastTitle.value,
      closeable: true,
      color: toastColor.value,
    })
  }

  const email = ref(user.value.email)

  const validateData = (data: {
    firstname?: string
    role?: string
    email?: string
    lastname?: string
    username?: string
    status?: string
  }) => {
    const schema = z.object({
      username: z.string().optional(),
      firstname: z.string().optional(),
      lastname: z.string().optional(),
      role: z.string().optional(),
      email: z.string().email().optional(),
      status: z.string().optional(),
    })

    return schema.parse(data)
  }

  const roles = ref([
    { label: 'USER', description: 'Cliente' },
    { label: 'WORKER', description: 'Trabajador' },
    { label: 'ADMIN', description: 'Administrador' },
  ])

  const rolesSelectModel = ref(roles.value.find((role) => role.label === user.value.role)!)

  const token = loadUser().access_token
  const sendData = async () => {
    const nameAndLast = nameAndLastName.value.trim().split(' ', 2)
    const data = validateData({
      firstname: nameAndLast[0],
      lastname: nameAndLast[1],
      username: username.value,
      role: rolesSelectModel.value.label,
      status: statusSelectModel.value.label,
    })
    const url = '/api/rest/v1/users/' + user.value.id
    try {
      const response = await sendUpdateDataToServer(data, url, token)
      await props.fetchUsers()
      launchToast()
      props.closeProfile()

      console.log(response)
    } catch (error) {
      const failedValues = (await handleErrors(error as AxiosError<ErrorResult>))!
      toastColor.value = 'rgb(228, 34, 34)'
      toastTitle.value = failedValues.toastTitle
      toastText.value = failedValues.toastText

      await props.fetchUsers()
      launchToast()

      const resetValues = getInitialValues()
      toastColor.value = resetValues.toastColor
      toastTitle.value = resetValues.toastTitle
      toastText.value = resetValues.toastText
    }
  }
</script>

<template>
  <div v-if="showForm">
    <va-card class="col-span-14">
      <va-card-title>Registro de Usuario</va-card-title>
      <va-card-content>
        <form>
          <div class="grid grid-cols-12 gap-6">
            <div class="flex md:col-span-2 sm:col-span-6 col-span-12">
              <va-input
                v-model="username"
                placeholder="Entrada de Texto"
                color="info"
                label="Nombre de usuario"
                clearable
              >
                <template #prepend>
                  <va-icon color="info" name="entypo-user" />
                </template>
              </va-input>
            </div>
            <div class="flex md:col-span-3 sm:col-span-6 col-span-12">
              <va-input v-model="nameAndLastName" placeholder="Entrada de Texto" label="Nombre y Apellidos" clearable>
              </va-input>
            </div>
            <div class="flex md:col-span-2 col-span-12">
              <va-select
                v-model="rolesSelectModel"
                text-by="description"
                label="Rol de Usuario"
                track-by="label"
                :options="roles"
              />
            </div>
            <div class="flex md:col-span-4 sm:col-span-6 col-span-12">
              <va-input v-model="email" type="email" label="Correo Electrónico" clearable>
                <template #prepend>
                  <va-icon color="grey" name="email" />
                </template>
              </va-input>
            </div>
            <div class="flex md:col-span-2 col-span-12">
              <va-select
                v-model="statusSelectModel"
                text-by="description"
                label="Estado de Cuenta Electronica"
                track-by="label"
                :options="status"
              />
            </div>
          </div>
          <va-card-content class="my-3 flex flex-wrap items-center gap-2 justify-end pr-40">
            <va-button color-presentation color="info" :variant="['gradient', 'hovered']" @click="sendData">
              guardar
            </va-button>
            <va-button color="danger" @click="closeProfile"> cancelar </va-button>
          </va-card-content>
        </form>
      </va-card-content>
    </va-card>
  </div>
</template>

<style scoped lang="scss"></style>
