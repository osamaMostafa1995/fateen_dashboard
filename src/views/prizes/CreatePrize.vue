<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>إضافة جائزة</strong>
        </CCardHeader>
        <CCardBody>
            <!-- <FlashMessage position="center top" time="3000" /> -->
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
                    <CFormFeedback :class="{haveError: titleError}" v-if="titleError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">                         
                    <p for="code">الكود</p>
                    <input 
                        id="code" 
                        type="text" 
                        class="p-2"
                        :class="{onError: codeError, 'form-control' : !codeError}"
                        v-model="code"
                    />
                    <CFormFeedback :class="{haveError: codeError}" v-if="codeError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">                         
                    <p for="description">الوصف</p>
                    <textarea 
                        id="description" 
                        type="text" 
                        :class="{onError: descriptionError, 'form-control' : !descriptionError}"
                        v-model="description"
                    />
                    <CFormFeedback :class="{haveError: descriptionError}" v-if="descriptionError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">                         
                    <p for="explanation">الشرح</p>
                    <textarea 
                        id="explanation" 
                        type="text" 
                        :class="{onError: explanationError, 'form-control' : !explanationError}"
                        v-model="explanation"
                    />
                    <CFormFeedback :class="{haveError: explanationError}" v-if="explanationError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">                         
                    <p for="terms">الشروط و الأحكام</p>
                    <textarea 
                        id="terms" 
                        type="text" 
                        :class="{onError: termsError, 'form-control' : !termsError}"
                        v-model="terms"
                    />
                    <CFormFeedback :class="{haveError: termsError}" v-if="termsError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">
                    <CFormLabel for="inputState">النوع</CFormLabel>
                    <CFormSelect id="inputState"  class="p-2">
                        <option value=0>يومي</option>
                        <option value=1>اسبوعي</option>
                        <option value=2>شهري</option>
                    </CFormSelect>
                </CCol>
                <CCol :md="12">                         
                    <p for="discountPercent">نسبة الخصم (نسبة مئوية)</p>
                    <input 
                        id="discountPercent" 
                        type="text"
                        class="p-2" 
                        :class="{onError: discountPercentError, 'form-control' : !discountPercentError}"
                        v-model="discountPercent"
                    />
                    <CFormFeedback :class="{haveError: discountPercentError}" v-if="discountPercentError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                    <CFormFeedback :class="{haveError: discountPercentErrorNumber}" v-if="discountPercentErrorNumber">يجب ان يكون الحقل رقما .</CFormFeedback><br>                  
                </CCol>
                <CCol :md="12">                         
                    <p for="expirationDate">تاريخ انتهاء الصلاحية</p>
                    <input 
                        id="expirationDate" 
                        type="date" 
                        class="p-2"
                        :class="{onError: expirationDateError, 'form-control' : !expirationDateError}"
                        v-model="expirationDate"
                    />
                    <CFormFeedback :class="{haveError: expirationDateError}" v-if="expirationDateError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
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
  name: 'Create Prize',
   data(){
      return {
        title: "",
        code: "",
        description: "",
        explanation: "",
        terms: "",
        type: 0,
        discountPercent: "",
        expirationDate: "",

        titleError: "",
        codeError: "",
        descriptionError: "",
        explanationError: "",
        termsError: "",
        typeError: "",
        discountPercentError: "",
        expirationDateError: "",
        discountPercentErrorNumber: ""
    }
  },

  methods : {
      handleSubmit(){

        console.log( parseInt (this.discountPercent) )

        if(this.title == ""){
            this.titleError = true
        }
        if(this.title != ""){
            this.titleError = false
        }

        if(this.code == ""){
          this.codeError = true
        }
        if(this.code != ""){
          this.codeError = false
        }

        if(this.description == ""){
          this.descriptionError = true
        }
        if(this.description != ""){
          this.descriptionError = false
        }

        if(this.explanation == ""){
          this.explanationError = true
        }
        if(this.explanation != ""){
          this.explanationError = false
        }

        if(this.terms == ""){
          this.termsError = true
        }
        if(this.terms != ""){
          this.termsError = false
        }

        if(this.type == ""){
          this.typeError = true
        }
        if(this.type != ""){
          this.typeError = false
        }

        if(this.discountPercent == ""){
          this.discountPercentError = true
        }
        if(this.discountPercent != ""){
          this.discountPercentError = false
        }
        if( isNaN (parseInt (this.discountPercent))){
          this.discountPercentErrorNumber = true
        }
        if( !isNaN (parseInt (this.discountPercent))){
          this.discountPercentErrorNumber = false
        }

        if(this.expirationDate == ""){
          this.expirationDateError = true
        }
        if(this.expirationDate != ""){
          this.expirationDateError = false
        }


        if(this.title && this.code && this.description && this.explanation && this.type != null && !this.discountPercentErrorNumber && this.expirationDate){
            axios.post(`${baseUrl}/admin/award/create`, {
              'title' : this.title,
              'code' : this.code,
              'description' : this.description,
              'explanation' : this.explanation,
              'terms' : this.terms,
              'type' : this.type,
              'discount_percent' : this.discountPercent,
              'expiration_date' : this.expirationDate
            }, config).then((response) => {
              // console.log(response.data);
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
                this.code = ''
                this.description = ''
                this.explanation = ''
                this.terms = ''
                this.type = ''
                this.discountPercent = ''
                this.expirationDate = ''

                this.$router.push('/prizes/all') 

              }
            }).catch((error) =>{
              console.log(error);
            });
        }
    }
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
