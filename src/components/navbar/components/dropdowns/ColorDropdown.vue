<template>
  <!--  <va-button
    v-model="currentTheme"
    class="color-dropdown__toggle color-dropdown__content pl-8 pr-8 pt-2 pb-2"
    :options="themeOptions"
    outline
    round
    size="small"
    icon="user"
  />-->
  <va-button
    v-model="currentTheme"
    class="color-dropdown__content pl-5 pr-5 pt-2 pb-2"
    color="transparent"
    :icon="getIcon"
    @click="functionMode"
  >
  </va-button>

  <!--  <template #anchor>
    <va-icon-color />
  </template>-->
  <!--      <table class="w-full my-4">
        <color-dropdown-item
          v-for="colorName in colorNames"
          :key="colorName"
          class="color-picker-dropdown"
          :color-name="colorName"
        />
      </table>-->
</template>

<script setup lang="ts">
  import VaIconColor from '../../../icons/VaIconColor.vue'
  import ColorDropdownItem from './ColorDropdownItem.vue'
  import { useColors } from 'vuestic-ui'
  import { computed, ref, watchEffect } from 'vue'

  const { presets, applyPreset, colors } = useColors()

  const currentTheme = ref('light')

  const getIcon = computed(() => {
    return currentTheme.value === 'light' ? 'ion-ios-moon' : 'ion-ios-sunny'
  })

  const functionMode = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  }

  watchEffect(() => {
    applyPreset(currentTheme.value)
  })

  const themeOptions = Object.keys(presets.value).map((themeName) => ({
    value: themeName,
    label: themeName,
  }))
  const colorNames = Object.keys(colors)
</script>

<style lang="scss" scoped>
  .color-dropdown {
    &__icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .va-dropdown__anchor {
      display: inline-block;
    }

    &__toggle {
      width: 100%;
      display: flex;
      justify-content: stretch;
    }
  }

  .button-restore {
    display: flex;
    margin: 0.375rem auto;
  }
</style>
