<template>

  <CRow>

    <CCol :xs="12">

      <CCard class="mb-4">

        <CCardHeader>

          <strong>جدول باقات الإشتراك</strong>
          
          <CButton disabled v-show="isLoading">
             <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
             جاري التحميل ... 
          </CButton>
          
        </CCardHeader>
 
        <CTable  hover small responsive="sm" striped  class="mb-0 pb-0" v-if="!isLoading">

              <CTableHead>

                <CTableRow color="dark">

                  <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell>

                  <CTableHeaderCell scope="col"> عدد الأيام</CTableHeaderCell>

                  <CTableHeaderCell scope="col">مدة الباقة</CTableHeaderCell>

                  <CTableHeaderCell scope="col">السعر</CTableHeaderCell>

                  <CTableHeaderCell scope="col">إعدادات</CTableHeaderCell>

                </CTableRow>

              </CTableHead>

              <CTableBody>

                <CTableRow v-for="subscriptionPlan in subscriptionPlans" :key="subscriptionPlan">

                  <CTableHeaderCell scope="row">{{subscriptionPlan.id}}</CTableHeaderCell>

                  <CTableHeaderCell scope="row">{{subscriptionPlan.days}}</CTableHeaderCell>

                  <CTableDataCell>{{subscriptionPlan.period}}</CTableDataCell>

                  <CTableDataCell>{{subscriptionPlan.price}}</CTableDataCell>

                  <CTableDataCell>
                    
                     <CButton  color="warning"   variant="outline"  @click="() => invokeModal(subscriptionPlan.id, subscriptionPlan.period, subscriptionPlan.price , subscriptionPlan.days)" > <CIcon icon="cil-pencil" size="lg" /></CButton>
                 
                    &nbsp;

                    <CButton color="danger"  variant="outline"  @click="deleteSubscriptionPlan(subscriptionPlan.id)" > <CIcon icon="cil-basket" size="lg" /> </CButton>
                 
                  </CTableDataCell>

                </CTableRow>

              </CTableBody>

        </CTable>

        <CTable hover small responsive="sm" class="placeholder-table" striped v-if="isLoading"> 
          <CTableHead>  
            <CTableRow>
                <CTableHeaderCell scope="col"  v-for="  head in header"> {{head}}</CTableHeaderCell>
            </CTableRow>
          </CTableHead> 
          <CTableBody>  
            <CTableRow class="text-center" v-for=" row in [].constructor(1)"> 
                <CTableHeaderCell scope="col" v-for="  column in [].constructor(5)"> 
                    <div class="ph-item">
                        <div class="ph-col-12">
                            <div class="ph-row">
                                <div class="ph-col-12 big"></div>
                            </div>
                        </div>
                    </div>    
              </CTableHeaderCell>
            </CTableRow>
          </CTableBody>
         </CTable>
      </CCard>
 
    </CCol>

  </CRow>

  <CModal :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }">

    <CModalHeader>

      <CModalTitle>تعديل  بيانات الباقة</CModalTitle>

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
                    <p for="days"> الأيام</p>
                    <input 
                        id="days" 
                        type="text" 
                        class="p-2"
                        :class="{onError: daysError, 'form-control' : !daysError}"
                        v-model="days"
                    />
                    <CFormFeedback :class="{haveError: daysError}" v-if="daysError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
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

    <!-- <CModalFooter> -->
      <div class="modal-footer">

       <CButton color="primary" @click="updateSubscriptionPlan">تعديل</CButton>

      </div>
    <!-- </CModalFooter> -->
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
    name: 'Subscription Plans',
    data(){
        return {
            header:['الرقم التعريفي'  ,'عدد الأيام', 'مدة الباقة ' , 'السعر ' , ' إعدادات'],
            subscriptionPlans: [],
            visibleLiveDemo: false,
            period: "",
            price: "",
            days: "" ,
            daysError:"",
            periodError: "",
            priceError: "",
            currentId: null,
            isLoading: true,
        }
    },
    methods: {
        deleteSubscriptionPlan(id) {
          this.$swal({
                    title: "الحذف",
                    text: "هل تريد حذف خطة الإشتراك ؟",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonColor:  "#3085d6",
                    confirmButtonText: "حذف", 
                    cancelButtonText: "إلغاء", 

                  }).then((isConfirm)=> {
                    if(isConfirm.value == true) {
                      axios.delete(`${baseUrl}/admin/subscription-plan/delete?subscription_plan_id=${id}`, config).then((response) => {
                       if(response.data.status == true){ 
                          this.$swal({
                              title: 'تم الحذف بنجاح',
                              icon: 'success'
                          })
                          this.allPlans();
                        }
                        else {
                          this.$swal({
                          title: 'عذرا, هناك خطأ',
                          text: response.data.errors[0],
                          icon: 'error'
                          })
                        }
                     }).catch(()=>{
                      this.$swal({
                          title: 'عذرا, هناك خطأ',
                          text: error.errors[0],
                          icon: 'error'
                          })
                     }) 
                   }
                })

        },

        invokeModal(id, period, price , days){
          this.currentId = id
          this.period = period
          this.price = price
          this.days = days
          this.visibleLiveDemo = true
        },

        updateSubscriptionPlan(){
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
          if(this.days == ""){
            this.daysError = true
          }
          if(this.days != ""){
            this.daysError = false
          }

          if(this.period && this.price && this.days){
            this.isLoading = true
              axios.post(`${baseUrl}/admin/subscription-plan/update`, {
                'subscription_plan_id' : this.currentId,
                'period' : this.period,
                'price' : this.price
              }, config).then((response) => {
                this.isLoading = false
                if(response.data.status == false){
                  console.log('error')
                  this.$swal({
                      title: 'عذرا, هناك خطأ',
                      text: response.data.errors[0],
                      icon: 'error'
                  })
                }else{
                 this.$swal({
                      title: 'تم التعديل بنجاح',
                      icon: 'success'
                  })
                  this.allPlans()
                }
                }).catch((error)=> {
                  this.isLoading = false
                  this.$swal({
                    title: 'عذرا, هناك خطأ',
                    text: error.errors[0],
                    icon: 'error'
                 })
              });
          }
        }, 

        allPlans() {
          this.isLoading = true
          axios.get(`${baseUrl}/subscription-plans/all`).then((response) => {
            this.isLoading = false
              console.log("plans",response.data.data)
              this.subscriptionPlans = response.data.data
           }).catch((error)=> {
            this.isLoading = false
            this.$swal({
                title: 'عذرا, هناك خطأ',
                text: error.errors[0],
                icon: 'error'
             })
           }); 
        }, 
    },

    mounted(){
      this.isLoading = true
      axios.get(`${baseUrl}/subscription-plans/all`)
      .then((response) => {
          this.isLoading = false
          this.subscriptionPlans = response.data.data
          console.log("plans",response.data.data)
          }).catch((error)=> {
          this.isLoading = false
          console.log(error)
        }); 
    }
}
</script>

<style scoped>
 
</style>


