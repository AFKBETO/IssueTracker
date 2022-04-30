<template>
    <div>
        <h1>Register</h1>
        <form @submit.prevent="register">
            <input 
                type="email" 
                placeholder="Enter your email" 
                name="email"
                v-model="email" /><br>
            <input 
                type="password"
                placeholder="Enter your password"
                name="password"
                v-model="password" /><br>
            <button type="submit">REGISTER</button>
        </form>
    </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        async register () {
            const response = await AuthenticationService.register({
                email: this.email,
                password: this.password
            })
            this.email = ''
            this.password = ''
            console.log(response.data)
        }
    }
}
</script>