<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>نسخ ملخص</strong>

          <!-- <CButton disabled v-show="isLoading">
            <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
            جاري التحميل ... 
        </CButton>  -->

        </CCardHeader>
        
        <CCardBody>
            <CForm class="row g-3">
                
                <CCol :md="12">
                    <CFormLabel for="inputState">اختيار الملخص بأسم الكتاب</CFormLabel>
                    <CFormSelect v-model="currentSummaryId" id="inputState"  class="p-2">
                        <option v-for="summary in summaries" :value="summary.id" :key="summary">{{summary.book_name}}</option>
                    </CFormSelect>
                </CCol>
              
                <CCol :md="12" class="my-5">
                  <QuillEditor v-model:content="copiedTextManage" theme="snow" contentType="html" id="editor"
                    :toolbar="['bold', 'italic', 'underline',
                    { 'list': 'ordered'}, { 'list': 'bullet' }, { 'direction': 'rtl' }, { 'header': [1, 2, 3, 4, 5, 6, false] }, 
                    {'color': [] }, { 'background': [] }, { 'font': [] }, { 'align': [] },
                    ]"   
                  />

                  <CPagination class="cdk-paginator">
                    <div class="d-flex  my-2" >  
                        <div v-if="cdkcurrentManagePage == 0" class=" mx-1">
                            <CPaginationItem disabled>
                              الصفحة السابقة</CPaginationItem>
                        </div>
                        <div v-else class=" mx-1">
                            <CPaginationItem class="paginated-style" @click="handlecdkAddPagination('sub')">
                            الصفحة السابقة</CPaginationItem>
                        </div>
                        <div v-if="cdkcurrentManagePage == cdklastManagePage" class=" mx-1">
                            <CPaginationItem disabled>
                             صفحة جديدة</CPaginationItem>
                        </div>
                        <div v-else class="  mx-1">   
                            <CPaginationItem class="paginated-style" @click="handlecdkAddPagination('add')">
                              صفحة جديدة </CPaginationItem>
                        </div>
                    </div>
                    <div class="my-2 pt-2"> رقم الصفحة {{cdkcurrentManagePage}}</div>
                    <CButton color="secondary" @click="() =>handlecdkAddPagination('save')"> حفظ الصفحة</CButton>

                    </CPagination>

                  <CFormFeedback class="my-2" :class="{haveError: copiedTextManageError}" v-if="copiedTextManageError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol><br><br>

                <div class="modal-footer my-5">
                  <CButton @click="handleSubmit"  class=" py-2 px-5" color="primary">إضافة</CButton>
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
// import VueHtml2pdf from 'vue-html2pdf'
export default {

  name: 'Format Summaries',
  data(){
    return {
        currentSummaryId: null,
        summaries: [],
        copiedTextManage: "<p><bold>this is a book summary with bold text</bold></p>",
        copiedHTML: "",
        copiedTextManageError: "",
        isLoading: false,
        cdkcurrentManagePage:1,
        cdklastManagePage:50, 

        pageNum:0,
        pagesContent:[]
    }
  },

  methods: {
 
    handleSubmit(){      
      
      var filtered = this.pagesContent.filter((el)=> {
          if(el!="<p><br></p>"||el !='') {
            return el
          }
      });

      // console.log("filtered",filtered);
        // if(this.copiedTextManage == ""){
        //     this.copiedTextManageError = true
        // }
        // if(this.copiedTextManage != ""){
        //     this.copiedTextManageError = false
        // }

        // if(this.copiedTextManage != ""){

        //    // console.log(this.copiedTextManage)

        //     let requestBody = new FormData();

        //     requestBody.append('book_summary_id', this.currentSummaryId)
        //     requestBody.append('book_summary_text', this.copiedTextManage)

        //     axios.post(`${baseUrl}/admin/book-summary/convert`, requestBody, config).then((response) => {
        //       // console.log(response.data);
        //       if(response.data.status == false){
        //         // console.log('error')
        //         this.$swal({
        //             title: 'عذرا, هناك خطأ',
        //             // text: 'Welcome Back, Admin',
        //             icon: 'error'
        //         })
        //       }else{
        //         this.$swal({
        //             title: 'تمت الإضافه بنجاح',
        //             // text: 'Welcome Back, Admin',
        //             icon: 'success'
        //         })

        //         this.copiedTextManage = ''
        //         this.$router.push('/books-summaries/all') 

        //       }
        //     }).catch((error)=> {
        //      // console.log(error);
        //     });
        // }
    },
   
    handlecdkAddPagination(page){ 
      if(page=='save') {
        if((this.copiedTextManage != '<p><br></p>')){
          if((this.pagesContent.length!=0) && ((this.pagesContent.length-1) == (this.cdkcurrentManagePage-1)))
           // console.log("pagesContent",this.pagesContent[this.cdkcurrentManagePage-1])
          this.pagesContent[this.cdkcurrentManagePage-1]=this.copiedTextManage
        } 
        // document.getElementsByClassName('ql-editor')[0].innerHTML  = ""
      }
      else if(page=='sub') {  
        if(this.cdkcurrentManagePage-1>0) {  
          this.cdkcurrentManagePage-=1 ;
          // console.log("prev",this.cdkcurrentManagePage)
          if(this.pagesContent[this.cdkcurrentManagePage-1]) {
            document.getElementsByClassName('ql-editor')[0].innerHTML  = this.pagesContent[this.cdkcurrentManagePage-1] 
          }
          else {
            document.getElementsByClassName('ql-editor')[0].innerHTML  ='' ;
          }
        }
      }
      else if(page=='add')  {
        if(this.cdkcurrentManagePage!=this.cdklastManagePage) { 
            this.cdkcurrentManagePage+=1 ;
            if( this.pagesContent[this.cdkcurrentManagePage-1]){
              document.getElementsByClassName('ql-editor')[0].innerHTML  = this.pagesContent[this.cdkcurrentManagePage-1]  
            }else {
              document.getElementsByClassName('ql-editor')[0].innerHTML  ='' ;
            }
            // console.log("next",this.cdkcurrentManagePage.length)
          }
      } 
    

      var filteredPages = this.pagesContent.filter((el)=> {
        if(el) {
          return el != null;
        }
      });
      // console.log("filteredPages",filteredPages)
    },

    // handlecdkAddPagination(page){ 
    //   if(page=='add') {
    //     if(this.cdkcurrentManagePage!=this.cdklastManagePage) { 
    //         this.cdkcurrentManagePage+=1 ;
    //         if(this.pagesContent.length!=0 && (this.cdkcurrentManagePage-1 <=  this.pagesContent.length-1)){
    //             if(this.copiedTextManage!=this.pagesContent[this.cdkcurrentManagePage-2]){
    //               this.document.getElementsByClassName('ql-editor')[0].innerHTML  =pagesContent[this.cdkcurrentManagePage-2]=this.copiedTextManage
    //             this.pagesContent[this.cdkcurrentManagePage-1] 
    //             }
    //             else if ( this.pagesContent[this.cdkcurrentManagePage-2]==this.copiedTextManage && this.copiedTextManage!='') {
    //               document.getElementsByClassName('ql-editor')[0].innerHTML  = this.pagesContent[this.cdkcurrentManagePage-1] 
    //             }
             
    //         }
    //         else {
    //           this.pagesContent.push(this.copiedTextManage)
    //           this.copiedTextManage=''
    //           document.getElementsByClassName('ql-editor')[0].innerHTML  = ""
           
    //         }
    //      }
    //   } 
    //   else if(page=='sub') {  
    //     if(this.cdkcurrentManagePage-1>0) {  
    //       this.cdkcurrentManagePage-=1 ;
    //       document.getElementsByClassName('ql-editor')[0].innerHTML  = this.pagesContent[this.cdkcurrentManagePage-1] 
    //     }
    //   }
    //   // console.log("pagesContent",this.pagesContent)
    // },
  },
  mounted(){
    let data = [];
    axios.get(`${baseUrl}/admin/book-summaries/all?page=`+1, config)
        .then((response) => {
            data.push(response.data.data.data)
            this.currentPage = response.data.data.current_page
            this.lastPage = response.data.data.last_page

            while(this.currentPage <= this.lastPage){
              this.currentPage += 1
               axios.get(`${baseUrl}/admin/book-summaries/all?page=`+this.currentPage, config)
                    .then((response) => {
                        data.push(response.data.data.data)
                        this.currentPage = response.data.data.current_page
                        this.lastPage = response.data.data.last_page
                    }).catch((error)=> {
                  // console.log(error)
              }); 
            }

            let formattedData = []
            for(let i=0;i<data.length;i++){
                formattedData.push(...data[i])
            }
            this.summaries = JSON.parse(JSON.stringify(formattedData))

            if(this.summaries.length > 0){
              this.currentSummaryId = this.summaries[0].id.toString()
            }
            // console.log(JSON.parse(JSON.stringify(this.summaries)))
        }).catch((error)=> {
            // console.log(error)
        }); 
  }
}
</script>

<style scoped>
    
</style>
