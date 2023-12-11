<script>
  export default {
    name: 'UserProfile',
  }
</script>

<template>
  <div>
    <h1>User Profile</h1>
    <p>This is a user profile page.</p>
    <va-button color="info" icon="material-icons-person" @click="openProfile"></va-button>
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
</style>
