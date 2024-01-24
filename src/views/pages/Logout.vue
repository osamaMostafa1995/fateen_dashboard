<script>
export default {
    methods:{
        logout: function() {
            localStorage.removeItem("data")
            localStorage.removeItem("isAuthenticated")
            localStorage.removeItem("alert")

            sessionStorage.removeItem("factCurrentPage")
            sessionStorage.removeItem("articleCurrentPage")
            sessionStorage.removeItem("users_count")

            this.$router.push("/login")
            // window.location.reload()
        }
    },
    beforeMount(){
        this.logout()
    },
}
</script>