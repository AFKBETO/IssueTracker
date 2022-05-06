<template>
    <div class="container-sm p-5 my-5 justify-content-center">
        <div class="h1 text-white bg-dark p-2 my-0">Login</div>
        <form @submit.prevent="login" class="d-flex align-items-center justify-content-center flex-column border pb-3" novalidate="true">
            <div class="form-floating w-50 my-3">
                <input
                    type="email"
                    class="form-control"
                    placeholder="Enter email"
                    name="email"
                    v-model="loginDetails.email"
                    required>
                <label for="email">Email</label>
            </div>
            <div class="form-floating w-50 my-3">
                <input
                    type="password"
                    class="form-control"
                    placeholder="Enter password"
                    name="password"
                    v-model="loginDetails.password"
                    required>
                <label for="password">Password</label>
            </div>
            <button class="btn btn-dark active w-auto" type="submit">LOGIN</button>
        </form>
        <div class="text-danger w-60 text-center" v-if="errPassword.length">
            <div v-for="line in errPassword" :key="line.message"><small>{{ line.message }}</small></div>
        </div>
        <div class="text-danger w-60 text-center" v-if="errEmail">
            <small>You must provide a valid email address</small>
        </div>
    </div>
</template>

<script>
import { login, setAuthToken } from '@/services/AuthenticationService.js'
import { passwordValidator, emailValidator } from '@/services/FormValidator.js'

export default {
    data() {
        return {
            loginDetails: {
                email: '',
                password: ''
            },
            errEmail: false,
            errPassword: []
        }
    },
    methods: {
        async login () {
            const errEmail = emailValidator(this.loginDetails.email)
            if (errEmail) {
                this.errEmail = errEmail
                setTimeout(() => {
                    this.errEmail = null
                }, 3000)
                return
            }
            const errPassword = passwordValidator(this.loginDetails.password)
            if (errPassword.length) {
                this.errPassword = errPassword
                this.loginDetails.password = ''
                setTimeout(() => {
                    this.errPassword = []
                }, 3000)
                return
            }
            this.errEmail = null
            this.errPassword = []
            const response = await login({
                email: this.loginDetails.email,
                password: this.loginDetails.password
            })
            this.loginDetails.email = ''
            this.loginDetails.password = ''
            setAuthToken(response.data.token)
            console.log(response.data)
            this.$emit('login')
            this.$router.push('/')
           
            
            
        }    
    },
}
</script>