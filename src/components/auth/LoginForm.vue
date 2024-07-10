<template>
  <div class="div-form">
    <div class="logo">
      <img class="logo-login" src="../../assets/logo_login.png" />
    </div>
    <div class="form">
      <div class="form-center">
        <div class="form-item">
          <h3 class="title-login">Đăng nhập</h3>
        </div>
        <label class="label-login-form">Email</label>
        <div class="form-item">
          <input v-model="account.email" class="form-input" type="text" placeholder="Nhập" />
        </div>
        <label class="label-login-form">Password</label>
        <div class="form-item">
          <input v-model="account.password" class="form-input" type="password" placeholder="Nhập" />
        </div>
        <div class="form-item center">
          <a class="forget-password">Bạn quên mật khẩu ?</a>
        </div>
        <div class="form-item center" @click="login">
          <button class="button-login">Đăng nhập</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RepositoryFactory from '../../apirepository/RepositoryFactory'

export default {
  data() {
    return {
      account: {
        email: '',
        password: ''
      }
    }
  },

  methods: {
    login() {
      const payload = {
        email: this.account.email,
        password: this.account.password
      }
      RepositoryFactory.get('auth')
        .login(payload)
        .then((response) => {
          localStorage.setItem('loginInfo', JSON.stringify(response.data.data.data))
        })
        .then(() => {
          this.goToUserView()
        })
        .catch((error) => {
          console.log(error)
        })
    },

    goToUserView() {
      this.$router.push({ name: 'user' })
    }
  }
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  background-color: #fff;
  justify-content: center;
  align-items: center;
}

.div-form {
  width: 100%;
  flex-direction: column;
  padding: 106px 30px 30px;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-item {
  margin: 10px;
  display: flex;
  width: 100%;
}

.logo-login {
  width: 64px;
}

.title-login {
  font-family: 'Be Vietnam Pro';
  font-size: 25px;
  font-weight: 600;
  line-height: 36px;
  text-align: left;
  gap: 0px;
  opacity: 0px;
  color: black;
}

.label-login-form {
  margin-left: 10px;
  color: black;
}

.form-input {
  width: 100%;
  width: Fill (400px) px;
  height: Hug (38px) px;
  padding: 8px 12px 8px 12px;
  gap: 8px;
  border-radius: 4px 4px 4px 4px;
  border: 1px 0px 0px 0px;
  opacity: 0px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  color: #333;
}

.form-input:focus {
  outline: #3a74f6;
  border: 1px solid #3a74f6;
}

.button-login {
  width: 100%;
  width: Fixed (400px) px;
  height: Hug (44px) px;
  padding: 11px 14px 11px 14px;
  gap: 8px;
  border-radius: 4px 4px 4px 4px;
  opacity: 0px;
  border: none;
  background-color: #3a74f6;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.center {
  justify-content: center;
  align-items: center;
}

.forget-password {
  font-family: 'Be Vietnam Pro';
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  text-align: left;
  cursor: pointer;
}

.forget-password:hover {
  background-color: inherit;
}

.form-center {
  width: 50%;
}
</style>
