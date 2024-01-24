<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>إضافة مدينة</strong>
        </CCardHeader>
        <CCardBody>
            <!-- <FlashMessage position="center top" time="3000" /> -->
            <CForm class="row g-3">
                <CCol :md="12">                
                    <p for="inputNameAR">الاسم بالعربية</p>
                    <input 
                        id="inputNameAR" 
                        type="text" 
                        class="p-2"
                        :class="{onError: nameARError, 'form-control' : !nameARError}"
                        v-model="name_ar"
                    />
                    <CFormFeedback :class="{haveError: nameARError}" v-if="nameARError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">                         
                    <p for="inputNameEN">الاسم بالإنجليزية</p>
                    <input 
                        id="inputNameEN" 
                        type="text" 
                        class="p-2"
                        :class="{onError: nameENError, 'form-control' : !nameENError}"
                        v-model="name_en"
                    />
                    <CFormFeedback :class="{haveError: nameARError}" v-if="nameENError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>
                <!-- <CCol :md="4">
                    <CFormLabel for="inputState">State</CFormLabel>
                    <CFormSelect id="inputState">
                    <option>Choose...</option>
                    <option>...</option>
                    </CFormSelect>
                </CCol> -->
                <!-- <CCol :xs="12">
                    <CFormCheck
                    id="gridCheck"
                    type="checkbox"
                    label="Check me out"
                    />
                </CCol> -->
                <div class="modal-footer">
                  <CButton @click="handleSubmit" class="py-2 px-5" color="primary">إضافة</CButton>
                </div>
                
            </CForm>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>

import axios from "axios"
import env from '../../env'

const baseUrl = env.baseUrl

const token = localStorage.token
const config = {
    headers: { Authorization: `Bearer ${token}` }
}

export default {
  name: 'Create City',
   data(){
      return {
        name_ar: "",
        name_en: "",
        nameARError: "",
        nameENError: "",
    }
  },

  methods : {
      handleSubmit(){        
        if(this.name_ar == ""){
            this.nameARError = true
            console.log(this.nameARError)
        }
        if(this.name_ar != ""){
            this.nameARError = false
        }
        if(this.name_en == ""){
          this.nameENError = true
        }
        if(this.name_en != ""){
          this.nameENError = false
        }
        if(this.name_ar && this.name_en){
            axios.post(`${baseUrl}/admin/city/create`, {
              'name_ar' : this.name_ar,
              'name_en' : this.name_en
            }, config).then((response) => {
              // console.log(response.data);
              if(response.data.status == false){
                console.log('error')
                this.$swal({
                    title: 'عذرا, هناك خطأ',
                    // text: 'Welcome Back, Admin',
                    icon: 'error'
                })
              }else{
                // console.log('success')
                // this.$flashMessage.show({
                //   type: 'success',
                //   title: response.data.message,
                //   message: response.data.message
                // });
                this.$swal({
                    title: 'تمت الإضافه بنجاح',
                    // text: 'Welcome Back, Admin',
                    icon: 'success'
                })

                this.name_ar = ''
                this.name_en = ''

                this.$router.push('/cities/all') 

              }
            }).catch(function (error) {
              console.log(error);
            });
        }
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

    .modal-footer{
      margin-right: -.73em;
    }
  
</style>
