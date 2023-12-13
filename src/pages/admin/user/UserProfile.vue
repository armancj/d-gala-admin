<script setup lang="ts">
  import { computed, ref } from 'vue'
  import data from '../ui/lists/data.json'

  const props = defineProps({
    openProfile: {
      type: Function,
      required: true,
    },
    closeProfile: {
      type: Function,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
    showProfile: {
      type: Boolean,
      required: true,
    },
  })

  const customers = ref(data.slice(0, 5))

  const user = computed(() => ({
    username: props.userData.username,
    firstname: props.userData.firstname,
    lastname: props.userData.lastname,
    email: props.userData.email,
    phone: props.userData.phone,
    role: props.userData.role,
    status: props.userData.status,
    createdAt: props.userData.createdAt,
  }))

  // console.log(props.userData.profile)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'info'
      case 'Inactivo':
        return 'danger'
      default:
        return 'gray'
    }
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
</script>

<template>
  <div v-if="showProfile" class="profile-container">
    <va-card>
      <va-card-title>Perfil de Usuario</va-card-title>
      <va-card-content>
        <div class="flex items-center justify-between">
          <div class="profile-content">
            <va-avatar>
              <img :src="customers[0].picture" :alt="customers[0].name" />
            </va-avatar>
            <h2>{{ user.username }}</h2>
            <p>Nombre: {{ user.firstname }}</p>
            <p>Apellido: {{ user.lastname }}</p>
            <p>Email: {{ user.email }}</p>
            <p>Teléfono: {{ user.phone }}</p>
            <p>Rol: <va-badge :text="getRoles(user.role)" color="info" /></p>
            <p>Estado: <va-badge :text="user.status" color="getStatusColor(user.status)" /></p>
            <p>Fecha de creación: {{ user.createdAt }}</p>
          </div>
          <va-button class="self-end profile-button" color="info" icon="material-icons-arrow_back" @click="closeProfile"
            >Regresar</va-button
          >
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<style scoped lang="scss">
  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
  }

  p {
    font-size: 16px;
  }

  .profile-container {
    animation: fadeIn 0.5s;
  }

  .profile-content {
    transition: all 0.3s ease;
  }

  .profile-button {
    transition: all 0.3s ease;
    animation: slideIn 0.5s;
  }

  .square-avatar {
    width: 100px;
    height: 100px;
    border-radius: 0;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(100px);
    }
    to {
      transform: translateY(0);
    }
  }
</style>
