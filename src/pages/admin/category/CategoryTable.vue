<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { loadUser } from '../../../stores/global-store'
  import {
    CategoriesResult,
    deleteResponseUser,
    findOneResponse,
    formatDate,
    getResponseAll,
  } from '../../../util/ApiClient'
  import CategoryRegister from './CategoryRegister.vue'
  import CategoryEdit from './CategoryEdit.vue'

  const categories = ref<CategoriesResult[]>([])
  const activePage = ref(1)
  const totalItems = ref(0)
  const showForm = ref(false)
  const showEdit = ref(false)
  const showBlurredModal = ref(false)
  const idToDelete = ref(null)
  const findOne = ref(null)

  const url = '/api/rest/v1/category'

  const itemsPerPage = 10

  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage)))
  const openForm = () => {
    showForm.value = !showForm.value
  }
  const openEdit = async (id: number) => {
    const urlOne = `${url}/${id}`
    findOne.value = (await findOneResponse(token, urlOne)).data
    showEdit.value = !showEdit.value
  }
  const findOneUser = async (id: number) => {
    const urlOne = `/api/rest/v1/users/${id}`
    return (await findOneResponse(token, urlOne)).data.username
  }
  const closeEdit = () => {
    showEdit.value = !showEdit.value
    findOne.value = null
  }

  const token = loadUser().access_token
  const fetchData = async () => {
    const skip = (activePage.value - 1) * itemsPerPage

    try {
      const response = await getResponseAll(token, url, skip, itemsPerPage)
      categories.value = response.data.result
      categories.value = await Promise.all(
        response.data.result.map(async (category: CategoriesResult) => {
          category.userId = await findOneUser(category.userId)
          return category
        }),
      )
      totalItems.value = response.data.total
    } catch (error) {
      console.error(error)
    }
  }

  const deleteUser = (userId: any) => {
    idToDelete.value = userId
    showBlurredModal.value = true
  }
  const confirmDelete = async () => {
    const urlOne = `${url}/${idToDelete.value}`

    try {
      await deleteResponseUser(token, urlOne)
      refreshList()
      showBlurredModal.value = false
    } catch (error) {
      console.error(error)
    }
  }

  watch(activePage, fetchData, { immediate: true })

  const refreshList = () => {
    fetchData()
  }
</script>
<template>
  <Suspense>
    <template #default>
      <div>
        <div v-if="!showForm && !showEdit">
          <va-card>
            <va-card-title>Usuarios</va-card-title>
            <va-card-content class="overflow-auto">
              <table class="va-table va-table--striped va-table--hoverable w-full will-change-transform">
                <thead>
                  <tr>
                    <th>Nombre de Categoría</th>
                    <th>Nombre de Categoría Superior</th>
                    <th>Creado por usuario</th>
                    <th>Fecha de creado</th>
                    <th>Fecha de actualizado</th>
                    <th>&nbsp;&nbsp;Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="category in categories" :key="category.id">
                    <td>{{ category.name }}</td>
                    <td>{{ category?.parentId || 'No tiene Categoría Superior' }}</td>
                    <td>{{ category.userId }}</td>
                    <td>{{ formatDate(category.createdAt) }}</td>
                    <td>{{ formatDate(category.updatedAt) }}</td>
                    <td>
                      <va-button-group preset="plain" color="gray">
                        <va-button
                          color="dark"
                          icon="material-icons-mode_edit"
                          @click="openEdit(category.id)"
                        ></va-button>
                        <va-button color="danger" icon="material-icons-remove_circle" @click="deleteUser(category.id)">
                          <va-modal
                            v-model="showBlurredModal"
                            class="mr-2 mb-2"
                            :title="'¿Estás seguro?'"
                            :message="'Esta acción removerá de manera permanente la categoría en la base de datos.'"
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
                <va-card-content class="col-span-12 lg:col-span-6 flex justify-end pr-20">
                  <va-button color="info" icon="material-icons-note_add" @click="openForm">Agregar Categoría</va-button>
                  &nbsp;&nbsp;&nbsp;<va-button color="info" icon="material-icons-refresh" @click="refreshList" />
                </va-card-content>
              </va-card-content>
            </va-card-content>
          </va-card>
        </div>

        <CategoryRegister :show-form="showForm" :open-form="openForm" :fetch-category="fetchData" />

        <CategoryEdit
          v-if="findOne"
          :show-form="showEdit"
          :open-form="openEdit"
          :close-profile="closeEdit"
          :fetch-category="fetchData"
          :category-data="findOne"
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
