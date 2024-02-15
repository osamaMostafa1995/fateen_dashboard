<template>

  <CRow>

    <CCol :xs="12">

      <CCard class="mb-4">

        <CCardHeader>

           <strong>إضافة مدينة</strong>

        </CCardHeader>

        <CButton disabled v-show="isLoading">

            <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
            تحميل ...

        </CButton> 

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
            axios.post(`${baseUrl}/admin/city/create`, { 'name_ar' : this.name_ar,'name_en' : this.name_en }, config).then((response) => {
              if(response.data.status == true){
             
                this.$swal({
                    title: 'تمت الإضافه بنجاح',
                    icon: 'success'
                })

                this.name_ar = ''
                this.name_en = ''

                this.$router.push('/cities/all') 

              }
              else {
                this.$swal({
                    title: 'عذرا, هناك خطأ',
                    text: response.data.errors[0],
                    icon: 'error'
                })
              }
            }).catch((error)=> {
              this.$swal({
                title: 'عذرا, هناك خطأ',
                text: error.errors[0],
                icon: 'error'
              })
            });
        }
    }
  }
}
</script>

<style scoped>
 
</style>
