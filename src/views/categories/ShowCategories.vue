<template>

    <CRow>

      <CCol :xs="12">

        <CCard class="mb-4">
        
          <CCardHeader>
                <strong> جدول الأقسام الرئيسية </strong>
            </CCardHeader>

            <CButton disabled v-show="isLoading">
                <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                Loading...
            </CButton>


           <CTable hover small responsive="sm">

              <CTableHead>

                <CTableRow color="dark">

                    <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell>

                    <CTableHeaderCell scope="col">اسم الفئة باللغة العربية</CTableHeaderCell>

                    <CTableHeaderCell scope="col">اسم الفئة باللغة الإنجليزية</CTableHeaderCell>

                    <CTableHeaderCell scope="col">الإعدادات</CTableHeaderCell>

                </CTableRow>

              </CTableHead>

              <CTableBody>

              <CTableRow v-for="category in categories" :key="category.id">

                  <CTableHeaderCell scope="row">{{category.id}}</CTableHeaderCell>

                  <CTableDataCell>{{category.name_ar}}</CTableDataCell>

                  <CTableDataCell>{{category.name_en}}</CTableDataCell>

                  <CTableDataCell>

                   <CButton color="warning" variant="outline" @click="() => invokeModal(category.id,  category.name_ar ,category.name_en )">    <CIcon icon="cil-pencil" size="lg" />   </CButton>
                    &nbsp;
                   <CButton color="danger" variant="outline"  @click="deleteCategory(category.id)" >  <CIcon icon="cil-basket" size="lg" /> </CButton>
                
                </CTableDataCell>

              </CTableRow>

              </CTableBody>

          </CTable>
  
          <CModal :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }">
              <CModalHeader>

                 <CModalTitle>إدارة القسم الرئيسي</CModalTitle>

              </CModalHeader>

              <CButton disabled v-show="isLoading">
                  <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                  Loading...
              </CButton>

              <CModalBody>

                  <CCardBody>

                      <CForm class="row g-3">

                          <h4>بيانات الأقسام الرئيسية</h4>

                          <CCol :md="12">                
                              <strong><label class="mb-1">الاسم باللغة العربية </label></strong> : 
                              <input 
                                id="name_ar" 
                                type="text"
                                class="p-2" 
                                :class="{onError: NameArabicError, 'form-control' : !NameArabicError}"
                                v-model="name_ar"
                              />
                              <CFormFeedback :class="{haveError: NameArabicError}" v-if="NameArabicError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>           
                          </CCol>

                          <CCol :md="12">                         
                              <strong><label class="mb-1">الاسم باللغة الإنجليزية</label></strong> : 
                              <input 
                                id="name_en" 
                                type="text"
                                class="p-2" 
                                :class="{onError: NameEnglishError, 'form-control' : !NameEnglishError}"
                                v-model="name_en"
                              />
                              <CFormFeedback :class="{haveError: NameEnglishError}" v-if="NameEnglishError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>      
                          </CCol>
                         
                      </CForm>

                  </CCardBody>

              </CModalBody>

              <CModalFooter>
           
              <CButton class="py-2 px-4" color="primary" @click="updateSummary">تعديل</CButton>

              </CModalFooter>

          </CModal>

       </CCard>

      </CCol>
      
    </CRow>
  
  </template>
  
  <script>
  
  import axios from "axios"
  import env from '../../env'
 
  const baseUrl= env.baseUrl
  const token = localStorage.token
  const config = {
      headers: { Authorization: `Bearer ${token}` }
  }
  sessionStorage.setItem("currentCategoryId", 1);
  
  export default {
      name: 'Categories',
      data(){
          return {
              visibleLiveDemo: false,
              categories: [],
              name_ar:"",
              name_en:"",
              currentCategoryId: null,
              isLoading: false,
              NameArabicError: "",
              NameEnglishError: "",
           }
       },

       methods: {
            invokeModal(id, name_ar, name_en ){
                this.currentCategoryId = id
                this.name_ar = name_ar
                this.name_en = name_en
                this.visibleLiveDemo = true
            },

            updateSummary(){
                let requestBody = new FormData();
                requestBody.append('category_id', this.currentCategoryId)
                requestBody.append('category_name_ar', this.name_ar)
                requestBody.append('category_name_en', this.name_en)
                this.isLoading = true
                axios.post(`${baseUrl}/admin/category/update`, requestBody, config).then((response) => {
                this.isLoading = false
                if(response.data.status == true){                         
                    this.$swal({
                        title: 'تم التعديل بنجاح',
                        icon: 'success',
                        confirmButtonColor: "#303c54",
                    })
                    this.allCategories() 
                }
               else{
                    this.$swal({
                        title: 'عذرا, هناك خطأ',
                        text: response.data.errors[0],
                        icon: 'error',
                        confirmButtonColor:'#eb2b2b'
                   })
                }
                }).catch((error) => { 
                    this.isLoading = false
                    this.$swal({
                        title: 'عذرا, هناك خطأ',
                        text: error.errors[0],
                        icon: 'error',
                        confirmButtonColor:'#eb2b2b'
                   })
                })                                           
            },

            deleteCategory(category_id){
                this.$swal({
                title: "الحذف",
                text: "هل تريد حذف القسم الرئيسي ؟",
                type: "warning",
                showCancelButton: true,
                cancelButtonColor:  "#3085d6",
                confirmButtonText: "حذف", 
                cancelButtonText: "إلغاء", 

                  }).then((isConfirm)=> {
                    if(isConfirm.value == true) {
                      this.isLoading = true
                      axios.delete(`${baseUrl}/admin/category/delete?category_id=${category_id}`,config).then((response) => {
                       this.isLoading = false
                        if(response.data.status == true){
                            this.$swal({
                              title: 'تم الحذف بنجاح',
                              icon: 'success'
                          })
                          this.allCategories();
                        }else {
                            this.$swal({
                                title: 'عذرا, هناك خطأ',
                                text: response.data.errors[0],
                                icon: 'error',
                                confirmButtonColor:'#eb2b2b'
                            })
                        }
                     }).catch((error)=>{
                        this.isLoading = false
                        this.$swal({
                            title: 'عذرا, هناك خطأ',
                            text: error.errors[0],
                            icon: 'error',
                            confirmButtonColor:'#eb2b2b'
                       })
                     })
                   }
                })
            } ,

            allCategories() {
                this.isLoading = true
                axios.get(`${baseUrl}/category/all`, config).then((response) => {
                 this.isLoading = false
                this.categories = response.data.data                        
                }).catch((error)=> {     
                this.isLoading = false                                                   
              });
            }
       },

       mounted(){
          this.isLoading = true
          axios.get(`${baseUrl}/category/all`, config).then((response) => {
            this.isLoading = false
            this.categories = response.data.data   
            }).catch((error)=> {
                this.isLoading = false
                this.$swal({
                    title: 'عذرا, هناك خطأ',
                    text: error.errors[0],
                    icon: 'error',
                    confirmButtonColor:'#eb2b2b'
               })
            }); 
       }
  }
  </script>
  
  <style scoped>
  
  </style>