<template>

  <CRow>

    <CCol :xs="12">

      <CCard class="mb-4">

        <CCardHeader>

          <strong>جدول المدن</strong>
          <CButton disabled v-show="isLoading">
             <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
             جاري التحميل ... 
          </CButton>
        </CCardHeader>
       
        

        <CTable hover small responsive="sm" striped v-if="!isLoading">

              <CTableHead>

                <CTableRow color="dark">

                  <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell>

                  <CTableHeaderCell scope="col">الاسم بالعربية</CTableHeaderCell>

                  <CTableHeaderCell scope="col">الاسم بالإنجليزية</CTableHeaderCell>

                  <CTableHeaderCell scope="col">إعدادات</CTableHeaderCell>

                </CTableRow>

              </CTableHead>

              <CTableBody>

                <CTableRow v-for="city in cities" :key="city">

                  <CTableHeaderCell scope="row">{{city.id}}</CTableHeaderCell>

                  <CTableDataCell>{{city.name_ar}}</CTableDataCell>

                  <CTableDataCell>{{city.name_en}}</CTableDataCell>

                  <CTableDataCell>

                    <CButton color="warning" variant="outline" @click="() => invokeModal(city.id, city.name_ar, city.name_en)"> <CIcon icon="cil-pencil" size="lg" /> </CButton>
                  
                    &nbsp;

                    <CButton  color="danger"   variant="outline"  @click="deleteCity(city.id)" >  <CIcon icon="cil-basket" size="lg" /> </CButton>
                  
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
            <CTableRow class="text-center" v-for=" row in [].constructor(8)"> 
                <CTableHeaderCell scope="col" v-for="  column in [].constructor(4)"> 
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
  
  <CModal size="lg" :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }">

    <CModalHeader>

      <CModalTitle>تعديل مدينة</CModalTitle>
      
    </CModalHeader>

    <CModalBody>

          <CCardBody>

            <!-- <FlashMessage position="center top" time="3000" /> -->
            <CForm class="row g-3">

                <CCol :md="12">                
                    <p for="inputNameAR">الاسم بالعربية</p>
                    <input 
                        id="inputNameAR" 
                        type="text" 
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
                        :class="{onError: nameENError, 'form-control' : !nameENError}"
                        v-model="name_en"
                    />
                    <CFormFeedback :class="{haveError: nameARError}" v-if="nameENError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>

            </CForm>

        </CCardBody>

    </CModalBody>

    <div class="modal-footer">

       <CButton color="primary" @click="updateCity">تعديل</CButton>

    </div>

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
    name: 'Cities',
    data(){
        return {
            header:['الرقم التعريفي' , 'الاسم بالعربية ' , ' الاسم بالإنجليزية' , ' إعدادات'],
            cities: [],
            visibleLiveDemo: false,
            name_ar: "",
            name_en: "",
            nameARError: "",
            nameENError: "",
            currentCityId: null,
            isLoading: true,
        }
    },
    methods: {
        deleteCity(id) {
          this.$swal({
                    title: "الحذف",
                    text: "هل تريد حذف المدينة ؟",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonColor:  "#3085d6",
                    confirmButtonText: "حذف", 
                    cancelButtonText: "إلغاء", 

                  }).then((isConfirm)=> {
                    if(isConfirm.value == true) {
                     axios.delete(`${baseUrl}/admin/city/delete?city_id=${id}`, config).then((response) => {
                       if(response.data.status == true){ 
                          this.$swal({
                              title: 'تم الحذف بنجاح',
                              icon: 'success'
                          })
                          this.allCities();
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

        invokeModal(id, name_ar, name_en){
          this.currentCityId = id
          this.name_ar = name_ar
          this.name_en = name_en
          this.visibleLiveDemo = true
        },

        updateCity(){
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
            this.isLoading = true
              axios.post(`${baseUrl}/admin/city/update`, {
                'city_id' : this.currentCityId,
                'name_ar' : this.name_ar,
                'name_en' : this.name_en
              }, config).then((response) => {
                this.isLoading = false
                if(response.data.status == true){
                  this.$swal({
                      title: 'تم التعديل بنجاح',
                      icon: 'success'
                  })
                  this.allCities();
                }
                else {
                  console.log('error')
                  this.$swal({
                      title: 'عذرا, هناك خطأ',
                      text: response.data.errors[0],
                      icon: 'error'
                  })
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

        allCities(){
          this.isLoading = true
          axios.get(`${baseUrl}/cities/all`).then((response) => {
            console.log("cities",response.data.data)
            this.cities = response.data.data
            this.isLoading = false
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
    mounted(){
      this.isLoading = true
       axios.get(`${baseUrl}/cities/all`).then((response) => {
           console.log("cities",response.data.data)
            this.cities = response.data.data
            this.isLoading = false
         }).catch((error) => {
            this.isLoading = false
         }); 
    }
}
</script>

<style scoped>
  
</style>


