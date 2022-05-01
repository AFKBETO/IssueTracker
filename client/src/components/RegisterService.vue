<template>
    <div class="container-sm p-5 my-5">
        <div class="h1 text-white bg-primary p-2 my-0">Register</div>
        <form @submit.prevent="register" class="d-flex align-items-center justify-content-center flex-column border pb-3">
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
            <button class="btn btn-primary active w-auto" :disabled="repeatPasswordError" type="submit">REGISTER</button>
            <div class="text-danger" v-html="error" />
        </form>
        
    </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
    data() {
        return {
            registerDetails: {
                email: '',
                password: ''
            },
            repeatPassword: '',
            repeatPasswordError: true,
            error: null
            
        }
    },
    watch: {
        repeatPassword: {
            handler(){
                if (!this.registerDetails.password || this.repeatPassword != this.registerDetails.password) {
                    this.repeatPasswordError = true
                }
                else {
                    this.repeatPasswordError = false
                }
            }
        }
    },
    methods: {
        async register () {
            try {
                    const response = await AuthenticationService.register({
                        email: this.registerDetails.email,
                        password: this.registerDetails.password
                    })
                    this.registerDetails.email = ''
                    this.registerDetails.password = ''
                    this.repeatPassword = ''
                    this.repeatPasswordError = true
                    console.log(response.data)
                }
            
            catch (err) {
                this.error = err.response.data.error
                this.registerDetails.password = ''
                this.repeatPassword = ''
                setTimeout(() => {
                    this.error = null
                }, 5000)
            }
        }    
    },
}
</script>