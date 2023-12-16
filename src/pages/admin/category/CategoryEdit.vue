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
    categoryData: {
      type: Object,
      required: true,
    },
    fetchCategory: {
      type: Function,
      required: true,
    },
  })

  const category = computed(() => ({
    name: props.categoryData.name,
    id: props.categoryData.id,
  }))

  const name = ref(category.value.name)

  const toastDuration = ref(3000)
  const toastPosition = ref<ToastPosition>('bottom-right')

  function getInitialValues() {
    return {
      toastColor: 'rgb(21, 141, 227)',
      toastTitle: 'Accion Ejecutada',
      toastText: 'Usuario actualizado en el servidor correctamente',
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
  const validateData = (data: { name: string; generalCategory: boolean }) => {
    const schema = z.object({
      name: z.string(),
      generalCategory: z.boolean(),
    })

    return schema.parse(data)
  }

  const token = loadUser().access_token
  const sendData = async () => {
    const data = validateData({
      name: name.value,
      generalCategory: true,
    })
    const url = '/api/rest/v1/category/' + category.value.id
    try {
      await sendUpdateDataToServer(data, url, token)
      await props.fetchCategory()
      launchToast()
      props.closeProfile()
    } catch (error) {
      const failedValues = (await handleErrors(error as AxiosError<ErrorResult>))!
      toastColor.value = 'rgb(228, 34, 34)'
      toastTitle.value = failedValues.toastTitle
      toastText.value = failedValues.toastText

      await props.fetchCategory()
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
                v-model="name"
                placeholder="Entrada de Texto"
                color="info"
                label="Nombre de categoría"
                clearable
              >
                <template #prepend>
                  <va-icon color="info" name="entypo-tag" />
                </template>
              </va-input>
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
