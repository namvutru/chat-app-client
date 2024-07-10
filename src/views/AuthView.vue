<template>
  <div class="auth-view">
    <div class="auth-image">
      <AuthImage></AuthImage>
    </div>
    <div class="auth-form">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import AuthImage from '@/components/auth/AuthImage.vue'
export default {
  components: {
    AuthImage
  }
}
</script>

<style scoped>
.auth-view {
  width: 100%;
  height: 100vh;
  display: flex;
}

.auth-image {
  display: block;
  width: 60%;
  height: 100%;
  @media (max-width: 600px) {
    display: none;
  }
}

.auth-form {
  background-color: #fff;
  display: block;
  width: 40%;
  min-width: 400px;
  height: 100%;
  align-items: center;
}
</style>
