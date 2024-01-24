<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>إضافة باقة إشتراك</strong>
        </CCardHeader>
        <CCardBody>
            <!-- <FlashMessage position="center top" time="3000" /> -->
            <CForm class="row g-3">
                <CCol :md="12">                
                    <p for="period">مدة الباقة (شهري/سنوي)</p>
                    <input 
                        id="period" 
                        type="text" 
                        class="p-2"
                        :class="{onError: periodError, 'form-control' : !periodError}"
                        v-model="period"
                    />
                    <CFormFeedback :class="{haveError: periodError}" v-if="periodError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">                         
                    <p for="price">السعر</p>
                    <input 
                        id="price" 
                        type="text" 
                        class="p-2"
                        :class="{onError: priceError, 'form-control' : !priceError}"
                        v-model="price"
                    />
                    <CFormFeedback :class="{haveError: periodError}" v-if="priceError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>
                <div class="modal-footer">
                  <CButton @click="handleSubmit"  class="py-2 px-5" color="primary">إضافة</CButton>
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
   name: 'Create Subscription Plan',
   data(){
      return {
        period: "",
        price: "",
        periodError: "",
        priceError: "",
    }
  },

  methods : {
      handleSubmit(){        
        if(this.period == ""){
            this.periodError = true
            console.log(this.periodError)
        }
        if(this.period != ""){
            this.periodError = false
        }
        if(this.price == ""){
          this.priceError = true
        }
        if(this.price != ""){
          this.priceError = false
        }
        if(this.period && this.price){
            axios.post(`${baseUrl}/admin/subscription-plan/create`, {
              'period' : this.period,
              'price' : this.price
            }, config).then((response) => {
              // console.log(response.data);
              if(response.data.status == false){
                this.$swal({
                    title: 'عذرا, هناك خطأ',
                    // text: 'Welcome Back, Admin',
                    icon: 'error'
                })
              }else{
                this.$swal({
                    title: 'تمت الإضافه بنجاح',
                    // text: 'Welcome Back, Admin',
                    icon: 'success'
                })

                this.period = ''
                this.price = ''

                this.$router.push('/subscription-plans/all') 

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
