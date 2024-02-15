<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6"> 
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                 <!-- <CImage  src="../../assets/images/avatars/login.jpeg" /> -->
                 <img src="../../assets/images/avatars/login.jpeg"> 
              </CCardBody>
              </CCard>
          </CCardGroup>
        </CCol>
        <CCol :md="6" class="align-self-center">
          <CCardGroup>
            <CCard class="row justify-content-center p-4">
              <CCardBody class="col-10 m-auto">
                <!-- <FlashMessage position="center top" time="3000" /> -->
                <CForm>
                  <h1>تسجيل الدخول إلى الحساب</h1>
                  <p class="text-medium-emphasis">أدخل البريد الالكتروني وكلمة المرور لتسجيل الدخول</p>
                                  
                  <p>البريد الالكتروني</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <input
                      placeholder="example@gmail.com"
                      autocomplete="email"
                      v-model="email"
                      :class="{onError: emailError, 'form-control' : !emailError}"
                    />
                  </CInputGroup>
                  <CFormFeedback :class="{haveError: emailError}" v-if="emailError">يجب ألا يكون الحقل المطلوب فارغاً</CFormFeedback><br>                  
                  <p>كلمة المرور</p>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    
                    <input v-if="showPassword == false"
                      type="password"
                      placeholder="*********"
                      autocomplete="current-password"
                      v-model="password"
                      :class="{onError: passwordError, 'form-control' : !passwordError}"
                      @keyup.enter="login"
                    />
                    <input v-if="showPassword == true"
                      type="text"
                      placeholder="*********"
                      autocomplete="current-password"
                      v-model="password"
                      :class="{onError: passwordError, 'form-control' : !passwordError}"
                      @keyup.enter="login"
                    />
 
                    <CButton type="button" color="primary" @click="togglePassword">
                        <span class="password-toggler py-1" v-if="showPassword == false"><strong>عرض</strong></span>
                        <span class="password-toggler py-1" v-if="showPassword == true"><strong>إخفاء</strong></span>
                    </CButton>
                  </CInputGroup>
                  <CFormFeedback :class="{'haveError': passwordError}" v-if="passwordError">يجب ألا يكون الحقل المطلوب فارغاً</CFormFeedback><br>
                  <CRow class=" d-flex justify-content-center">
                    <CCol :xs="12">
                      <CButton @click="login" color="primary" class="w-100"> تسجيل الدخول </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
           </CCardGroup>
        </CCol>
 
      </CRow>
    </CContainer>
  </div>
</template>

<script>

import axios from "axios"
import env from '../../env'

const baseUrl = env.baseUrl

export default {
  name: 'Login',

  data(){
      return {
        email: "",
        password: "",
        emailError: "",
        passwordError: "",
        showPassword: false
      }
  },

  methods : {
    login(){
        // console.log(this.email, this.password)
        var re = /\S+@\S+\.\S+/;

        if(this.email == ""){
            this.emailError = true
        }
        if(this.email != ""){
            this.emailError = false
        }
        // console.log(re.test(this.email));
        if(re.test(this.email) == false){
          this.emailError = true
        }
        if(this.password == ""){
          this.passwordError = true
        }
        if(this.password != ""){
          this.passwordError = false
        }
        if(this.email && this.password){
            axios.post(`${baseUrl}/admin/signin`, {
              'email' : this.email,
              'password' : this.password
            }).then((response) => {
              // console.log(response.data);
              if(response.data.status == false){
                this.$swal({
                  title:'بيانات تسجيل الدخول غير صحيحه',
                  icon: 'error'
                })
                // console.log(response.data.errors[0])
              }else{
                localStorage.setItem('isAuthenticated', true)
                localStorage.setItem('token', response.data.data.access_token)
                let token = localStorage.getItem('token')
                let config = {
                  headers: { Authorization: `Bearer ${token}` }
                }

                axios.get(`${baseUrl}/admin/users/show`,config)
                .then((response) => {
                    // console.log(response.data.data)
                    localStorage.setItem('users_count', response.data.data.count)
                    this.$router.push('/dashboard')
                }).catch((error) => {
                    console.log(error)
                }); 

                // this.$router.push('/dashboard')
              }
            }).catch((error) => {
              console.log(error);
            });
        }
    },

    togglePassword(){
      this.showPassword = !this.showPassword
    }
  },
  mounted(){
    this.email= "admin@admin.com",
    this.password= "123456" 
  }

}
</script>
<style scoped>
    .form-control {  
      position: relative;
      flex: 1 1 auto;
      width: 1%;
      min-width: 0;
      display: block;
      width: 100%;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: var(--cui-input-color, rgba(44, 56, 74, 0.95));
      background-color: var(--cui-input-bg, #fff);
      background-clip: padding-box;
      border: 1px solid var(--cui-input-border-color, #b1b7c1);
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      border-radius: 0.375rem;
	    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

   .input-group > .form-control, .input-group > .form-select {
    position: relative;
    flex: 1 1 auto;
    width: 1%;
    min-width: 0;
  }
 
  .password-toggler{
    color: white;
    cursor: pointer;
  }  

  .bg-light {
    background-color: #ebedef ;
  }
  .container {
    background-color: #fff;
  }
  .card {
    border: none !important;
  }

  img  {
    width: 80%;
    display: flex;
    margin: auto ;
  }
 
</style>
