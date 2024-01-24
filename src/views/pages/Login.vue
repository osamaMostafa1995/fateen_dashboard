<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
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
                    <CButton type="button" color="info" @click="togglePassword">
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
            <!-- <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>
                    If you didn't have an account, Sign up an account
                  </p>
                  <CButton color="light" variant="outline" class="mt-3">
                    Register Now!
                  </CButton>
                </div>
              </CCardBody>
            </CCard> -->
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
                }).catch(function (error) {
                    console.log(error)
                }); 

                // this.$router.push('/dashboard')
              }
            }).catch(function (error) {
              console.log(error);
            });
        }
    },

    togglePassword(){
      this.showPassword = !this.showPassword
    }
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

  .onError {  
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
    border: 1px solid var(--cui-input-border-color, red);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 0.375rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .input-group > .onError, .input-group > .form-select {
    position: relative;
    flex: 1 1 auto;
    width: 1%;
    min-width: 0;
  }

  .onError:focus{
    outline: none !important;
    border: 1.3px solid red;
    box-shadow: 0 0 4px red;
  }
  .haveError {
    color: red;
  }
  .password-toggler{
    color: white;
    cursor: pointer;
  }

 
</style>
