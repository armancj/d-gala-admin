<script setup lang="ts">
  import { ref } from 'vue'
  import { ToastPosition, useToast } from 'vuestic-ui'
  import * as z from 'zod'
  import { ErrorResult, handleErrors, sendDataToServer } from '../../../util/ApiClient'
  import { loadUser } from '../../../stores/global-store'
  import { AxiosError } from 'axios'

  const { init } = useToast()

  const url = '/api/rest/v1/users'
  const username = ref('')
  const nameAndLastName = ref('')
  const phone = ref('')

  const props = defineProps({
    showForm: {
      type: Boolean,
      required: true,
    },
    openForm: {
      type: Function,
      required: true,
    },
    fetchUsers: {
      type: Function,
      required: true,
    },
  })

  const toastDuration = ref(3000)
  const toastPosition = ref<ToastPosition>('bottom-right')

  function getInitialValues() {
    return {
      toastColor: 'rgb(21, 141, 227)',
      toastTitle: 'Accion Ejecutada',
      toastText: 'Usuario guardado en el servidor correctamente',
    }
  }

  const status = ref([
    { label: 'ACTIVATED', description: 'Usuario activado' },
    { label: 'DEACTIVATED', description: 'Usuario desactivado' },
  ])

  const statusSelectModel = ref(status.value[0])

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

  const email = ref('')

  const validateData = (data: {
    firstname: string
    role: string
    phone: string
    email: string
    lastname: string
    username: string
  }) => {
    const schema = z.object({
      username: z.string(),
      firstname: z.string(),
      lastname: z.string().optional(),
      role: z.string(),
      phone: z.string(),
      email: z.string().email(),
    })

    return schema.parse(data)
  }

  const resetForm = () => {
    nameAndLastName.value = ''
    username.value = ''
    phone.value = ''
    email.value = ''
  }

  const datePlusDay = (date: Date, days: number) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
  }

  const dateInput = ref({
    simple: new Date(),
    disabled: '2018-05-09',
    range: { start: new Date(), end: datePlusDay(new Date(), 7) },
    multiple: ['2018-04-25', '2018-04-27'],
  })

  const roles = ref([
    { label: 'USER', description: 'Cliente' },
    { label: 'WORKER', description: 'Trabajador' },
    { label: 'ADMIN', description: 'Administrador' },
  ])

  const rolesSelectModel = ref(roles.value[0])

  const token = loadUser().access_token
  const sendData = async () => {
    const nameAndLast = nameAndLastName.value.trim().split(' ', 2)
    const data = validateData({
      firstname: nameAndLast[0],
      lastname: nameAndLast[1],
      username: username.value,
      role: rolesSelectModel.value.label,
      phone: phone.value,
      email: email.value,
    })
    try {
      const response = await sendDataToServer(data, url, token)
      await props.fetchUsers()
      launchToast()
      props.openForm()

      resetForm()

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
                <template #prepend> <va-icon color="info" name="entypo-user" />&nbsp; </template>
              </va-input>
            </div>
            <div class="flex md:col-span-3 sm:col-span-6 col-span-12">
              <va-input
                v-model="nameAndLastName"
                color="info"
                placeholder="Entrada de Texto"
                label="Nombre y Apellidos"
                clearable
              >
                <template #prepend> <va-icon color="info" name="entypo-vcard" />&nbsp; </template>
              </va-input>
            </div>
            <div class="flex md:col-span-2 col-span-12">
              <va-select
                v-model="rolesSelectModel"
                text-by="description"
                label="Rol de Usuario"
                track-by="label"
                color="info"
                :options="roles"
              >
                <template #prepend> <va-icon color="info" name="entypo-users" />&nbsp; </template>
              </va-select>
            </div>
            <div class="flex md:col-span-2 sm:col-span-6 col-span-12">
              <va-input v-model="phone" color="info" placeholder="Entrada de Texto" label="Telefono" clearable>
                <template #prepend> <va-icon color="info" name="entypo-mobile" />&nbsp; </template>
              </va-input>
            </div>
            <div class="flex md:col-span-4 sm:col-span-6 col-span-12">
              <va-input v-model="email" color="info" type="email" label="Correo Electrónico" clearable>
                <template #prepend> <va-icon color="info" name="entypo-mail" />&nbsp; </template>
              </va-input>
            </div>
            <div class="flex md:col-span-2 col-span-12">
              <va-select
                v-model="statusSelectModel"
                text-by="description"
                label="Estado de Cuenta Electronica"
                track-by="label"
                :options="status"
                color="info"
              >
                <template #prepend> <va-icon color="info" name="entypo-flow-cascade" />&nbsp; </template>
              </va-select>
            </div>
            <div class="flex md:col-span-2 sm:col-span-3 col-span-12">
              <va-date-input v-model="dateInput.simple" color="info" :label="'Fecha de creado'" manual-input clearable>
                <template #prepend>
                  <va-icon color="info" name="fa-solid fa-calendar-alt" />&nbsp;
                </template> </va-date-input
              >>
            </div>
          </div>
          <va-card-content class="my-3 flex flex-wrap items-center gap-2 justify-end pr-40">
            <va-button color-presentation color="info" :variant="['gradient', 'hovered']" @click="sendData">
              guardar
            </va-button>
            <va-button color="danger" @click="openForm"> cancelar </va-button>
          </va-card-content>
        </form>
      </va-card-content>
    </va-card>
  </div>
</template>

<style scoped lang="scss"></style>
