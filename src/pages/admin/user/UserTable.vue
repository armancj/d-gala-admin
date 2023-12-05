<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { loadUser } from '../../../stores/global-store'

  const { t } = useI18n()

  const users = ref([])
  const activePage = ref(1)
  const itemsPerPage = 10
  const totalItems = ref(0)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage)))

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

  watch(activePage, fetchUsers, { immediate: true })
  const refreshUserList = () => {
    fetchUsers()
  }
</script>
<template>
  <Suspense>
    <template #default>
      <div>
        <va-card>
          <va-card-title>{{ t('tables.stripedHoverable') }}</va-card-title>
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
          </va-card-content>
        </va-card>
        <va-card class="larger-padding col-span-12">
          <va-card-title>{{ t('buttons.pagination') }}</va-card-title>
          <va-card-content class="flex justify-between items-center mt-4 grid grid-cols-12 gap-16">
            <va-pagination
              v-model="activePage"
              class="col-span-12 xl:col-span-6"
              :visible-pages="3"
              :pages="totalPages"
            />
            <button @click="refreshUserList">Actualizar lista de usuarios</button>
          </va-card-content>
        </va-card>
      </div>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<style scoped lang="scss"></style>
