<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { loadUser } from '../../../stores/global-store'
  import { Result } from '../../../util/ApiClient'

  const users = ref<Result[]>([])
  const activePage = ref(1)
  const totalItems = ref(0)
  const showForm = ref(false)
  const username = ref('')
  const nameAndLastName = ref('')
  const phone = ref('')
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

  const errorMessages = ref(['El campo debe contener un email valido'])
  const itemsPerPage = 10

  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage)))
  const openForm = () => {
    showForm.value = true
  }

  function getStatusColor(status: string) {
    if (status === 'ACTIVE') {
      return 'success'
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
    console.log('Rol seleccionado:', newVal)
  })
  const refreshUserList = () => {
    fetchUsers()
  }
</script>
<template>
  <Suspense>
    <template #default>
      <div>
        <div v-if="!showForm">
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
                  </tr>
                </tbody>
              </table>
              <va-card-content class="flex items-center justify-between grid-cols-12 gap-5">
                <va-pagination
                  v-model="activePage"
                  class="col-span-12 lg:col-span-6"
                  :visible-pages="3"
                  :pages="totalPages"
                />
                <va-card-content class="col-span-12 lg:col-span-6 flex justify-end pr-40">
                  <va-button color="dark" @click="openForm">Agregar Usuario</va-button>
                </va-card-content>
              </va-card-content>
            </va-card-content>
          </va-card>
        </div>

        <div v-if="showForm">
          <va-card class="col-span-14">
            <va-card-title>Registro de Usuario</va-card-title>
            <va-card-content>
              <form>
                <div class="grid grid-cols-12 gap-6">
                  <div class="flex md:col-span-2 sm:col-span-6 col-span-12">
                    <va-input v-model="username" placeholder="Entrada de Texto" label="Nombre de usuario" clearable>
                      <template #prepend>
                        <va-icon color="gray" name="entypo-user" />
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
                        <va-icon color="gray" name="phone" />
                      </template>
                    </va-input>
                  </div>
                  <div class="flex md:col-span-4 sm:col-span-6 col-span-12">
                    <va-input v-model="email" type="email" label="Correo Electrónico" clearable>
                      <template #prepend>
                        <va-icon color="gray" name="email" />
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
</style>
