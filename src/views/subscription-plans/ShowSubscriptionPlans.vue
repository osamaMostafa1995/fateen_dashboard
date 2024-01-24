<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>جدول باقات الإشتراك</strong>
        </CCardHeader>
        <CButton disabled v-show="isLoading">
            <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
            Loading...
        </CButton>
        <CTable hover small responsive="sm">
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell>
                  <CTableHeaderCell scope="col">مدة الباقة</CTableHeaderCell>
                  <CTableHeaderCell scope="col">السعر</CTableHeaderCell>
                  <CTableHeaderCell scope="col">إعدادات</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="subscriptionPlan in subscriptionPlans" :key="subscriptionPlan">
                  <CTableHeaderCell scope="row">{{subscriptionPlan.id}}</CTableHeaderCell>
                  <CTableDataCell>{{subscriptionPlan.period}}</CTableDataCell>
                  <CTableDataCell>{{subscriptionPlan.price}}</CTableDataCell>
                  <CTableDataCell>
                     <CButton
                      color="warning"
                      variant="outline"
                      @click="() => invokeModal(subscriptionPlan.id, subscriptionPlan.period, subscriptionPlan.price)"
                    >
                    <CIcon icon="cil-pencil" size="lg" />
                    </CButton>
                    &nbsp;
                    <CButton
                      color="danger"
                      variant="outline"
                      @click="deleteSubscriptionPlan(subscriptionPlan.id)"
                    >              
                    <CIcon icon="cil-basket" size="lg" />
                    </CButton>
                   
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
        </CTable>
      </CCard>
    </CCol>
  </CRow>

  <CModal :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }">
    <CModalHeader>
      <CModalTitle>تعديل الباقة</CModalTitle>
    </CModalHeader>
    <CModalBody>
          <CCardBody>
            <!-- <FlashMessage position="center top" time="3000" /> -->
            <CForm class="row g-3">
                <CCol :md="12">                
                    <p for="period">مدة الباقة (شهري/سنوي)</p>
                    <input 
                        id="period" 
                        type="text" 
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
                        :class="{onError: priceError, 'form-control' : !priceError}"
                        v-model="price"
                    />
                    <CFormFeedback :class="{haveError: periodError}" v-if="priceError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>
            </CForm>
        </CCardBody>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
        غلق
      </CButton>
      <CButton color="primary" @click="updateSubscriptionPlan">تعديل</CButton>
    </CModalFooter>
  </CModal>

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
    name: 'Tables',
    data(){
        return {
            subscriptionPlans: [],
            visibleLiveDemo: false,
            period: "",
            price: "",
            periodError: "",
            priceError: "",
            currentId: null,
            isLoading: true,
        }
    },
    methods: {
        deleteSubscriptionPlan(id) {
            if(confirm("هل متأكد من عملية الحذف؟")){
                axios.delete(`${baseUrl}/admin/subscription-plan/delete?subscription_plan_id=${id}`, config)
                .then(response => {
                    this.$swal({
                        title: 'تم الحذف بنجاح',
                        icon: 'success'
                    })
                }).then( () => {
                    axios.get(`${baseUrl}/subscription-plans/all`)
                    .then((response) => {
                        this.subscriptionPlans = response.data.data
                    }).catch(function (error) {
                        console.log(error)
                    });
                })
                .catch(error => {
                    // console.log(error);
                    this.$swal({
                      title: 'عذرا, هناك خطأ',
                      icon: 'error'
                    })
                })
            }
        },
        invokeModal(id, period, price){
          this.currentId = id
          this.period = period
          this.price = price
          this.visibleLiveDemo = true
        },
        updateSubscriptionPlan(){
          // console.log(this.currentId)
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
              axios.post(`${baseUrl}/admin/subscription-plan/update`, {
                'subscription_plan_id' : this.currentId,
                'period' : this.period,
                'price' : this.price
              }, config).then((response) => {
                // console.log(response.data);
                if(response.data.status == false){
                  console.log('error')
                  this.$swal({
                      title: 'عذرا, هناك خطأ',
                      icon: 'error'
                  })
                }else{
                  this.$swal({
                      title: 'تم التعديل بنجاح',
                      // text: 'Welcome Back, Admin',
                      icon: 'success'
                  })
                }
              }).then( () => {
                    axios.get(`${baseUrl}/subscription-plans/all`)
                    .then((response) => {
                        this.subscriptionPlans = response.data.data
                    }).catch(function (error) {
                        console.log(error)
                    });
                }).catch(function (error) {
                  console.log(error);
              });
          }
        }
    },
    mounted(){
        axios.get(`${baseUrl}/subscription-plans/all`)
        .then((response) => {
            // console.log(response.data.data)
            this.subscriptionPlans = response.data.data
            this.isLoading = false
            // console.log(this.subscriptionPlans)
        }).catch(function (error) {
            console.log(error)
            this.isLoading = false
        }); 
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
  
</style>


