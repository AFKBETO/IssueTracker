<template>
    <div class="container-sm p-5 my-5">
        <div class="h1 text-white bg-dark p-2 my-0">Register</div>
        <form @submit.prevent="register" class="d-flex align-items-center justify-content-center flex-column border pb-3">
            <div class="form-floating w-50 my-3">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Enter display name"
                    name="name"
                    v-model="registerDetails.name"
                    required>
                <label for="name">Name</label>
            </div>
            <div class="form-floating w-50 my-3">
                <input
                    type="email"
                    class="form-control"
                    placeholder="Enter email"
                    name="email"
                    v-model="registerDetails.email"
                    required>
                <label for="email">Email</label>
            </div>
            <div class="form-floating w-50 my-3">
                <input
                    type="password"
                    class="form-control"
                    placeholder="Enter password"
                    name="password"
                    v-model="registerDetails.password"
                    required>
                <label for="password">Password</label>
            </div>
            <div class="form-floating w-50 my-3">
                <input
                    type="password"
                    class="form-control"
                    placeholder="Repeat password"
                    name="repeat-password"
                    v-model="repeatPassword"
                    required>
                <label for="repeat-password">Repeat password</label>
            </div>
            <button class="btn btn-dark active w-auto" :disabled="errorForm" type="submit">REGISTER</button>
            <div class="text-danger w-60 text-center" v-if="errEmail">
                <small>You must provide a valid email address</small>
            </div>
            <div class="text-danger w-60 text-center" v-if="errPassword.length">
                <div v-for="line in errPassword" :key="line.message"><small>{{ line.message }}</small></div>
            </div>
            <div class="text-danger w-60 text-center" v-if="repeatPasswordError">
                <small>Repeat password is not correct</small>
            </div>
            <div class="text-danger w-60 text-center" v-if="errMessage">
                <small>{{ errMessage }}</small>
            </div>
        </form>
        
    </div>
</template>

<script>
import { register } from '@/services/AuthenticationService.js'
import { passwordValidator, emailValidator } from '@/services/FormValidator.js'
export default {
    data() {
        return {
            registerDetails: {
                name: '',
                email: '',
                password: ''
            },
            repeatPassword: '',
            repeatPasswordError: false,
            errEmail: false,
            errPassword: [],
            errMessage: null
        }
    },
    watch: {
        repeatPassword: {
            handler(){
                this.repeatPasswordError = this.repeatPassword != this.registerDetails.password
            }
        },
        'registerDetails.email': {
            handler() {
                this.errEmail = emailValidator(this.registerDetails.email)
            }
        },
        'registerDetails.password': {
            handler() {
                this.errPassword = passwordValidator(this.registerDetails.password)
            }
        }
    },
    methods: {
        async register () {
            try {
                this.errEmail = false
                this.errPassword = []
                const response = await register(this.registerDetails)
                this.registerDetails.name = ''
                this.registerDetails.email = ''
                this.registerDetails.password = ''
                this.repeatPassword = ''
                this.repeatPasswordError = true
                console.log(response.data)
                this.$router.push('/')
            }
            catch (err) {
                this.errMessage = err.response.data.error
                this.registerDetails.password = ''
                this.repeatPassword = ''
                setTimeout(() => {
                    this.errMessage = null
                }, 4000)
                return
            }

        }    
    },
    computed: {
        errorForm(){
            return !this.registerDetails.name ||
                    !this.registerDetails.email ||
                    !this.registerDetails.password ||
                    !this.repeatPassword ||
                    this.errEmail ||
                    this.errPassword.length > 0 ||
                    this.repeatPasswordError
        }
    }
}
</script>