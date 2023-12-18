<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { ToastPosition, useToast } from 'vuestic-ui'
  import * as z from 'zod'
  import {
    CategoriesResult,
    ErrorResult,
    getResponseAll,
    handleErrors,
    sendDataToServer,
  } from '../../../util/ApiClient'
  import { loadUser } from '../../../stores/global-store'
  import { AxiosError } from 'axios'

  const { init } = useToast()

  const url = '/api/rest/v1/products'

  const props = defineProps({
    showForm: {
      type: Boolean,
      required: true,
    },
    openForm: {
      type: Function,
      required: true,
    },
    fetchProducts: {
      type: Function,
      required: true,
    },
  })

  const name = ref('')
  const content = ref('')
  const price = ref('')
  const slug = ref('')
  const stock = ref('1')
  const sizes = ref<string[]>([])
  const tags = ref<string[]>([])
  const categoryId = ref<CategoriesResult>()
  const component = ref<string[]>([])

  const categories = ref([])

  onMounted(async () => {
    try {
      const response = await getResponseAll(token, '/api/rest/v1/category', 1, 100)
      categories.value = response.data.result
    } catch (error) {
      console.error(error)
    }
  })

  const messages = ref(['Aqui va una pequeña descripcion de lo que contiene el producto.'])

  const status = ref([
    { label: 'IN_SUPPLIER', description: 'Producto Suplido' },
    { label: 'IN_COMPENSE', description: 'Producto Compensado' },
    { label: 'IN_FALT', description: 'Producto Agotado' },
  ])

  const statusSelectLabel = ref(status.value[0])

  const gender = ref([
    { label: 'men', description: 'Masculino' },
    { label: 'women', description: 'Femenino' },
    { label: 'Unisex', description: 'Unisex' },
  ])

  const genderSelectLabel = ref(gender.value[0])

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

  const validateData = (data: {
    name: string
    content: string
    price: string
    slug: string
    gender: string
    stock: string
    status: string
    sizes: string[]
    tags: string[]
    categoryId?: number
    component?: string[]
  }) => {
    const schema = z.object({
      name: z.string(),
      price: z.string(z.number()),
      slug: z.string(),
      status: z.string(),
      gender: z.string(),
      content: z.string(),
      stock: z.string(z.number()),
      sizes: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      categoryId: z.number(),
      component: z.array(z.string()).optional(),
    })

    return schema.parse(data)
  }

  const resetForm = () => {
    name.value = ''
    content.value = ''
    price.value = ''
    slug.value = ''
    sizes.value = []
    tags.value = []
    categoryId.value = undefined
    component.value = []
    stock.value = '1'
    tabValue.value = -1
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

  const token = loadUser().access_token
  const sendData = async () => {
    if (buttonText.value === 'Guardar') {
      const data = validateData({
        name: name.value,
        content: content.value,
        price: price.value,
        slug: slug.value,
        sizes: sizes.value,
        tags: tags.value,
        categoryId: categoryId.value?.id,
        gender: genderSelectLabel.value.label,
        status: statusSelectLabel.value.label,
        stock: stock.value,
      })
      try {
        const response = await sendDataToServer(data, url, token)
        await props.fetchProducts()
        launchToast()
        props.openForm()

        resetForm()
      } catch (error) {
        const failedValues = (await handleErrors(error as AxiosError<ErrorResult>))!
        toastColor.value = 'rgb(228, 34, 34)'
        toastTitle.value = failedValues.toastTitle
        toastText.value = failedValues.toastText

        await props.fetchProducts()
        launchToast()

        const resetValues = getInitialValues()
        toastColor.value = resetValues.toastColor
        toastTitle.value = resetValues.toastTitle
        toastText.value = resetValues.toastText
      }
    }
    nextTab()
  }

  const tabTitles = ref(['Datos del Producto', 'Colores e imagenes del Producto', 'Three'])
  const tabValue = ref(0)
  const buttonText = ref('Continuar') // El texto inicial del botón

  const nextTab = () => {
    if (tabValue.value < tabTitles.value.length - 1) {
      tabValue.value++
    }
  }

  const newTag = ref('')
  const newComponent = ref('')
  const newSize = ref('')

  const addTag = () => {
    tags.value.push(newTag.value)
    newTag.value = '' // reset the input field after adding the tag
  }

  const removeTag = (tagToRemove: string) => {
    const index = tags.value.indexOf(tagToRemove)
    if (index !== -1) {
      tags.value.splice(index, 1)
    }
  }
  const addComponent = () => {
    component.value.push(newComponent.value)
    newComponent.value = '' // reset the input field after adding the tag
  }

  const removeComponet = (componentToRemove: string) => {
    const index = component.value.indexOf(componentToRemove)
    if (index !== -1) {
      component.value.splice(index, 1)
    }
  }

  const addSize = () => {
    sizes.value.push(newSize.value)
    newSize.value = '' // reset the input field after adding the tag
  }
  const removeSize = (sizeToRemove: string) => {
    const index = sizes.value.indexOf(sizeToRemove)
    if (index !== -1) {
      sizes.value.splice(index, 1)
    }
  }

  const priceFormat = ref('')

  const handleInput = (event: InputEvent) => {
    const valueOriginal = (event.target as HTMLInputElement).value.replace('.', '')
    if (!isNaN(parseInt(valueOriginal)) && valueOriginal.trim() !== '') {
      const valueFormat = (parseInt(valueOriginal) / 100).toFixed(2)
      priceFormat.value = valueFormat
    } else {
      priceFormat.value = '0.00'
    }
  }

  watch(tabValue, (newValue) => {
    buttonText.value = newValue === tabTitles.value.length - 1 ? 'Guardar' : 'Continuar'
  })
</script>

<template>
  <div v-if="showForm">
    <va-card class="col-span-12 overflow-auto">
      <va-card-title>Registro de Product</va-card-title>
      <va-card-content>
        <va-tabs v-model="tabValue" class="w-fill" grow>
          <template #tabs>
            <va-tab v-for="title in tabTitles.slice(0, 3)" :key="title">
              {{ title }}
            </va-tab>
          </template>

          <div v-if="tabValue === 0">
            <va-divider />
            <va-card-content class="overflow-auto">
              <form v-if="showForm">
                <div class="grid grid-cols-12 gap-6">
                  <div class="flex md:col-span-2 sm:col-span-6 col-span-12">
                    <va-input
                      v-model="name"
                      placeholder="Entrada de Texto"
                      color="gray"
                      label="Nombre del producto"
                      clearable
                    >
                      <template #prepend>
                        <va-icon color="gray" name="maki-grocery-store" /> &nbsp;&nbsp;&nbsp;&nbsp;
                      </template>
                    </va-input>
                  </div>
                  <div class="flex md:col-span-2 col-span-12">
                    <va-select
                      v-model="genderSelectLabel"
                      text-by="description"
                      label="Genero"
                      track-by="label"
                      :options="gender"
                    >
                      <template #prepend>
                        <va-icon color="gray" name="ion-md-female" /> &nbsp;&nbsp;&nbsp;&nbsp;
                      </template>
                    </va-select>
                  </div>
                  <div class="flex md:col-span-2 sm:col-span-6 col-span-12">
                    <va-input
                      v-model="price"
                      placeholder="Entrada de Texto"
                      label="Precio"
                      clearable
                      @input="handleInput"
                    >
                      <template #prepend>
                        <va-icon color="grey" name="material-icons-attach_money" />
                      </template>
                    </va-input>
                  </div>
                  <div class="flex md:col-span-2 col-span-12">
                    <va-select
                      v-model="statusSelectLabel"
                      text-by="description"
                      label="Estado del producto"
                      track-by="label"
                      :options="status"
                    >
                      <template #prepend>
                        <va-icon color="grey" name="fa-solid fa-truck" />
                      </template>
                    </va-select>
                  </div>
                  <div class="flex md:col-span-2 col-span-12">
                    <va-counter v-model="stock" label="Cantidad" margins="200" flat buttons manual-input />
                  </div>
                  <div class="flex md:col-span-3 col-span-12">
                    <va-select
                      v-model="categoryId"
                      label="Categoría"
                      searchable
                      text-by="name"
                      track-by="id"
                      :options="categories"
                      clearable
                    />
                  </div>
                </div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div class="grid grid-cols-3 gap-6 md:col-span-6 col-span-12">
                  <va-input
                    v-model="content"
                    placeholder="Entrada de Texto"
                    label="Contenido"
                    :messages="messages"
                    clearable
                  >
                    <template #prepend>
                      <va-icon color="gray" name="entypo-book-open" /> &nbsp;&nbsp;&nbsp;&nbsp;
                    </template>
                  </va-input>
                </div>
              </form>
            </va-card-content>
            <va-divider />
            <div class="flex md:col-span-2 sm:col-span-6 col-span-12">
              <va-card class="col-span-12 sm:col-span-6" stripe stripe-color="success">
                <va-card-title text-color="success" preset="sss">Etiquetas del Producto</va-card-title>
                <va-card-content class="overflow-auto flex md:col-span-2 sm:col-span-6 col-span-12">
                  <va-card-content>
                    <div class="flex md:col-span-2 sm:col-span-6 col-span-12">
                      <va-input
                        v-model="newTag"
                        class="mb-2"
                        label="Etiqueta"
                        type="text"
                        color="success"
                        placeholder="Introduzca la etiqueta"
                        maxlength="12"
                      >
                        <template #prepend>
                          <va-icon color="success" name="entypo-tag" />
                        </template>
                      </va-input>
                    </div>
                    <va-button class="mb-2" color="success" @click="addTag()"> Agregar nueva Etiqueta </va-button>
                  </va-card-content>
                  <div class="mb-8">
                    <table class="va-table va-table--striped va-table--hoverable w-full will-change-transform">
                      <tbody>
                        <tr v-for="(tag, index) in tags" :key="index">
                          <td>
                            {{ tag }}
                            <va-icon name="md_close" color="info" class="ml-2 cursor-pointer" @click="removeTag(tag)" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </va-card-content>
              </va-card>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <va-card class="col-span-12 sm:col-span-6" stripe stripe-color="info">
                <va-card-title text-color="info" preset="sss">Componentes del producto</va-card-title>
                <va-card-content class="col-span-12 lg:col-span-6 flex justify-end">
                  <va-card-content>
                    <div class="flex md:col-span-2 sm:col-span-6 col-span-12">
                      <va-input
                        v-model="newComponent"
                        class="mb-2"
                        color="info"
                        type="text"
                        label="componente"
                        maxlength="12"
                        placeholder="Introduzca el componente"
                      >
                        <template #prepend>
                          <va-icon color="info" name="vuestic-iconset-components" />
                        </template>
                      </va-input>
                    </div>
                    <va-button class="mb-2" color="info" @click="addComponent()"> Agregar nuevo Componente </va-button>
                  </va-card-content>
                  <div class="mb-8">
                    <table class="va-table va-table--striped va-table--hoverable w-full will-change-transform">
                      <tbody>
                        <tr v-for="(comp, index) in component" :key="index">
                          <td>
                            {{ comp }}
                            <va-icon
                              name="md_close"
                              color="info"
                              class="ml-2 cursor-pointer"
                              @click="removeComponet(comp)"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </va-card-content>
              </va-card>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <va-card class="col-span-12 sm:col-span-6" stripe stripe-color="warning">
                <va-card-title text-color="warning" preset="sss">Tamaños del producto</va-card-title>
                <va-card-content class="overflow-auto col-span-12 lg:col-span-6 flex justify-end">
                  <va-card-content>
                    <div class="flex md:col-span-2 sm:col-span-6 col-span-12">
                      <va-input
                        v-model="newSize"
                        color="warning"
                        class="mb-2"
                        type="text"
                        label="tamaño"
                        placeholder="Introduzca el tamaño"
                        maxlength="12"
                      >
                        <template #prepend>
                          <va-icon color="warning" name="ion-ios-resize" />
                        </template>
                      </va-input>
                    </div>
                    <va-button class="mb-2" color="warning" @click="addSize()"> Agregar nuevo Tamaño </va-button>
                  </va-card-content>
                  <div class="mb-8">
                    <table class="va-table va-table--striped va-table--hoverable w-full will-change-transform">
                      <tbody>
                        <tr v-for="(size, index) in sizes" :key="index">
                          <td>
                            {{ size }}
                            <va-icon
                              name="md_close"
                              color="info"
                              class="ml-2 cursor-pointer"
                              @click="removeSize(size)"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </va-card-content>
              </va-card>
            </div>
          </div>

          <div v-if="tabValue === 1">
            <!-- Aquí va el contenido de la segunda pestaña -->
          </div>

          <div v-if="tabValue === 2">
            <!-- Aquí va el contenido de la tercera pestaña -->
          </div>

          <va-card-content class="my-3 flex flex-wrap items-center gap-2 justify-end pr-40">
            <va-button color-presentation color="info" :variant="['gradient', 'hovered']" @click="sendData">
              {{ buttonText }}
            </va-button>
            <va-button color="danger" @click="openForm"> cancelar </va-button>
          </va-card-content>
        </va-tabs>
      </va-card-content>
    </va-card>
  </div>
</template>

<style lang="scss" scoped>
  .tree-node-editable {
    .va-input {
      width: auto;
    }
  }
</style>
