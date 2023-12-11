<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import axios, { AxiosError } from 'axios'
  import { loadUser } from '../../../stores/global-store'
  import { ErrorResult, handleErrors, Result, sendDataToServer } from '../../../util/ApiClient'
  import { ToastPosition, useToast } from 'vuestic-ui'
  import * as z from 'zod'
  import UserProfile from './UserProfile.vue'
  const { init } = useToast()

  const url = '/api/rest/v1/users'
  const users = ref<Result[]>([])
  const activePage = ref(1)
  const totalItems = ref(0)
  const showForm = ref(false)
  const showProfile = ref(false)
  const username = ref('')
  const nameAndLastName = ref('')
  const phone = ref('')
  const toastDuration = ref(3000)
  const toastPosition = ref<ToastPosition>('bottom-right')

  function getInitialValues() {
    return {
      toastColor: 'rgb(21, 141, 227)',
      toastTitle: 'Accion Ejecutada',
      toastText: 'Usuario guardado en el servidor correctamente',
    }
  }

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
  const roles = ref([
    { label: 'USER', description: 'Cliente' },
    { label: 'WORKER', description: 'Trabajador' },
    { label: 'ADMIN', description: 'Administrador' },
  ])

  const status = ref([
    { label: 'ACTIVATED', description: 'Usuario activado' },
    { label: 'DEACTIVATED', description: 'Usuario desactivado' },
  ])
  const rolesSelectModel = ref(roles.value[0])
  const statusSelectModel = ref(status.value[0])

  const itemsPerPage = 10

  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage)))
  const openForm = () => {
    showForm.value = !showForm.value
  }

  const openProfile = () => {
    showProfile.value = !showProfile.value
  }

  function getStatusColor(status: string) {
    if (status === 'ACTIVE') {
      return 'info'
    }

    /*if (status === 'processing') {
      return 'info'
    }*/

    return 'danger'
  }

  const token = loadUser().access_token
  const fetchUsers = async () => {
    const skip = (activePage.value - 1) * itemsPerPage
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + `/api/rest/v1/users?skip=${skip}&take=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      users.value = response.data.data.result
      totalItems.value = response.data.data.total
    } catch (error) {
      console.error(error)
    }
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

  watch(activePage, fetchUsers, { immediate: true })

  watch(rolesSelectModel, (newVal, oldVal) => {
    console.log('Rol seleccionado:', newVal, oldVal)
  })
  const refreshUserList = () => {
    fetchUsers()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      await fetchUsers()
      launchToast()
      showForm.value = false

      resetForm()

      console.log(response)
    } catch (error) {
      const failedValues = (await handleErrors(error as AxiosError<ErrorResult>))!
      toastColor.value = 'rgb(228, 34, 34)'
      toastTitle.value = failedValues.toastTitle
      toastText.value = failedValues.toastText

      await fetchUsers()
      launchToast()

      const resetValues = getInitialValues()
      toastColor.value = resetValues.toastColor
      toastTitle.value = resetValues.toastTitle
      toastText.value = resetValues.toastText
    }
  }
  const popover = ref({
    title: 'Hey folks!',
    message: 'This tooltip is amazing :D',
    icon: {
      icon: 'person',
      text: 'print',
    },
    color: 'info',
  })
</script>
<template>
  <Suspense>
    <template #default>
      <div>
        <div v-if="!showForm && !showProfile">
          <va-card>
            <va-card-title>Usuarios</va-card-title>
            <va-card-content class="overflow-auto">
              <table class="va-table va-table--striped va-table--hoverable w-full will-change-transform">
                <thead>
                  <tr>
                    <th>Nombre de usuario</th>
                    <th>Nombre y Apellidos</th>
                    <th>Correo</th>
                    <th>Telefono</th>
                    <th>Rol de Usuario</th>
                    <th>Estado</th>
                    <th>Fecha de creado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.username }}</td>
                    <td>{{ user.firstname }} {{ user.lastname }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ user.role }}</td>
                    <td>
                      <va-badge :text="user.status" :color="getStatusColor(user.status)" />
                    </td>
                    <td>{{ user.createdAt }}</td>
                    <td>
                      <va-button-group class="flex col-span-2 xl:col-span-12 justify-end" preset="plain" color="gray">
                        <va-button color="info" icon="material-icons-person" @click="openProfile"></va-button>
                        <va-button color="dark" icon="material-icons-mode_edit"></va-button>
                        <va-button color="danger" icon="material-icons-remove_circle"></va-button>
                      </va-button-group>
                    </td>
                  </tr>
                </tbody>
              </table>
              <va-card-content class="flex items-center justify-between grid-cols-12 gap-5">
                <va-pagination
                  v-model="activePage"
                  class="col-span-12 lg:col-span-6"
                  :visible-pages="3"
                  :pages="totalPages"
                  color="info"
                />
                <va-card-content class="col-span-12 lg:col-span-6 flex justify-end pr-40">
                  <va-button color="info" icon="material-icons-person_add" @click="openForm">Agregar Usuario</va-button>
                </va-card-content>
              </va-card-content>
            </va-card-content>
          </va-card>
        </div>

        <div v-if="showProfile">
          <UserProfile />
        </div>

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
                    <va-input
                      v-model="nameAndLastName"
                      placeholder="Entrada de Texto"
                      label="Nombre y Apellidos"
                      clearable
                    >
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
                  <div class="flex md:col-span-2 sm:col-span-6 col-span-12">
                    <va-input v-model="phone" placeholder="Entrada de Texto" label="Telefono" clearable>
                      <template #prepend>
                        <va-icon color="grey" name="phone" />
                      </template>
                    </va-input>
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
                  <div class="flex md:col-span-2 sm:col-span-3 col-span-12">
                    <va-date-input v-model="dateInput.simple" :label="'Fecha de creado'" manual-input clearable />
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
      </div>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
<style lang="scss" scoped>
  fieldset {
    margin-bottom: 0.5rem;
  }
  .toast-position-picker {
    width: 112px;
    height: 76px;
  }

  .position-boxes-row {
    flex-direction: row;

    &:first-child {
      margin-bottom: 2px;
    }
  }

  .position-box {
    height: 36px;
    width: 36px;
    margin-right: 2px;
    cursor: pointer;
    opacity: 0.3;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      opacity: 0.6;
    }

    &.selected {
      opacity: 1;
    }
  }
</style>
