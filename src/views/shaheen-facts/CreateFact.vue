<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>إضافة حقيقة</strong>
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
                    <p for="explanationTitle">عنوان للشرح (اختياري)</p>
                    <textarea 
                        id="explanationTitle" 
                        type="text" 
                        class="form-control"
                        v-model="explanationTitle"
                        rows="4"
                    ></textarea>
                    <CFormFeedback :class="{haveError: explanationTitleError}" v-if="explanationTitleError">يجب ألا يكون الحقل المطلوب فارغاً او اكثر من 60 حرف.</CFormFeedback><br>              
                </CCol>
                <CCol :md="12">                         
                    <p for="explanation">الشرح</p>
                    <textarea 
                        id="explanation" 
                        type="text" 
                        :class="{onError: explanationError, 'form-control' : !explanationError}"
                        v-model="explanation"
                        rows="4"
                    ></textarea>
                    <CFormFeedback :class="{haveError: explanationError}" v-if="explanationError">يجب ألا يكون الحقل المطلوب فارغاً او اكثر من 1000 حرف.</CFormFeedback><br>              
                </CCol>
                <CCol :md="12">
                    <p>تحميل الصور المرجعية (حقل اختياري)</p>
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
                        <p>انقر هنا لتحميل الصور المرجعية</p>
                       <CFormInput type="file" size="lg" id="myfiles" multiple @change="onFilesUpload"/>
                      </div>
                    </div>
                </CCol>
                <div class="modal-footer">
                  <CButton @click="handleSubmit"  class="py-2 px-5"  color="primary">إضافة</CButton>
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

export default {
  name: 'Create Fact',
   data(){
      return {
        title: "",
        description: "",
        explanationTitle: "",
        explanation: "",

        titleError: "",
        descriptionError: "",
        explanationError: "",
        explanationTitleError: "",

        files: [],
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
        if(this.explanation == "" || this.explanation.length > 1000){
          this.explanationError = true
        }
        if(this.explanation != "" && this.explanation.length <= 1000){
          this.explanationError = false
        }

        if(this.explanationTitle.length > 60){
          this.explanationTitleError = true
        }else{
          this.explanationTitleError = false
        }
        if(this.title && this.description && this.explanation){

                let requestBody = new FormData();

                requestBody.append('title', this.title)
                requestBody.append('description', this.description)
                requestBody.append('explanation_title', this.explanationTitle)
                requestBody.append('explanation', this.explanation)

                if(this.files.length != 0 ){
                    for( var i = 0; i < this.files.length; i++ ){
                      let file = this.files[i];
                      // console.log(file);
                      requestBody.append('reference_images[' + i + ']', file);
                    }
                }

                if(!this.explanationTitleError && !this.titleError){
                  axios.post(`${baseUrl}/admin/fact/create`, requestBody, config).then((response) => {
                  console.log(response.data);
                  if(response.data.status == false){
                    console.log('error')
                    this.$swal({
                        title: 'عذرا, هناك خطأ',
                        // text: 'Welcome Back, Admin',
                        icon: 'error'
                    })
                  }else{

                      this.title = ''
                      this.description = ''
                      this.explanationTitle = ''
                      this.explanation = ''
                      this.files = []
                      imgInput.value = null

                      this.$swal({
                          title: 'تمت الإضافه بنجاح',
                          // text: 'Welcome Back, Admin',
                          icon: 'success'
                      })

                      this.$router.push('/shaheen-facts/all') 
                    
                    }
                  }).catch(function (error) {
                    console.log(error);
                  });
            }
            
        }
    },
    onFilesUpload(event) {
        // console.log(event.target.files)
        this.files = event.target.files
        imgInput = event.target
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

    .onOptionalError {  
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
        /* border: 1px solid var(--cui-input-border-color, red); */
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
