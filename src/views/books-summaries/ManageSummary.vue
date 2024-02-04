<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>نسخ ملخص</strong>
        </CCardHeader>
        <CCardBody>
            <CForm class="row g-3">
                <!-- <strong>نسخ ملخص</strong> -->
                <CCol :md="12">
                    <CFormLabel for="inputState">اختيار الملخص بأسم الكتاب</CFormLabel>
                    <CFormSelect v-model="currentSummaryId" id="inputState"  class="p-2">
                        <option v-for="summary in summaries" :value="summary.id" :key="summary">{{summary.book_name}}</option>
                    </CFormSelect>
                </CCol>
                <!-- <CCol :md="12" v-if="currentSummaryId != null">                
                    <CTableDataCell>
                        <CImage rounded thumbnail :src="summaries[currentSummaryId-1].book_cover_path" width="50" height="50"/>
                    </CTableDataCell>
                </CCol>
                 <CCol :md="12" v-if="currentSummaryId != null">
                    <CFormLabel>صفحات التلخيص</CFormLabel>
                    <p>من الصفحة: {{summaries[currentSummaryId-1].from_page|| 0}}</p>
                    <p>إلي الصفحة: {{summaries[currentSummaryId-1].to_page}}</p>
                </CCol>  -->
                <CCol :md="12" class="my-5">
                  <QuillEditor v-model:content="copiedTextManage" theme="snow" contentType="html" id="editor"
                    :toolbar="['bold', 'italic', 'underline',
                    { 'list': 'ordered'}, { 'list': 'bullet' }, { 'direction': 'rtl' }, { 'header': [1, 2, 3, 4, 5, 6, false] }, 
                    {'color': [] }, { 'background': [] }, { 'font': [] }, { 'align': [] },
                    ]"   
                  />

                  <CPagination>
                        <div v-if="cdkcurrentManagePage == 0" class="my-1 mx-1">
                            <CPaginationItem disabled>
                              الصفحة السابقة</CPaginationItem>
                        </div>
                        <div v-else class="my-1 mx-1">
                            <CPaginationItem class="paginated-style" @click="handlecdkPagination('sub')">
                            الصفحة السابقة</CPaginationItem>
                        </div>
                        <div v-if="cdkcurrentManagePage == cdklastManagePage" class="my-1 mx-1">
                            <CPaginationItem disabled>
                             صفحة جديدة</CPaginationItem>
                        </div>
                        <div v-else class="my-1 mx-1">   
                            <CPaginationItem class="paginated-style" @click="handlecdkPagination('add')">
                              صفحة جديدة</CPaginationItem>
                        </div>
                      
                    </CPagination>

                  <CFormFeedback :class="{haveError: copiedTextManageError}" v-if="copiedTextManageError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol><br><br>

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
// import VueHtml2pdf from 'vue-html2pdf'
export default {

  name: 'Copy Summary',
  data(){
    return {
        currentSummaryId: null,
        summaries: [],
        copiedTextManage: "<p><bold>this is a book summary with bold text</bold></p>",
        copiedHTML: "",
        copiedTextManageError: "",
        isLoading: false,
        cdkcurrentManagePage:0 ,
        cdklastManagePage:50 , 
        pagesContent:[]
    }
  },

  methods: {
 
    handleSubmit(){      
      
      var filtered = this.pagesContent.filter(function (el) {
          if(el!="<p><br></p>"||el !='') {
            return el
          }
      });

      console.log("filtered",filtered);
        // if(this.copiedTextManage == ""){
        //     this.copiedTextManageError = true
        // }
        // if(this.copiedTextManage != ""){
        //     this.copiedTextManageError = false
        // }

        // if(this.copiedTextManage != ""){

        //   //  console.log(this.copiedTextManage)

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
        //     }).catch(function (error) {
        //       // console.log(error);
        //     });
        // }
    },
    addPage(){
      console.log("pagesContent", this.pagesContent )
      // document.getElementById('editor').innerHTML ='<p><strong>Hello</strong></p>' 
    },
    handlecdkPagination(page){ 
      if(page=='add') {
        if(this.cdkcurrentManagePage!=this.cdklastManagePage) { 
            this.cdkcurrentManagePage+=1 ;
            if(this.pagesContent.length!=0 && (this.cdkcurrentManagePage-1 <=  this.pagesContent.length-1)){
              //  document.getElementsByClassName('ql-editor')[0].innerHTML  = this.pagesContent[this.cdkcurrentManagePage-1] 
              //  console.log("case 1")
                if(this.copiedTextManage!=this.pagesContent[this.cdkcurrentManagePage-2]){
                  this.document.getElementsByClassName('ql-editor')[0].innerHTML  =pagesContent[this.cdkcurrentManagePage-2]=this.copiedTextManage
                this.pagesContent[this.cdkcurrentManagePage-1] 
                }
                else if ( this.pagesContent[this.cdkcurrentManagePage-2]==this.copiedTextManage && this.copiedTextManage!='') {
                  document.getElementsByClassName('ql-editor')[0].innerHTML  = this.pagesContent[this.cdkcurrentManagePage-1] 
                }
                // console.log("dfdfasdfasf",  this.copiedTextManage ,this.pagesContent[this.cdkcurrentManagePage-2])
                // console.log("case 1")
            }
            else {
              this.pagesContent.push(this.copiedTextManage)
              this.copiedTextManage=''
              document.getElementsByClassName('ql-editor')[0].innerHTML  = ""
              // console.log("case 2")
            }
          //console.log("pagesContent",this.pagesContent)
        }
      } 
      else if(page=='sub') {  
      // console.log("pagesContent sub",this.pagesContent)
        if(this.cdkcurrentManagePage-1>0) {  
          this.cdkcurrentManagePage-=1 ;
          document.getElementsByClassName('ql-editor')[0].innerHTML  = this.pagesContent[this.cdkcurrentManagePage-1] 
          // console.log("prev",this.pagesContent[this.cdkcurrentManagePage])
        }
      }
      console.log("pagesContent",this.pagesContent)
    },
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
                    }).catch(function (error) {
                  console.log(error)
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
        }).catch(function (error) {
            console.log(error)
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

    .modal-footer{
      margin-right: -.73em;
    }


</style>
