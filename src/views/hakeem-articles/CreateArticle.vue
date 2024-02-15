<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>إضافة مقالة</strong>
        </CCardHeader>
        <CCardBody>
            <CForm class="row g-3">
                <CCol :md="12">                
                    <p for="title">العنوان</p>
                    <input 
                        id="title" 
                        type="text" 
                        class="p-2"
                        :class="{onError: titleError, 'form-control' : !titleError}"
                        v-model="title"
                    />
                    <CFormFeedback :class="{haveError: titleError}" v-if="titleError">يجب ألا يكون الحقل المطلوب فارغاً او اكثر من 60 حرف</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">                         
                    <p for="description">الوصف</p>
                    <textarea 
                        id="description" 
                        type="text" 
                        :class="{onError: descriptionError, 'form-control' : !descriptionError}"
                        v-model="description"
                        rows="4"
                    ></textarea>
                    <CFormFeedback :class="{haveError: descriptionError}" v-if="descriptionError">يجب ألا يكون الحقل المطلوب فارغاً او اكثر من 800 حرف</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">                         
                    <p for="quoteTitle">عنوان للإقتباس</p>
                    <textarea 
                        id="quoteTitle" 
                        type="text" 
                        :class="{onError: quoteTitleError, 'form-control' : !quoteTitleError}"
                        v-model="quoteTitle"
                        rows="4"
                    ></textarea>
                    <CFormFeedback :class="{haveError: quoteTitleError}" v-if="quoteTitleError">يجب ألا يكون الحقل المطلوب فارغاً او اكثر من 60 حرف</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">                         
                    <p for="quote">اقتباس</p>
                    <textarea 
                        id="quote" 
                        type="text" 
                        :class="{onError: quoteError, 'form-control' : !quoteError}"
                        v-model="quote"
                        rows="4"
                    ></textarea>
                    <CFormFeedback :class="{haveError: quoteError}" v-if="quoteError">يجب ألا يكون الحقل المطلوب فارغاً او اكثر من 800 حرف</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">                         
                    <p for="example">مثال</p>
                    <textarea 
                        id="example" 
                        type="text" 
                        :class="{onError: exampleError, 'form-control' : !exampleError}"
                        v-model="example"
                        rows="4"
                    ></textarea>
                    <CFormFeedback :class="{haveError: exampleError}" v-if="exampleError">يجب ألا يكون الحقل المطلوب فارغاً او اكثر من 1000 حرف</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">
                    <p>تحميل الصورة الرئيسية</p>
                    <div>
                      <div class="dropzone dz-clickable">
                        <div class="dz-message needsclick ng-star-inserted">
                          <span class="note needsclick">
                            (يمكن تحديد صورة تحتوي علي الامتدادات <strong>TIFF</strong> 
                            ,<strong _ngcontent-vma-c163="">JPG</strong> , <strong>GIF</strong> ,
                              <strong _ngcontent-vma-c163="">PNG</strong> )</span>
                        </div><br>
                        <!-- <input v-bind="getInputProps()" /> -->
                        <CIcon icon="cil-cloud-download" />
                        <p>انقر هنا لتحميل الصورة الرئيسية </p>
                       <CFormInput type="file" size="lg" id="mainfile" @change="onMainImageUpload"/>
                       <CFormFeedback :class="{haveError: mainImageError}" v-if="mainImageError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                      </div>
                    </div>
                </CCol>
                <CCol :md="12">
                    <p>تحميل الصور المرجعية</p>
                    <div>
                      <div class="dropzone dz-clickable">
                        <div class="dz-message needsclick ng-star-inserted">
                          <span class="note needsclick">
                            (يمكن تحديد صورة تحتوي علي الامتدادات <strong>TIFF</strong> 
                            ,<strong _ngcontent-vma-c163="">JPG</strong> , <strong>GIF</strong> ,
                              <strong _ngcontent-vma-c163="">PNG</strong> )</span>
                        </div><br>
                        <CIcon icon="cil-cloud-download" />
                        <p>انقر هنا لتحميل الصور المرجعية</p>
                       <CFormInput type="file" size="lg" id="myfiles" multiple @change="onFilesUpload"/>
                       <CFormFeedback :class="{haveError: filesError}" v-if="filesError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                      </div>
                    </div>
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
import { ref } from "vue"

const baseUrl = env.baseUrl

const token = localStorage.token
const config = {
    headers: { Authorization: `Bearer ${token}` }
}

let imgInput = ref(null)
let filesInput = ref(null)

export default {
  name: 'Create Fact',
   data(){
      return {
        title: "",
        description: "",
        quoteTitle: "",
        quote: "",
        example: "",
        mainImage: "",

        titleError: "",
        descriptionError: "",
        quoteTitleError: "",
        quoteError: "",
        exampleError: "",
        mainImageError: "",

        files: [],
        filesError: "",
    }
  },

  methods : {
    handleSubmit(){        
        if(this.title == "" || this.title.length > 60){
            this.titleError = true
        }
        if(this.title != "" && this.title.length <= 60){
            this.titleError = false
        }
        if(this.description == "" || this.description.length > 800){
          this.descriptionError = true
        }
        if(this.description != "" && this.description.length <= 800){
          this.descriptionError = false
        }
        if(this.quoteTitle == "" || this.quoteTitle.length > 60){
          this.quoteTitleError = true
        }
        if(this.quoteTitle != "" && this.quoteTitle.length <= 60){
          this.quoteTitleError = false
        }
        if(this.quote == "" || this.quote.length > 800){
          this.quoteError = true
        }
        if(this.quote != "" && this.quote.length <= 800){
          this.quoteError = false
        }
        if(this.example == "" || this.example.length > 1000){
          this.exampleError = true
        }
        if(this.example != "" && this.example.length <= 1000){
          this.exampleError = false
        }
        if(this.mainImage == ""){
          this.mainImageError = true
        }
        if(this.mainImage != ""){
          this.mainImageError = false
        }

        if(this.files.length == 0){
          this.filesError = true
        }

        if(this.files.length > 0){
          this.filesError = false
        }

        if(this.title && this.description && this.quote && this.example && !this.filesError && !this.mainImageError){

            let requestBody = new FormData();

            requestBody.append('title', this.title)
            requestBody.append('description', this.description)
            requestBody.append('quotes_title', this.quoteTitle)
            requestBody.append('quotes', this.quote)
            requestBody.append('example', this.example)
            requestBody.append('image', this.mainImage)

            if(this.files.length != 0 ){
                for( var i = 0; i < this.files.length; i++ ){
                  let file = this.files[i];
                  // console.log(file);
                  requestBody.append('reference_images[' + i + ']', file);
                }
            }

            axios.post(`${baseUrl}/admin/article/create`, requestBody, config).then((response) => {
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

                this.title = ''
                this.description = ''
                this.quoteTitle = ''
                this.quote = ''
                this.example = ''
                this.mainImage = ''
                imgInput.value = null
                this.files = []
                filesInput.value = null

                this.$router.push('/hakeem-articles/all') 

              }
            }).catch((error) => {
              console.log(error);
            });
        }
    },
    onMainImageUpload(event) {
        // console.log(event.target.files[0])
        this.mainImage = event.target.files[0]
        imgInput = event.target
    },
    onFilesUpload(event) {
        // console.log(event.target.files[0])
        this.files = event.target.files
        filesInput = event.target
    },
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

     .dropzone.dz-clickable {
    /* cursor: pointer; */
    text-align: center;
    text-align: center;
    margin: 25px 0;
    border-radius: 5px;

    opacity: 1;
    -ms-filter: none;
    -webkit-filter: none;
    filter: none;
}

.dropzone {
  margin-right: auto;
  margin-left: auto;
  padding: 50px;
  border: 2px dashed var(--theme-deafult);
  border-radius: 15px;
  -o-border-image: none;
  border-image: none;
  background: rgba(115, 102, 255, 0.1);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-height: 150px;
  position: relative;
}

/* .dz-message {
  cursor: pointer;
} */
  
</style>
