<script setup lang="ts">
  import { ref } from 'vue'
  import { ToastPosition, useToast } from 'vuestic-ui'
  import * as z from 'zod'
  import { ErrorResult, handleErrors, sendDataToServer } from '../../../util/ApiClient'
  import { loadUser } from '../../../stores/global-store'
  import { AxiosError } from 'axios'

  const { init } = useToast()

  const url = '/api/rest/v1/category'
  const name = ref('')

  const props = defineProps({
    showForm: {
      type: Boolean,
      required: true,
    },
    openForm: {
      type: Function,
      required: true,
    },
    fetchCategory: {
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
      toastText: 'Categoría guardada en el servidor correctamente',
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
    try {
      await sendDataToServer(data, url, token)
      await props.fetchCategory()
      launchToast()
      props.openForm()

      name.value = ''
    } catch (error) {
      const failedValues = (await handleErrors(
        error as AxiosError<ErrorResult>,
        `El nombre de la categoría: ${name.value}, ya se encuentra en el systema `,
      ))!
      toastColor.value = 'rgb(228, 34, 34)'
      toastTitle.value = failedValues.toastTitle
      toastText.value = failedValues.toastText

      await props.fetchCategory()
      launchToast()

      const resetValues = getInitialValues()
      toastColor.value = resetValues.toastColor
      toastTitle.value = resetValues.toastTitle
      toastText.value = resetValues.toastText
      name.value = ''
    }
  }
</script>

<template>
  <div v-if="showForm">
    <va-card class="col-span-14">
      <va-card-title>Registro de Categorías</va-card-title>
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
            <va-button color="danger" @click="openForm"> cancelar </va-button>
          </va-card-content>
        </form>
      </va-card-content>
    </va-card>
  </div>
</template>

<style scoped lang="scss"></style>
