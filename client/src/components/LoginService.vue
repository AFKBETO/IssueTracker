<template>
    <div class="container-sm p-5 my-5">
        <div class="h1 text-white bg-dark p-2 my-0">Login</div>
        <form @submit.prevent="login" class="d-flex align-items-center justify-content-center flex-column border pb-3">
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
            <div class="text-danger" v-html="error" />
        </form>
        
    </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
    data() {
        return {
            loginDetails: {
                email: '',
                password: ''
            },
            error: null
        }
    },
    methods: {
        async login () {
            try {
                    const response = await AuthenticationService.login({
                        email: this.loginDetails.email,
                        password: this.loginDetails.password
                    })
                    this.loginDetails.email = ''
                    this.loginDetails.password = ''
                    console.log(response.data)
                    this.$emit('login')
                }
            catch (err) {
                this.error = err.response.data.error
                this.loginDetails.password = ''
                setTimeout(() => {
                    this.error = null
                }, 5000)
            }
        }    
    },
}
</script>