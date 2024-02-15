<template>
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong> إضافة القسم الرئيسي </strong>
          </CCardHeader>

          <CButton disabled v-show="isLoading">
            <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
            تحميل ...
          </CButton> 

          <CCardBody>
              <CForm class="row g-3">
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
    name: 'Create Category',
    data(){
      return {
        name_ar: "",
        name_en:"", 
        NameArabicError:"",
        NameEnglishError:"",
        isLoading: false,
      }
    },
  
    methods: {
      handleSubmit(){     
        this.isLoading=true ;
        if(this.name_ar == ""){
          this.NameArabicError = true
        }
        if(this.name_ar != ""){
          this.NameArabicError = false
        }
        if(this.name_en == ""){
          this.NameEnglishError = true
        }
        if(this.name_en != ""){
          this.NameEnglishError = false
        }
 
        if(this.name_en && this.name_ar){

          let requestBody = new FormData();
            requestBody.append('category_name_ar', this.name_ar)
            requestBody.append('category_name_en', this.name_en)
            axios.post(`${baseUrl}/admin/category/create`, requestBody , config).then((response) => {
             console.log(response.data);
              if(response.data.status == true){
              
                this.$swal({
                    title: 'تمت الإضافه بنجاح',
                    icon: 'success',
                    confirmButtonColor: "#303c54",
                })

                this.name_ar = ''
                this.name_en = ''
               
                this.$router.push('/categories/all') 

               
              }
              else{
                this.$swal({
                      title: 'عذرا, هناك خطأ',
                      text: response.data.errors[0],
                      icon: 'error'
                  })
              }
            }).catch((error)=>{
              this.$swal({
                    title: 'عذرا, هناك خطأ',
                    text: error.errors[0],
                    icon: 'error'
                 })
            });
        }
      },
    },
    mounted(){
   }
  }
  </script>
  
  <style scoped>
 
  </style>
  