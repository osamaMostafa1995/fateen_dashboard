<template>

    <CRow>

      <CCol :xs="12">

        <CCard class="mb-4">
        
          <CCardHeader>
                <strong> جدول اقسام الكتب الرئيسية </strong>

                <CButton disabled v-show="isLoading">
                    <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                    جاري التحميل ... 
                 </CButton>
            </CCardHeader>
 
           <CTable hover small responsive="sm" striped v-if="!isLoading">

              <CTableHead>

                <CTableRow color="dark">

                    <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell>

                    <CTableHeaderCell scope="col">اسم الفئة باللغة العربية</CTableHeaderCell>

                    <CTableHeaderCell scope="col">اسم الفئة باللغة الإنجليزية</CTableHeaderCell>
                    <CTableHeaderCell scope="col">عدد الكتب المرتبطة</CTableHeaderCell>
                    <CTableHeaderCell scope="col">الإعدادات</CTableHeaderCell>

                </CTableRow>

              </CTableHead>

              <CTableBody>

              <CTableRow v-for="category in categories" :key="category.id">

                  <CTableHeaderCell scope="row">{{category.id}}</CTableHeaderCell>

                  <CTableDataCell>{{category.name_ar}}</CTableDataCell>

                  <CTableDataCell>{{category.name_en}}</CTableDataCell>
                  <CTableDataCell style="cursor: pointer;"  @click="gotobooks(category.id)">{{category.summaries_count}}</CTableDataCell>
                  <CTableDataCell>

                   <CButton color="warning" variant="outline" @click="() => invokeModal(category.id,  category.name_ar ,category.name_en )">    <CIcon icon="cil-pencil" size="lg" />   </CButton>
                    &nbsp;
                   <CButton color="danger" variant="outline"  @click="deleteCategory(category.id)" >  <CIcon icon="cil-basket" size="lg" /> </CButton>
                
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
            <CTableRow class="text-center" v-for=" row in [].constructor(4)"> 
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

          <CModal size="lg" :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }">
              <CModalHeader>

                 <CModalTitle>إدارة قسم الكتاب الرئيسي</CModalTitle>
                 <!-- <CButton disabled v-show="isLoading">
                    <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                    جاري التحميل ... 
                  </CButton>  -->
              </CModalHeader>
 
              <CModalBody>

                  <CCardBody>

                      <CForm class="row g-3">

                          <h4>بيانات أقسام الكتب الرئيسية</h4>

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
              header:['الرقم التعريفي' , 'اسم الفئة باللغة العربية ' , 'اسم الفئة باللغة الإنجليزية' , 'عدد الكتب المرتبطة',' إعدادات'],
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
        gotobooks(item){
            this.$router.push({path: '/books-summaries/all', query: {category_id: item} });
        },
            invokeModal(id, name_ar, name_en ){
                this.currentCategoryId = id
                this.name_ar = name_ar
                this.name_en = name_en
                this.visibleLiveDemo = true
            },

            updateSummary(){
                let requestBody = new FormData();
                requestBody.append('category_id', this.currentCategoryId)
                requestBody.append('name_ar', this.name_ar)
                requestBody.append('name_en', this.name_en)
                this.isLoading = true
                axios.post(`${baseUrl}/admin/brief-category/edit`, requestBody, config).then((response) => {
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
                      axios.delete(`${baseUrl}/admin/brief-category/remove?category_id=${category_id}`,config).then((response) => {
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
          axios.get(`${baseUrl}/admin/brief-category/all`, config).then((response) => {
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
       },

       mounted(){
          this.isLoading = true
          axios.get(`${baseUrl}/admin/brief-category/all`, config).then((response) => {
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