<template>
    <div>
        <h1>Register</h1>
        <form @submit.prevent="register">
            <input 
                type="email" 
                placeholder="Enter your email" 
                name="email"
                v-model="registerDetails.email" required /><br>
            <input 
                type="password"
                placeholder="Enter your password"
                name="password"
                v-model="registerDetails.password" required /><br>
            <input 
                type="password"
                placeholder="Reenter your password"
                name="repeat-password"
                v-model="repeatPassword" /><br>
            <button class="btn btn-primary active" :disabled="repeatPasswordError" type="submit">REGISTER</button>
        </form>
        <div class="text-danger" v-html="error" />
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