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
                    <CFormSelect v-model="summaryId" id="inputState"  class="p-2">
                        <option v-for="summary in summaries" :value="summary.id" :key="summary">{{summary.book_name}}</option>
                    </CFormSelect>
                </CCol>
                <CCol :md="12" v-if="summaryId != null">                
                    <CTableDataCell>
                        <CImage rounded thumbnail :src="summaries[summaryId-1].book_cover_path" width="50" height="50"/>
                    </CTableDataCell>
                </CCol>
                <CCol :md="12" v-if="summaryId != null">
                    <CFormLabel>صفحات التلخيص</CFormLabel>
                    <p>من الصفحة: {{summaries[summaryId-1].from_page}}</p>
                    <p>إلي الصفحة: {{summaries[summaryId-1].to_page}}</p>
                </CCol> 
                <CCol :md="12" class="my-5">
                  <QuillEditor v-model:content="copiedText" theme="snow" contentType="html"
                    :toolbar="['bold', 'italic', 'underline',
                    { 'list': 'ordered'}, { 'list': 'bullet' }, { 'direction': 'rtl' }, { 'header': [1, 2, 3, 4, 5, 6, false] }, 
                    {'color': [] }, { 'background': [] }, { 'font': [] }, { 'align': [] },
                    ]"   
                  />
                  <CFormFeedback :class="{haveError: copiedTextError}" v-if="copiedTextError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
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

export default {
  name: 'Copy Summary',
  data(){
    return {
        summaryId: null,
        summaries: [],
        copiedText: "",
        copiedHTML: "",

        copiedTextError: "",

        isLoading: false,
        currentPage: null,
        lastPage: null
    }
  },

  methods: {
    handleSubmit(){        
        if(this.copiedText == ""){
            this.copiedTextError = true
        }
        if(this.copiedText != ""){
            this.copiedTextError = false
        }

        if(this.copiedText != ""){

           console.log(this.copiedText)

            let requestBody = new FormData();

            requestBody.append('book_summary_id', this.summaryId)
            requestBody.append('book_summary_text', this.copiedText)

            axios.post(`${baseUrl}/admin/book-summary/convert`, requestBody, config).then((response) => {
              console.log(response.data);
              if(response.data.status == false){
                console.log('error')
                this.$swal({
                    title: 'عذرا, هناك خطأ',
                    // text: 'Welcome Back, Admin',
                    icon: 'error'
                })
              }else{
                this.$swal({
                    title: 'تمت الإضافه بنجاح',
                    // text: 'Welcome Back, Admin',
                    icon: 'success'
                })

                this.copiedText = ''
                this.$router.push('/books-summaries/all') 

              }
            }).catch(function (error) {
              console.log(error);
            });
        }
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
              // console.log(this.currentPage)
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
              this.summaryId = this.summaries[0].id.toString()
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
