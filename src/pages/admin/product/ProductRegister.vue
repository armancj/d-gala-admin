<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { ToastPosition, useToast } from 'vuestic-ui'
  import * as z from 'zod'
  import { ErrorResult, handleErrors, sendDataToServer } from '../../../util/ApiClient'
  import { loadUser } from '../../../stores/global-store'
  import { AxiosError } from 'axios'
  import TreeViewEditablePreview from '../ui/tree-view/TreeViewEditablePreview.vue'

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
  const sizes = ref([])
  const tags = ref<string[]>([])
  const tag = ref('')
  const categoryId = ref('')
  const component = ref<string[]>([])

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
    status: string
    sizes: string[]
    tags: string[]
    categoryId: string
    component: string[]
  }) => {
    const schema = z.object({
      name: z.string(),
      price: z.string(z.number()),
      role: z.string(),
      slug: z.string(),
      sizes: z.array(z.string()),
      tags: z.array(z.string()),
      categoryId: z.string(),
      component: z.array(z.string()),
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
    categoryId.value = ''
    component.value = []
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
        categoryId: categoryId.value,
        component: component.value,
        gender: genderSelectLabel.value.label,
        status: statusSelectLabel.value.label,
      })
      try {
        const response = await sendDataToServer(data, url, token)
        await props.fetchProducts()
        launchToast()
        props.openForm()

        resetForm()

        console.log(response)
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

  const tabTitles = ref(['One', 'Two', 'Three'])
  const tabValue = ref(0)
  const buttonText = ref('Continuar') // El texto inicial del botón

  const nextTab = () => {
    if (tabValue.value < tabTitles.value.length - 1) {
      tabValue.value++
    }
  }

  const nodes = ref([
    { label: 'Tags', hasChildren: true, children: tags.value.map((tag) => ({ label: tag, hasChildren: false })) },
  ])
  const expandedNodes = ref(nodes.value[0])

  const addTag = () => {
    tags.value.push(tag.value)
    nodes.value[0].children.push({ label: tag.value, hasChildren: false })
  }

  const removeTag = (nodeToRemove: { label: string; hasChildren: boolean }) => {
    const index = tags.value.indexOf(nodeToRemove.label)
    if (index !== -1) {
      tags.value.splice(index, 1)
      nodes.value[0].children.splice(index, 1)
    }
  }

  watch(tabValue, (newValue) => {
    buttonText.value = newValue === tabTitles.value.length - 1 ? 'Guardar' : 'Continuar'
  })
</script>

<template>
  <div v-if="showForm">
    <va-card class="col-span-12">
      <va-card-title>Registro de Product</va-card-title>
      <va-card-content>
        <va-tabs v-model="tabValue" class="w-fill" grow>
          <template #tabs>
            <va-tab v-for="title in tabTitles.slice(0, 3)" :key="title">
              {{ title }}
            </va-tab>
          </template>

          <div v-if="tabValue === 0">
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
                <div class="flex md:col-span-3 sm:col-span-6 col-span-12">
                  <va-input v-model="content" placeholder="Entrada de Texto" label="Contenido" clearable>
                    <template #prepend>
                      <va-icon color="gray" name="entypo-book-open" /> &nbsp;&nbsp;&nbsp;&nbsp;
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
                  <va-input v-model="price" placeholder="Entrada de Texto" label="Precio" clearable>
                    <template #prepend>
                      <va-icon color="grey" name="material-icons-attach_money" />
                    </template>
                  </va-input>
                </div>
                <div>
                  <ul>
                    <li v-for="(item, index) in tags" :key="index">{{ item }}</li>
                  </ul>
                </div>
                <div class="flex md:col-span-4 sm:col-span-6 col-span-12">
                  <va-input v-model="slug" type="email" label="Correo Electrónico" clearable>
                    <template #prepend>
                      <va-icon color="grey" name="email" />
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
                  />
                </div>
                <div class="flex md:col-span-2 sm:col-span-3 col-span-12">
                  <va-date-input v-model="dateInput.simple" :label="'Fecha de creado'" manual-input clearable />
                </div>
              </div>
            </form>
            <div class="flex md:col-span-2 sm:col-span-6 col-span-12">
              <va-card-content>
                <va-tree-view v-model:expanded="expandedNodes" :nodes="nodes">
                  <template #content="{ node }">
                    <div v-if="!node.hasChildren" class="tree-node-editable flex flex-1 flex-wrap items-center">
                      <va-icon name="md_close" color="info" class="ml-2 cursor-pointer" @click="removeTag(node)" />
                    </div>
                  </template>
                </va-tree-view>
                <va-input v-model="tag" placeholder="Enter new tag" />
                <va-button class="mb-2" @click="addTag()"> Add new tag </va-button>
              </va-card-content>
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

<style scoped lang="scss"></style>
