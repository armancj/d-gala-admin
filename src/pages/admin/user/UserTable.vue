<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { loadUser } from '../../../stores/global-store'
  import { deleteResponseUser, findOneResponse, getResponseAll, Result } from '../../../util/ApiClient'
  import UserRegister from './UserRegister.vue'
  import UserProfile from './UserProfile.vue'
  import UserEdit from './UserEdit.vue'
  import data from '../ui/lists/data.json'

  const users = ref<Result[]>([])
  const activePage = ref(1)
  const totalItems = ref(0)
  const showForm = ref(false)
  const showProfile = ref(false)
  const showEdit = ref(false)
  const showBlurredModal = ref(false)
  const userIdToDelete = ref(null)
  const findOneUser = ref(null)

  const url = '/api/rest/v1/users'

  const customers = ref(data.slice(0, 5))

  const itemsPerPage = 10

  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage)))
  const openForm = () => {
    showForm.value = !showForm.value
  }

  const openProfile = async (id: number) => {
    const urlOne = `${url}/${id}`
    findOneUser.value = (await findOneResponse(token, urlOne)).data
    showProfile.value = !showProfile.value
  }

  const openEditProfile = async (id: number) => {
    const urlOne = `${url}/${id}`
    findOneUser.value = (await findOneResponse(token, urlOne)).data
    showEdit.value = !showEdit.value
  }
  const closeProfile = () => {
    showProfile.value = !showProfile.value
  }
  const closeEditProfile = () => {
    showEdit.value = !showEdit.value
    findOneUser.value = null
  }

  const getRoles = (status: string) => {
    switch (status) {
      case 'SUADMIN':
        return 'Super Administrador'
      case 'ADMIN':
        return 'Administrador'
      case 'WORKED':
        return 'Trabajador'
      default:
        return 'Cliente'
    }
  }

  function getStatusColor(status: string) {
    if (status === 'ACTIVE') {
      return { color: 'info', name: 'Activado' }
    }
    return { color: 'danger', name: 'Desactivado' }
  }

  const token = loadUser().access_token
  const fetchUsers = async () => {
    const skip = (activePage.value - 1) * itemsPerPage

    try {
      const response = await getResponseAll(token, url, skip, itemsPerPage)
      users.value = response.data.result?.filter((user: Result) => !(user.role === 'SUADMIN')) || []
      totalItems.value = response.data.total
    } catch (error) {
      console.log('here')
      console.error(error)
    }
  }

  const deleteUser = (userId: any) => {
    userIdToDelete.value = userId
    showBlurredModal.value = true
  }
  const confirmDelete = async () => {
    const urlOne = `${url}/${userIdToDelete.value}`

    try {
      await deleteResponseUser(token, urlOne)
      refreshUserList()
      showBlurredModal.value = false
    } catch (error) {
      console.error(error)
    }
  }

  watch(activePage, fetchUsers, { immediate: true })

  const refreshUserList = () => {
    fetchUsers()
  }
</script>
<template>
  <Suspense>
    <template #default>
      <div>
        <div v-if="!showForm && !showProfile && !showEdit">
          <va-card>
            <va-card-title>Usuarios</va-card-title>
            <va-card-content class="overflow-auto">
              <table class="va-table va-table--striped va-table--hoverable w-full will-change-transform">
                <thead>
                  <tr>
                    <th></th>
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
                    <td>
                      <va-avatar>
                        <img
                          src="https://th.bing.com/th/id/R.e983f81e31dbbde3e9f982c4f78bdc45?rik=Q30BYccxkPEFFg&pid=ImgRaw&r=0"
                          :alt="customers[0].name"
                        />
                      </va-avatar>
                    </td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.firstname }} {{ user.lastname }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ getRoles(user.role) }}</td>
                    <td>
                      <va-badge :text="getStatusColor(user.status).name" :color="getStatusColor(user.status).color" />
                    </td>
                    <td>{{ user.createdAt }}</td>
                    <td>
                      <va-button-group preset="plain" color="gray">
                        <va-button color="info" icon="material-icons-person" @click="openProfile(user.id)"></va-button>
                        <va-button
                          color="dark"
                          icon="material-icons-mode_edit"
                          @click="openEditProfile(user.id)"
                        ></va-button>
                        <va-button color="danger" icon="material-icons-remove_circle" @click="deleteUser(user.id)">
                          <va-modal
                            v-model="showBlurredModal"
                            class="mr-2 mb-2"
                            :title="'¿Estás seguro?'"
                            :message="'Esta acción removerá de manera permanente al usuario en la base de datos.'"
                            :ok-text="'Sí, eliminar'"
                            :cancel-text="'No, cancelar'"
                            blur
                            @ok="confirmDelete"
                          />
                        </va-button>
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

        <UserRegister :show-form="showForm" :open-form="openForm" :fetch-users="fetchUsers" />
        <UserEdit
          v-if="findOneUser"
          :show-form="showEdit"
          :open-form="openEditProfile"
          :close-profile="closeEditProfile"
          :fetch-users="fetchUsers"
          :user-data="findOneUser"
        />
        <UserProfile
          :open-profile="openProfile"
          :close-profile="closeProfile"
          :show-profile="showProfile"
          :user-data="findOneUser"
        />
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
