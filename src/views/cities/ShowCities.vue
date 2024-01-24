<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>جدول المدن</strong>
        </CCardHeader>
        <CButton disabled v-show="isLoading">
            <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
            Loading...
        </CButton>
        <CTable hover small responsive="sm">
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
                     <CButton
                      color="warning"
                      variant="outline"
                      @click="() => invokeModal(city.id, city.name_ar, city.name_en)"
                    >
                    <CIcon icon="cil-pencil" size="lg" />
                    </CButton>
                    &nbsp;
                    <CButton
                      color="danger"
                      variant="outline"
                      @click="deleteCity(city.id)"
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
    <CModalFooter>
      <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
        غلق
      </CButton>
      <CButton color="primary" @click="updateCity">تعديل</CButton>
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
            if(confirm("هل متأكد من عملية الحذف؟")){
                axios.delete(`${baseUrl}/admin/city/delete?city_id=${id}`, config)
                .then(response => {
                    this.$swal({
                        title: 'تم الحذف بنجاح',
                        icon: 'success'
                    })
                }).then( () => {
                    axios.get(`${baseUrl}/cities/all`)
                    .then((response) => {
                        this.cities = response.data.data
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
        invokeModal(id, name_ar, name_en){
          this.currentCityId = id
          this.name_ar = name_ar
          this.name_en = name_en
          this.visibleLiveDemo = true
        },
        updateCity(){
          // console.log(this.currentCityId)
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
              axios.post(`${baseUrl}/admin/city/update`, {
                'city_id' : this.currentCityId,
                'name_ar' : this.name_ar,
                'name_en' : this.name_en
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
                    axios.get(`${baseUrl}/cities/all`)
                    .then((response) => {
                        this.cities = response.data.data
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
        axios.get(`${baseUrl}/cities/all`)
        .then((response) => {
            // console.log(response.data.data)
            this.cities = response.data.data
            this.isLoading = false
            // console.log(this.cities)
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


