<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { loadUser } from '../../../stores/global-store'
  import { deleteResponseUser, findOneResponse, formatDate, getResponseAll, Product } from '../../../util/ApiClient'
  import ProductRegister from './ProductRegister.vue'

  const products = ref<Product[]>([])
  const activePage = ref(1)
  const totalItems = ref(0)
  const showForm = ref(false)
  const showEdit = ref(false)
  const showBlurredModal = ref(false)
  const idToDelete = ref(null)
  const findOne = ref(null)

  const url = '/api/rest/v1/products'

  const itemsPerPage = 10

  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage)))
  const openForm = () => {
    showForm.value = !showForm.value
  }

  const formatNumber = (value: number) => {
    return (value / 100).toFixed(2)
  }

  const openEdit = async (id: number) => {
    const urlOne = `${url}/${id}`
    findOne.value = (await findOneResponse(token, urlOne)).data
    showEdit.value = !showEdit.value
  }
  const closeEdit = () => {
    showEdit.value = !showEdit.value
    findOne.value = null
  }

  const getGender = (status: string) => {
    switch (status) {
      case 'men':
        return 'Masculino'
      case 'women':
        return 'Femenino'
      case 'kid':
        return 'niñes'

      default:
        return 'Unisex'
    }
  }

  function getStatusColor(status: string) {
    if (status === 'IN_SUPPLIER') {
      return { color: 'success', name: 'Suplido' }
    }
    if (status === 'IN_COMPENSE') {
      return { color: 'warning', name: 'Compensado' }
    }
    return { color: 'danger', name: 'Agotado' }
  }

  const token = loadUser().access_token
  const fetchProduct = async () => {
    const skip = (activePage.value - 1) * itemsPerPage

    try {
      const response = await getResponseAll(token, url, skip, itemsPerPage)
      products.value = response.data.result
      totalItems.value = response.data.total
      console.log(response.data.result)
    } catch (error) {
      console.log('here')
      console.error(error)
    }
  }

  const deleteProduct = (productId: any) => {
    idToDelete.value = productId
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

  watch(activePage, fetchProduct, { immediate: true })

  const refreshList = () => {
    fetchProduct()
  }
</script>
<template>
  <Suspense>
    <template #default>
      <div>
        <div v-if="!showForm && !showEdit">
          <va-card>
            <va-card-title>Producto</va-card-title>
            <va-card-content class="overflow-auto">
              <table class="va-table va-table--striped va-table--hoverable w-full will-change-transform">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Género</th>
                    <th>Tamaños del producto</th>
                    <th>Categoría</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Rebaja</th>
                    <th>Vistas</th>
                    <th>Valoración</th>
                    <th>Estado</th>
                    <th>Fecha de creado</th>
                    <th>Fecha de actualizado</th>
                    <th>&nbsp;&nbsp; &nbsp;Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="product in products" :key="product.id">
                    <td>{{ product.name }}</td>
                    <td>{{ getGender(product.gender) }}</td>
                    <td>{{ product.sizes }}</td>
                    <td>{{ product.categoryName }}</td>
                    <td>{{ product.stock }}</td>
                    <td>{{ formatNumber(product.price) }}</td>
                    <td>{{ formatNumber(product.priceCut) }}</td>
                    <td>{{ product.reviewsTotal }}</td>
                    <td>{{ product.stars }}</td>
                    <td>
                      <va-badge
                        :text="getStatusColor(product.status).name"
                        :color="getStatusColor(product.status).color"
                      />
                    </td>
                    <td>{{ formatDate(product.createdAt) }}</td>
                    <td>{{ formatDate(product.updatedAt) }}</td>
                    <td>
                      <va-button-group preset="plain" color="gray">
                        <va-button color="info" icon="material-icons-person"></va-button>
                        <va-button
                          color="dark"
                          icon="material-icons-mode_edit"
                          @click="openEdit(product.id)"
                        ></va-button>
                        <va-button
                          color="danger"
                          icon="material-icons-remove_circle"
                          @click="deleteProduct(product.id)"
                        >
                          <va-modal
                            v-model="showBlurredModal"
                            class="mr-2 mb-2"
                            :title="'¿Estás seguro?'"
                            :message="'Esta acción removerá de manera permanente al producto en la base de datos.'"
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
                  <va-button color="info" icon="material-icons-add_to_queue" @click="openForm"
                    >Agregar Producto</va-button
                  >
                  &nbsp;&nbsp;&nbsp;<va-button color="info" icon="material-icons-refresh" @click="refreshList" />
                </va-card-content>
              </va-card-content>
            </va-card-content>
          </va-card>
        </div>

        <ProductRegister :show-form="showForm" :open-form="openForm" :fetch-products="fetchProduct" />

        <!--       <UserEdit
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
        />-->
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
