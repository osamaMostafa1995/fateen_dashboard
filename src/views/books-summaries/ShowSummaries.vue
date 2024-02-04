<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <div class="icard-header"><strong>جدول الملخصات</strong></div>
         <CTable hover small responsive="sm">
            <CTableHead>
            <CTableRow color="dark">
                <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell>
                <CTableHeaderCell scope="col">اسم الكتاب</CTableHeaderCell>
                <CTableHeaderCell scope="col">المؤلف</CTableHeaderCell>
                <CTableHeaderCell scope="col">من الصفحة</CTableHeaderCell>
                <CTableHeaderCell scope="col">إلي الصفحة</CTableHeaderCell>
                <CTableHeaderCell scope="col">صورة الغلاف</CTableHeaderCell>                
                <CTableHeaderCell scope="col">الحالة</CTableHeaderCell>                
                <CTableHeaderCell scope="col">تحميل الملفات</CTableHeaderCell>                
                <CTableHeaderCell scope="col">إدارة الملخص</CTableHeaderCell>
            </CTableRow>
            </CTableHead>
            <CTableBody>
            <CTableRow v-for="summary in summaries" :key="summary">
                <CTableHeaderCell scope="row">{{summary.id}}</CTableHeaderCell>
                <CTableDataCell>{{summary?.book?.book_name || '-'}}</CTableDataCell>
                <CTableDataCell>{{summary?.book?.author || '-' }}</CTableDataCell>
                <CTableDataCell>{{summary.from_page}}</CTableDataCell>
                <CTableDataCell>{{summary.to_page}}</CTableDataCell>
                <CTableDataCell v-if="!summary?.book?.book_cover_path.includes('null')">
                    <CImage rounded thumbnail :src='summary?.book?.book_cover_path' onerror=" this.src=defaultImage" width="50" height="50"/>  <!--summary?.book?.book_cover_path.replace(`"`, ``)-->
                </CTableDataCell>
                <CTableDataCell v-else>
                    <CImage rounded thumbnail :src="defaultImage" width="50" height="50"/>
                </CTableDataCell>
                <CTableDataCell v-if="summary.status_id == 0">
                    معلق
                </CTableDataCell>
                <CTableDataCell v-if="summary.status_id == 1">
                    مقبول
                </CTableDataCell>
                <CTableDataCell v-if="summary.status_id == 2">
                    مرفوض
                </CTableDataCell>
                <!-- <CTableDataCell>
                    <CImage class="my-1" v-for="referenceImage in article.reference_images_list" :key="referenceImage" rounded thumbnail :src="referenceImage" width="50" height="50"/>
                </CTableDataCell> -->

                <CTableDataCell>
                <CButton
                    color="info"
                    variant="outline"
                    @click="() => downloadSummaries(summary.summary_files_list)"
                >
                <CIcon icon="cil-cloud-download" size="lg" />
                </CButton>      
                </CTableDataCell>
                
                <CTableDataCell>
                <CButton
                    color="warning"
                    variant="outline"
                    @click="() => invokeModal(summary.id, summary?.book?.book_name, summary?.book?.author, summary.from_page, summary.to_page, summary?.book?.book_cover_path, summary?.status_id, summary?.user?.name, summary?.user?.email, summary?.user?.phone)"
                >
                 <CIcon icon="cil-pencil" size="lg" />
                </CButton>      
                </CTableDataCell>
            </CTableRow>
            </CTableBody>
        </CTable>

        <CModal size="lg" :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }">
            <CModalHeader>
            <CModalTitle>إدارة ملخص</CModalTitle>
            </CModalHeader>
            <CButton disabled v-show="isLoading">
                <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                Loading...
            </CButton>
            <CModalBody>
                <CCardBody>
                    <CForm class="row g-3">
                        <h4>بيانات الكتاب</h4>
                        <CCol :md="12">                
                            <CTableDataCell>
                                <CImage rounded thumbnail :src="this.coverImage" width="50" height="50"/>
                            </CTableDataCell>
                        </CCol>
                        <CCol :md="12">                
                            <strong><span> اسم الكتاب</span></strong> : 
                            <span>{{this.bookName}}</span>
                        </CCol>
                        <CCol :md="12">                         
                            <strong><span>المؤلف</span></strong> : 
                            <span>{{this.author}}</span>
                        </CCol>
                        <CCol :md="12">                         
                            <strong><span>من الصفحة</span></strong> : 
                            <span>{{this.fromPage}}</span>
                        </CCol>
                        <CCol :md="12">                         
                            <strong><span>إلي الصفحة</span></strong> : 
                            <span>{{this.toPage}}</span>
                        </CCol>
                                                
                        <h4>بيانات من قام بالتلخيص</h4>

                        <CCol :md="12">                         
                            <strong><span>الأسم</span></strong> : 
                            <span>{{this.userName}}</span> <br>
                        </CCol>

                        <CCol :md="12">
                            <strong><span>رقم الهاتف</span></strong> : 
                            <span>{{this.userPhone}}</span> <br>
                        </CCol>

                        <CCol :md="12">
                            <strong><span>البريد الإلكتروني</span></strong> : 
                            <span>{{this.userEmail}}</span> <br>
                        </CCol>
                        <hr>
                        <h4>إدارة الملخص</h4>
                        <CCol :md="12">
                            <CFormLabel for="inputState">اختيار الحالة</CFormLabel>
                            <CFormSelect v-model="statusId" id="inputState">
                                <option value="1">قبول</option>
                                <option value="2">رفض</option>
                            </CFormSelect>
                        </CCol>

                        <CCol :md="12" class="my-5">
                            <QuillEditor v-model:content="copiedText" theme="snow" contentType="html" id="editor"
                                :toolbar="['bold', 'italic', 'underline',
                                { 'list': 'ordered'}, { 'list': 'bullet' }, { 'direction': 'rtl' }, { 'header': [1, 2, 3, 4, 5, 6, false] }, 
                                {'color': [] }, { 'background': [] }, { 'font': [] }, { 'align': [] },
                                ]"   
                            />
                            <CFormFeedback :class="{haveError: copiedTextError}" v-if="copiedTextError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                        </CCol>
                        <CPagination>
                            <!-- <CPaginationItem class="paginated-style" @click="handlecdkEditPagination(1)">الأولي</CPaginationItem> -->
                            <div v-if="cdkcurrentPage == 1">
                                <CPaginationItem disabled>السابقة</CPaginationItem>
                            </div>
                            <div v-else>
                                <CPaginationItem class="paginated-style" @click="handlecdkEditPagination(cdkcurrentPage--)">السابقة</CPaginationItem>
                            </div>
<!--                             
                            <div v-if="cdkcurrentPage+1 <= cdklastPage">
                                <CPaginationItem class="paginated-style" @click="handlecdkEditPagination(cdkcurrentPage+1)">{{cdkcurrentPage+1}}</CPaginationItem>
                            </div>
                            <div v-if="cdkcurrentPage+2 <= cdklastPage">
                                <CPaginationItem class="paginated-style" @click="handlecdkEditPagination(cdkcurrentPage+2)">{{cdkcurrentPage+2}}</CPaginationItem>
                            </div>

                            <div v-if="cdkcurrentPage+3 <= cdklastPage">
                                <CPaginationItem class="paginated-style" @click="handlecdkEditPagination(cdkcurrentPage+3)">{{cdkcurrentPage+3}}</CPaginationItem>
                            </div>
                             -->
                            <div v-if="cdkcurrentPage == cdklastPage">
                                <CPaginationItem disabled>التالية</CPaginationItem>
                            </div>
                            <div v-else>
                                <CPaginationItem class="paginated-style" @click="handlecdkEditPagination(cdkcurrentPage++)">التالية</CPaginationItem>
                            </div>
                            <!-- <CPaginationItem class="paginated-style" @click="handlecdkEditPagination(cdklastPage)">الأخيرة</CPaginationItem> -->
                     
                            <CButton color="secondary" @click="() =>handlecdkEditPagination('save')"> حفظ الصفحة</CButton>

                        </CPagination>
                       
                       <br><br>
                    </CForm>
                </CCardBody>
            </CModalBody>
            <CModalFooter>
            <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
                غلق
            </CButton>
            <CButton color="primary" @click="updateSummary">تعديل</CButton>
            </CModalFooter>
        </CModal>

        <CPagination>
            <!-- <CPaginationItem class="paginated-style" @click="handlePagination(1)">الأولي</CPaginationItem> -->
            <div v-if="currentPage == 1">
                <CPaginationItem disabled>السابقة</CPaginationItem>
            </div>
            <div v-else>
                <CPaginationItem class="paginated-style" @click="handlePagination(currentPage--)">السابقة</CPaginationItem>
            </div>
            
            <!-- <div v-if="currentPage+1 <= lastPage">
                <CPaginationItem class="paginated-style" @click="handlePagination(currentPage+1)">{{currentPage+1}}</CPaginationItem>
            </div>
            <div v-if="currentPage+2 <= lastPage">
                <CPaginationItem class="paginated-style" @click="handlePagination(currentPage+2)">{{currentPage+2}}</CPaginationItem>
            </div>

            <div v-if="currentPage+3 <= lastPage">
                <CPaginationItem class="paginated-style" @click="handlePagination(currentPage+3)">{{currentPage+3}}</CPaginationItem>
            </div> -->
            
            <div v-if="currentPage == lastPage">
                <CPaginationItem disabled>التالية</CPaginationItem>
            </div>
            <div v-else>
                <CPaginationItem class="paginated-style" @click="handlePagination(currentPage++)">التالية</CPaginationItem>
            </div>
            <!-- <CPaginationItem class="paginated-style" @click="handlePagination(lastPage)">الأخيرة</CPaginationItem> -->
        </CPagination>
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

sessionStorage.setItem("currentSummaryId", 1);

export default {
    name: 'Tables',
    data(){
        return {
            visibleLiveDemo: false,

            summaries: [],
            bookName: "",
            author: "",
            fromPage: "",
            toPage: "",
            coverImage: "",

            userName: "",
            userEmail: "",
            userPhone: "",

            statusId: null,
   
            currentSummaryId: null,

            isLoading: false,
            currentPage: 1,
            lastPage: null,
   
            cdkcurrentPage:1 ,
            cdklastPage: 50,
            
            savedPages:[],
            savedPagesIds:[] ,

            defaultImage: "https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png"
        }
    },
    methods: {
        handlePagination(currentPage){
            // console.log("current", this.currentPage)
            sessionStorage.setItem("summaryCurrentPage", this.currentPage);
            axios.get(`${baseUrl}/admin/book-summaries/all?page=`+this.currentPage, config)
            .then((response) => {
                this.summaries = response.data.data.data
                this.currentPage = response.data.data.current_page
                this.lastPage = response.data.data.last_page
            }).catch(function (error) {
                console.log(error)
            }); 
        },
        invokeModal(id, bookName, author, fromPage, toPage, bookCoverPath, statusId, userName, userEmail, userPhone){
            this.currentSummaryId = id
            this.bookName = bookName
            this.author = author
            this.fromPage = fromPage
            this.toPage = toPage
            this.coverImage = bookCoverPath
            this.statusId = statusId

            this.userName = userName
            this.userEmail = userEmail
            this.userPhone = userPhone

            this.visibleLiveDemo = true

            axios.get(`${baseUrl}/admin/book-summary/page/show?book_summary_id=${this.currentSummaryId}&page=${this.cdkcurrentPage}`, config)
            .then((response) => {
            console.log("ssss",response.data.data.data[0]) 
            document.getElementsByClassName('ql-editor')[0].innerHTML  =  response.data.data.data[0]?.page_content
            document.getElementsByClassName('ql-editor')[0].setAttribute('id',response.data?.data?.data[0]?.id)
            console.log("summaries",this.summaries)
            // this.cdkcurrentPage+=1
            }).catch(function (error) {
                console.log(error)
            }); 
 
        },
        updateSummary(){
            this.isLoading = true
            let requestBody = new FormData();
            requestBody.append('book_summary_id', this.currentSummaryId)
            requestBody.append('status_id', this.statusId)

            axios.post(`${baseUrl}/admin/book-summaries/manage`, requestBody, config).then((response) => {
                if(response.data.status == false){                         
                    this.isLoading = false
                    console.log('error')
                    this.$swal({
                        title: 'عذرا, هناك خطأ',
                        text: response.data.errors[0],
                        icon: 'error'
                    })
                }else{
                    this.isLoading = false
                    this.$swal({
                        title: 'تم التعديل بنجاح',
                        // text: 'Welcome Back, Admin',
                        icon: 'success'
                    })
                }
                }).then( () => {
                axios.get(`${baseUrl}/admin/book-summaries/all?page=`+sessionStorage.getItem("summaryCurrentPage"), config)
                    .then((response) => {
                        this.summaries = response.data.data.data                       
                    }).catch(function (error) {                                                        
                        console.log(error)
                    });
                }).catch(function (error) {                                                
                console.log(error);
            }).catch(function (error) {                                                
                console.log(error);
            })
        },
        downloadSummaries(files){
            
            if(files.length > 0){
                for(let i=0;i<files.length;i++){
                    window.open(files[i], "w"+i)
                }
            }
            
        },
        handlecdkEditPagination(Editpage){
            console.log(this.cdkcurrentPage)
            axios.get(`${baseUrl}/admin/book-summary/page/show?book_summary_id=${this.currentSummaryId}&page=${this.cdkcurrentPage}`, config)
            .then((response) => {
            console.log("ssss",response.data.data.data[0]) 
            document.getElementsByClassName('ql-editor')[0].innerHTML  =  response.data.data.data[0]?.page_content
            document.getElementsByClassName('ql-editor')[0].setAttribute('id',response.data?.data?.data[0]?.id)
                if(Editpage=='save') {
                    this.savedPages.push(document.getElementsByClassName('ql-editor')[0].innerHTML)
                    this.savedPagesIds.push(document.getElementsByClassName('ql-editor')[0].id)
                    console.log("updated pages"  , this.savedPages)
                    console.log("updated pages id"  , this.savedPagesIds)
                }
            }).catch(function (error) {
                console.log(error)
            });
        },

        // savePage(){
        //    this.savedPages.push(document.getElementsByClassName('ql-editor')[0].innerHTML)
        // }
    },
    mounted(){
        axios.get(`${baseUrl}/admin/book-summaries/all?page=`+sessionStorage.getItem("summaryCurrentPage"), config)
        .then((response) => {
            this.summaries = response.data.data.data
            this.currentPage = response.data.data.current_page
            this.lastPage = response.data.data.last_page

           console.log("summaries",this.summaries)
        }).catch(function (error) {
            console.log(error)
        }); 
    }
}
</script>

<style scoped>
    .paginated-style{
        cursor:pointer;
    }
    .icard-header {
        padding: var(--cui-card-cap-padding-y) var(--cui-card-cap-padding-x);
        margin-bottom: 0;
        color: var(--cui-card-cap-color);
        background-color: var(--cui-card-cap-bg);
        border-bottom: var(--cui-card-border-width) solid var(--cui-card-border-color);
    }

    .icard-header::before, .icard-header::after {
        box-sizing: content-box;
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
    

    th:nth-of-type(8){
      min-width:150px !important;
    }

</style> 