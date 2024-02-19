<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>جدول الجوائز</strong>

          <CButton disabled v-show="isLoading">
             <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
             جاري التحميل ... 
          </CButton>

        </CCardHeader>
      
        <CTable hover small responsive="sm" striped v-if="!isLoading">
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell>
                  <CTableHeaderCell scope="col">العنوان</CTableHeaderCell>
                  <CTableHeaderCell scope="col">الوصف</CTableHeaderCell>
                  <CTableHeaderCell scope="col">الشرح</CTableHeaderCell>
                  <CTableHeaderCell scope="col">الشروط و الأحكام</CTableHeaderCell>
                  <CTableHeaderCell scope="col">الكود</CTableHeaderCell>
                  <CTableHeaderCell scope="col">نسبة الخصم</CTableHeaderCell>
                  <CTableHeaderCell scope="col">النوع</CTableHeaderCell>
                  <CTableHeaderCell scope="col">تاريخ انتهاء الصلاحية</CTableHeaderCell>
                  <CTableHeaderCell scope="col">إعدادات</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="award in awards" :key="award">
                  <CTableHeaderCell scope="row">{{award.id}}</CTableHeaderCell>
                  <CTableDataCell>{{award.title}}</CTableDataCell>
                  <CTableDataCell>
                    <p v-for="element in (award.description.split(/\r?\n/))" :key="element">
                        {{element}}
                    </p>
                  </CTableDataCell>
                  <CTableDataCell>
                    <p v-for="element in (award.explanation.split(/\r?\n/))" :key="element">
                        {{element}}
                    </p>
                  </CTableDataCell>
                  <CTableDataCell>
                    <p v-for="element in (award.terms.split(/\r?\n/))" :key="element">
                        {{element}}
                    </p>
                  </CTableDataCell>
                  <CTableDataCell>{{award.code}}</CTableDataCell>
                  <CTableDataCell>{{award.discount_percent}}</CTableDataCell>
                  <CTableDataCell v-if="award.type == 0">
                    يومي
                  </CTableDataCell>
                  <CTableDataCell v-if="award.type == 1">
                    اسبوعي
                  </CTableDataCell>
                  <CTableDataCell v-if="award.type == 2">
                    شهري
                  </CTableDataCell>
                  <CTableDataCell>{{award.expiration_date}}</CTableDataCell>
                  <CTableDataCell>
                     <CButton
                      color="warning"
                      variant="outline"
                      @click="() => invokeModal(award.id, award.title, award.description, award.explanation, award.terms, award.code, award.discount_percent, award.type, award.expiration_date)"
                    >
                    <CIcon icon="cil-pencil" size="lg" />
                    </CButton>
                    &nbsp;
                    <CButton
                      color="danger"
                      variant="outline"
                      @click="deleteAward(award.id)"
                    >              
                    <CIcon icon="cil-basket" size="lg" />
                    </CButton>
                   
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
                <CTableRow class="text-center" v-for=" row in [].constructor(10)"> 
                    <CTableHeaderCell scope="col" v-for="  column in [].constructor(10)"> 
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
      </CCard>
    </CCol>
  </CRow>

  <CModal :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }">
    <CModalHeader>
      <CModalTitle>تعديل جائزة</CModalTitle>
    </CModalHeader>
    <CModalBody>
          <CCardBody>
            <CForm class="row g-3">
                <CCol :md="12">                
                    <p for="title">العنوان</p>
                    <input 
                        id="title" 
                        type="text" 
                        class="form-control"
                        v-model="title"
                    />
                </CCol>
                <CCol :md="12">                         
                    <p for="code">الكود</p>
                    <input 
                        id="code" 
                        type="text" 
                        class="form-control"
                        v-model="code"
                    />
                </CCol>
                <CCol :md="12">                         
                    <p for="description">الوصف</p>
                    <CFormTextarea 
                        id="description" 
                        type="text" 
                        class="form-control"
                        v-model="description"
                        rows="4"
                    ></CFormTextarea>
                </CCol>
                <CCol :md="12">                         
                    <p for="explanation">الشرح</p>
                    <CFormTextarea 
                        id="explanation" 
                        type="text" 
                        class="form-control"
                        v-model="explanation"
                        rows="4"
                    ></CFormTextarea>
                </CCol>
                <CCol :md="12">                         
                    <p for="terms">الشروط و الأحكام</p>
                    <CFormTextarea 
                        id="terms" 
                        type="text" 
                        class="form-control"
                        v-model="terms"
                        rows="4"
                    ></CFormTextarea>
                </CCol>
                <CCol :md="12">
                    <CFormLabel for="inputState">النوع</CFormLabel>
                    <CFormSelect id="inputState" v-model="type">
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
                        :class="{onError: discountPercentErrorMaxMin, 'form-control' : !discountPercentErrorMaxMin}"
                        v-model="discountPercent"
                    />
                    <CFormFeedback :class="{haveError: discountPercentErrorNumber}" v-if="discountPercentErrorNumber">يجب ان يكون الحقل رقما .</CFormFeedback><br>
                    <CFormFeedback :class="{haveError: discountPercentErrorMaxMin}" v-if="discountPercentErrorMaxMin">يجب ان يكون الحقل رقما اقل من او يساوي ١٠٠ .</CFormFeedback><br>                   
                </CCol>
                <CCol :md="12">                         
                    <p for="expirationDate">تاريخ انتهاء الصلاحية</p>
                    <input 
                        id="expirationDate" 
                        type="text" 
                        class="form-control"
                        v-model="expirationDate"
                        placeholder="مثال: 30 نوفمبر 2022"
                    />
                </CCol> 
            </CForm>
        </CCardBody>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
        غلق
      </CButton>
      <CButton color="primary" @click="updateAward">تعديل</CButton>
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
            header:['الرقم التعريفي'  ,'العنوان', 'الوصف' , 'الشرح ' , 'الشروط و الأحكام', 'الكود', ' نسبة الخصم', ' النوع', 'تاريخ انتهاء الصلاحية',' إعدادات'],
            awards: [],
            visibleLiveDemo: false,

            title: "",
            description: "",
            explanation: "",
            terms: "",
            code: "",
            discountPercent: "",
            type: null,
            expirationDate: "",

            currentAwardId: null,
            isLoading: true,

            discountPercentErrorNumber: false,
            discountPercentErrorMaxMin: false
        }
    },
    methods: {
        deleteAward(id) {
            if(confirm("هل متأكد من عملية الحذف؟")){
                axios.delete(`${baseUrl}/admin/award/delete?award_id=${id}`, config)
                .then(response => {
                    this.$swal({
                        title: 'تم الحذف بنجاح',
                        icon: 'success'
                    })
                }).then( () => {
                    axios.get(`${baseUrl}/awards/show`)
                    .then((response) => {
                        this.awards = response.data.data
                    }).catch((error) => {
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
        invokeModal(id, title, description, explanation, terms, code, discount_percent, type, expiration_date){

          this.currentAwardId = id
          this.title = title
          this.description = description
          this.explanation = explanation
          this.terms = terms
          this.code = code
          this.discountPercent = discount_percent
          this.type = type
          this.expirationDate = expiration_date

          this.visibleLiveDemo = true
        },
        updateAward(){

            if( isNaN (parseInt (this.discountPercent))){
                this.discountPercentErrorNumber = true
            }
            if( !isNaN (parseInt (this.discountPercent))){
                this.discountPercentErrorNumber = false
            }

            if( parseInt(this.discountPercent) > 100 || parseInt(this.discountPercent) < 0){
                this.discountPercentErrorMaxMin = true
            }

            if( parseInt(this.discountPercent) <= 100 && parseInt(this.discountPercent) >= 0){
                this.discountPercentErrorMaxMin = false
            }

            let requestBody = new FormData();
            requestBody.append('award_id', this.currentAwardId)

            if(this.title != ''){
                requestBody.append('title', this.title)
            }
            if(this.description != ''){
                requestBody.append('description', this.description)
            }
            if(this.explanation != ''){
                requestBody.append('explanation', this.explanation)
            }
            if(this.terms != ''){
                requestBody.append('terms', this.terms)
            }
            if(this.code != ''){
                requestBody.append('code', this.code)
            }
            if(this.discount_percent != ''){
                requestBody.append('discount_percent', this.discountPercent)
            }
            if(this.type != ''){
                requestBody.append('type', this.type)
            }
            if(this.expiration_date != ''){
                requestBody.append('expiration_date', this.expirationDate)
            }

            if(!isNaN (parseInt (this.discountPercent)) && !this.discountPercentErrorMaxMin){
                axios.post(`${baseUrl}/admin/award/update`, requestBody, config).then((response) => {
                // console.log(response.data);
                if(response.data.status == false){
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
                        axios.get(`${baseUrl}/awards/show`)
                        .then((response) => {
                            this.awards = response.data.data
                        }).catch((error) => {
                            console.log(error)
                        });
                    }).catch((error) => {
                    console.log(error);
                });
            }
                
        }
    },
    mounted(){
        axios.get(`${baseUrl}/awards/show`)
        .then((response) => {
            // console.log(response.data.data)
            this.awards = response.data.data
            this.isLoading = false
            // console.log(this.cities)
        }).catch((error) => {
            console.log(error)
            this.isLoading = false
        }); 
    }
}
</script>

<style scoped>

    /* .form-control {  
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

    .icard-header::before, .icard-header::after {
        box-sizing: content-box;
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

    p{
        width:250px;
       overflow:hidden;
        line-height: 2rem;
        max-height: 8rem;
        -webkit-box-orient: vertical;
        display: block;
        display: -webkit-box;
        overflow: hidden !important;
        text-overflow: ellipsis;
        -webkit-line-clamp: 4;
    } */
  th:nth-of-type(3) , th:nth-of-type(4), th:nth-of-type(5) {
    min-width:300px;
  }
 
  th:nth-of-type(9) {
    min-width: 165px !important;
   }
  th:nth-of-type(10) {
    min-width:150px !important;
  }
</style>


