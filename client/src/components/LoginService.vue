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
            <button class="btn btn-dark active w-auto" :disabled="errorForm" type="submit">LOGIN</button>
        </form>
        <div class="text-danger w-60 text-center" v-if="errEmail">
            <small>You must provide a valid email address</small>
        </div>
        <div class="text-danger w-60 text-center" v-if="errMessage">
            <small>{{ errMessage }}</small>
        </div>
    </div>
</template>

<script>
import { login, setAuthToken } from '@/services/AuthenticationService.js'
import { emailValidator } from '@/services/FormValidator.js'

export default {
    data() {
        return {
            loginDetails: {
                email: '',
                password: ''
            },
            errEmail: false,
            errMessage: null
        }
    },
    watch: {
        'loginDetails.email': {
            handler() {
                this.errEmail = emailValidator(this.loginDetails.email)
            }
        }
    },
    methods: {
        async login () {
            try{
                this.errEmail = false
                const response = await login({
                    email: this.loginDetails.email,
                    password: this.loginDetails.password
                })
                this.loginDetails.email = ''
                this.loginDetails.password = ''
                setAuthToken(response.data.token)
                console.log(response.data)
                this.$router.push('/')
            }
            catch (err) {
                this.errMessage = err.response.data.error
                this.loginDetails.password = ''
                setTimeout(() => {
                    this.errMessage = null
                }, 4000)
                return
            }
            
        }    
    },
    computed: {
        errorForm(){
            return !this.loginDetails.email || !this.loginDetails.password || this.errEmail
        }
    }
}
</script>