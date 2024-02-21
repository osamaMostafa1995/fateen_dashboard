<template>

  <CRow>

    <CCol :xs="12">

      <CCard class="mb-4">

        <CCardHeader>

          <strong>إضافة باقة إشتراك</strong>

        </CCardHeader>

        <CButton disabled v-show="isLoading">

          <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
          تحميل ...

        </CButton> 

        <CCardBody>
            <!-- <FlashMessage position="center top" time="3000" /> -->
            <CForm class="row g-3">

                 <CCol :md="12">  
                    <CFormLabel for="period"> مدة الباقة (شهري/سنوي) </CFormLabel>
                      <CFormSelect  v-model="period" id="period"  :class="{onError: periodError, 'form-control' : !periodError}">
                          <option v-for="period in periods" :key="period" :value="period.name_en" > {{ period.name_ar }}</option>
                      </CFormSelect>
                    <CFormFeedback :class="{haveError: periodError}" v-if="periodError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback> <br>               
                 </CCol>  

                  

                <CCol :md="12">        
                  <CFormLabel for="days">الأيام </CFormLabel>        
                   <input 
                        id="days" 
                        type="text" 
                        class="p-2"
                        :class="{onError: daysError, 'form-control' : !daysError}"
                        v-model="days"/>
                    <CFormFeedback :class="{haveError: daysError}" v-if="daysError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>


                <CCol :md="12">                         
                    <CFormLabel for="price">السعر </CFormLabel>    
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
        periods:[{ id:1,name_en:'daily' , name_ar:'يوميا' }, { id:2 , name_en:'monthly' , name_ar:'شهريا' }],
        period: "",
        price: "",
        days:"",
        periodError: "",
        priceError: "",
        daysError:""
    }
  },

  methods : {
    handleSubmit(){        
        if(this.period == ""){
         this.periodError = true
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

        if(this.days == ""){
          this.daysError = true
        }
        if(this.days != ""){
          this.daysError = false
        }
        
        if(this.period && this.price && this.days){
            axios.post(`${baseUrl}/admin/subscription-plan/create`, {
              'period' : this.period,
              'price' : this.price ,
              'days':this.days
            }, config).then((response) => {
                if(response.data.status == true){
                  this.$swal({
                      title: 'تمت الإضافه بنجاح',
                      icon: 'success'
                  })

                  this.period = ''
                  this.days = ''
                  this.price = ''

                  this.$router.push('/subscription-plans/all') 
      
                }else{
                  this.$swal({
                      title: 'عذرا, هناك خطأ',
                      text: response.data.errors[0],
                      icon: 'error'
                  })
                }
            }).catch((error) =>  {
              console.log(error);
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
