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
                <CTableHeaderCell scope="col">تنسيق الملخص</CTableHeaderCell>
            </CTableRow>
            </CTableHead>
            <CTableBody>
            <CTableRow v-for="summary in summaries" :key="summary">
                <CTableHeaderCell scope="row">{{summary.id}} </CTableHeaderCell>
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
                    @click="() => invokeEditModal(summary.id, summary?.book?.id, summary?.book?.author, summary?.from_page, summary?.to_page, summary?.book?.book_cover_path, summary?.status_id, summary?.user?.name, summary?.user?.email, summary?.user?.phone)"> 
                 <CIcon icon="cil-pencil" size="lg" />
                </CButton>      
                </CTableDataCell>

                <CTableDataCell>
                <CButton
                    color="success"
                    variant="outline"
                    @click="() => invokeAddModal(summary.id )"> 
                 <CIcon icon="cil-book" size="lg" />
                </CButton>      
                </CTableDataCell>

            </CTableRow>
            </CTableBody>
        </CTable>

        <CModal size="lg" :visible="visibleEditModel" @close="() => { visibleEditModel = false }">
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
                        <h5 class="fw-bold">بيانات الكتاب</h5>

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
                                  
                        <h5 class="fw-bold">بيانات من قام بالتلخيص</h5>

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
                        <h5 class="fw-bold">إدارة الملخص</h5>

                        <CCol :md="12">                         
                            <strong><span>من الصفحة</span></strong> : 
                            <input 
                                id="from_page" 
                                type="text"
                                class="p-2" 
                                :class="{onError: FromPageError, 'form-control' : !FromPageError}"
                                v-model="this.fromPage"
                              />
                              <CFormFeedback :class="{haveError: FromPageError}" v-if="FromPageError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>          

                        </CCol>

                        <CCol :md="12">                         
                            <strong><span>إلي الصفحة</span></strong> : 
                            <input 
                                id="to_page" 
                                type="text"
                                class="p-2" 
                                :class="{onError: ToPageError, 'form-control' : !ToPageError}"
                                v-model="this.toPage"
                              />
                              <CFormFeedback :class="{haveError: ToPageError}" v-if="ToPageError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>   

                        </CCol>
                                   
                        <CCol :md="12">
                            <CFormLabel for="inputState">اختيار الحالة</CFormLabel>
                            <CFormSelect v-model="statusId" id="inputState">
                                <option value="1">قبول</option>
                                <option value="2">رفض</option>
                            </CFormSelect>
                        </CCol>

                        <CCol :md="12" class="cdk-editor my-5">
                            <QuillEditor v-model:content="copiedText" theme="snow" contentType="html" id="editor"  
                                :toolbar="['bold', 'italic', 'underline',
                                { 'list': 'ordered'}, { 'list': 'bullet' }, { 'direction': 'rtl' }, { 'header': [1, 2, 3, 4, 5, 6, false] }, 
                                {'color': [] }, { 'background': [] }, { 'font': [] }, { 'align': [] },
                                ]"   
                            />
                            <CFormFeedback :class="{haveError: copiedTextError}" v-if="copiedTextError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                        </CCol>

                        <CPagination class="cdk-paginator">
                            <div class="d-flex">  
                       
                                <div  class="mx-1 my-2" v-if="cdkcurrentPage == 1">
                                    <CPaginationItem disabled>السابقة</CPaginationItem>
                                </div>
                                <div class="mx-1 my-2" v-else>
                                    <CPaginationItem class="paginated-style" @click="handleCdkEditPagination(cdkcurrentPage--)">السابقة</CPaginationItem>
                                </div>
   
                                <div class="mx-1 my-2" v-if="cdkcurrentPage == cdklastPage">
                                    <CPaginationItem disabled>التالية</CPaginationItem>
                                </div>
                                <div class="mx-1 my-2" v-else>
                                    <CPaginationItem class="paginated-style" @click="handleCdkEditPagination(cdkcurrentPage++)">التالية</CPaginationItem>
                                </div>
                               
                            </div>
                            <CButton color="secondary" @click="() =>handleCdkEditPagination('save')"> حفظ الصفحة</CButton>

                        </CPagination>
                       
                       <br><br>
                    </CForm>
                </CCardBody>
            </CModalBody>
            <CModalFooter>
                <!-- <CButton color="secondary" @click="() => { visibleEditModel = false }">
                    غلق
                </CButton> -->
                <CButton color="primary" @click="updateSummary">تعديل</CButton>
            </CModalFooter>
        </CModal>

        <CModal size="lg" :visible="visibleAddModel" @close="() => { visibleAddModel = false }">
            <CModalHeader>
               <CModalTitle> نسخ ملخص </CModalTitle>
            </CModalHeader>
            <CButton disabled v-show="isLoading">
                <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                Loading...
            </CButton>
            <CModalBody>
                <CCardBody>
                    <CForm class="row g-3">

                    <!-- <CCol :md="12">
                        <CFormLabel for="inputState">اختيار الملخص بأسم الكتاب</CFormLabel>
                        <CFormSelect v-model="currentSummaryId" id="inputState"  class="p-2">
                            <option v-for="summary in summaries" :value="summary.id" :key="summary">{{summary.book_name}}</option>
                        </CFormSelect>
                    </CCol> -->
                
                    <CCol :md="12" class="my-5">
                        <QuillEditor v-model:content="copiedTextManage" theme="snow" contentType="html" id="editor"
                            :toolbar="['bold', 'italic', 'underline',
                            { 'list': 'ordered'}, { 'list': 'bullet' }, { 'direction': 'rtl' }, { 'header': [1, 2, 3, 4, 5, 6, false] }, 
                            {'color': [] }, { 'background': [] }, { 'font': [] }, { 'align': [] },
                            ]"   
                        />
                        <CFormFeedback class="my-2" :class="{haveError: copiedTextManageError}" v-if="copiedTextManageError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback>  <br>                 
                    </CCol>  

                    <CPagination class="cdk-paginator">
                        <div class="d-flex  my-2" >  
                            <div v-if="cdkcurrentManagePage == 0" class=" mx-1">
                                <CPaginationItem disabled>
                                الصفحة السابقة</CPaginationItem>
                            </div>
                            <div v-else class=" mx-1">
                                <CPaginationItem class="paginated-style" @click="handleCdkAddPagination('sub')">
                                الصفحة السابقة</CPaginationItem>
                            </div>
                            <div v-if="cdkcurrentManagePage == cdklastManagePage" class=" mx-1">
                                <CPaginationItem disabled>
                                صفحة جديدة</CPaginationItem>
                            </div>
                            <div v-else class="  mx-1">   
                                <CPaginationItem class="paginated-style" @click="handleCdkAddPagination('add')">
                                صفحة جديدة </CPaginationItem>
                            </div>
                        </div>
                        <div class="my-2 pt-2"> رقم الصفحة {{cdkcurrentManagePage}}</div>
                        <CButton color="secondary" @click="() =>handleCdkAddPagination('save')"> حفظ الصفحة</CButton>

                     </CPagination>

                    </CForm>
                </CCardBody>
            </CModalBody>
            <CModalFooter>
                <div class="modal-footer">
                  <CButton @click="addFormattedSummary" class="px-5" color="primary">إضافة</CButton>
                </div>
            </CModalFooter>
        </CModal>
 
        <CPagination>
          
            <div class="mx-1 my-2" v-if="currentPage == 1">
                <CPaginationItem disabled>السابقة</CPaginationItem>
            </div>
            <div class="mx-1 my-2" v-else>
                <CPaginationItem class="paginated-style" @click="handleListPagePagination(currentPage--)">السابقة</CPaginationItem>
            </div>
             
            <div class="mx-1 my-2" v-if="currentPage == lastPage">
                <CPaginationItem disabled>التالية</CPaginationItem>
            </div>
            <div class="mx-1 my-2" v-else>
                <CPaginationItem class="paginated-style" @click="handleListPagePagination(currentPage++)">التالية</CPaginationItem>
            </div>
            
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
            visibleEditModel: false,
            visibleAddModel: false,
            summaries: [],
            bookName: "",
            bookId:"",
            author: "",
            fromPage: "",
            toPage: "",
            coverImage: "",

            userName: "",
            userEmail: "",
            userPhone: "",

            statusId: null,
   
            currentSummaryId: null,
            FromPageError :"",
            ToPageError :"",
            isLoading: false,
            currentPage: 1,
            lastPage: null,
   
            cdkcurrentPage:1 ,
            cdklastPage: 50,
            
            savedPages:[],
            savedPagesIds:[] ,
            cdkType:'edit' , 
            defaultImage: "https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png",
          
            /////add model/////
            currentAddSummaryId:0,
            copiedTextManage: "<p><bold>this is a book summary with bold text</bold></p>",
            copiedHTML: "",
            copiedTextManageError: "",
            
            cdkcurrentManagePage:1,
            cdklastManagePage:50, 

            pageNum:0,
            pagesContent:[]
        }
    },
    methods: {
        handleListPagePagination(currentPage){   //page pagination 
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

        invokeEditModal(id, bookId, author, fromPage, toPage, bookCoverPath, statusId, userName, userEmail, userPhone){
            
            this.currentSummaryId = id
            this.bookId = bookId
            this.author = author
            this.fromPage = fromPage
            this.toPage = toPage
            this.coverImage = bookCoverPath
            this.statusId = statusId

            this.userName = userName
            this.userEmail = userEmail
            this.userPhone = userPhone

            this.visibleEditModel = true
            
            // console.log("invokeEditModal currentSummaryId" ,this.currentSummaryId)
            axios.get(`${baseUrl}/admin/book-summary/page/show?book_summary_id=${this.currentSummaryId}&page=${this.cdkcurrentPage}`, config) //this.cdkcurrentPage
            .then((response) => {
            // console.log("response",response.data.data ) 
            if(response.data.data.data.length!=0) {
              this.cdkType='edit'
               document.getElementsByClassName('ql-editor')[0].innerHTML  =  response?.data?.data?.data[0]?.page_content || ''
               document.getElementsByClassName('ql-editor')[0].setAttribute('id',response?.data?.data?.data[0]?.id)
            //    console.log("summaries",this.summaries)
            }
            else {
                this.cdkType='add'
                document.getElementsByClassName('cdk-paginator')[0].style.display='none'
                document.getElementsByClassName('cdk-editor')[0].style.display='none'
                
            }
            //  console.log("cdkType",this.cdkType)
            }).catch(function (error) {
               console.log(error)
            }); 
 
        },

        updateSummary(){
            // console.log("update whole summary"  , this.savedPages)
            // console.log("update whole summary"  , this.savedPagesIds)

            this.isLoading = true
            let requestBody = new FormData();
            requestBody.append('book_summary_id', this.currentSummaryId)
            requestBody.append('status_id', this.statusId)
            requestBody.append('book_id', this.bookId)
            requestBody.append('from_page', this.fromPage)
            requestBody.append('to_page',  this.toPage )
            if(this.savedPages.length!=0) {
                for (let i = 0; i < this.savedPages.length; i++) {
                    requestBody.append('formatted_pages['+i+']',this.savedPages[i])
                }
            }

            if(this.savedPagesIds.length!=0) {
                for (let i = 0; i < this.savedPagesIds.length; i++) {
                    requestBody.append('pages_ids['+i+']',this.savedPagesIds[i])
                }
            }
           
            axios.post(`${baseUrl}/admin/book-summary/update`, requestBody, config).then((response) => {
                if(response.data.status == false){                         
                    this.isLoading = false
                    // console.log('error')
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

                    this.savedPages = []
                    this.savedPagesIds = []
                }
                }).then( () => {
                axios.get(`${baseUrl}/admin/book-summaries/all?page=`+sessionStorage.getItem("summaryCurrentPage"), config)
                    .then((response) => {
                        this.summaries = response.data.data.data                       
                    }).catch(function (error) {                                                        
                        // console.log(error)
                    });
                }).catch(function (error) {                                                
                // console.log(error);
            }).catch(function (error) {                                                
                // console.log(error);
            })
        },

        downloadSummaries(files){
            if(files.length > 0){
                for(let i=0;i<files.length;i++){
                    window.open(files[i], "w"+i)
                }
            }
        },

        handleCdkEditPagination(Editpage){ //cdk editor pagination 
          axios.get(`${baseUrl}/admin/book-summary/page/show?book_summary_id=${this.currentSummaryId}&page=${this.cdkcurrentPage}`, config)
            .then((response) => {
            //    console.log("CDK Edit Pagination",response?.data?.data)
               this.cdklastPage=response?.data?.data.last_page
            //    console.log("last cdk page",this.cdklastPage)
               if(Editpage=='save') {  // do changes
                    this.savedPages.push(document.getElementsByClassName('ql-editor')[0].innerHTML)
                    this.savedPagesIds.push(document.getElementsByClassName('ql-editor')[0].id)
                    // console.log("cdk upload only pages"  , this.savedPages)
                    // console.log("cdk upload only pages id"  , this.savedPagesIds)

                    let requestBody = new FormData();
                    requestBody.append('book_summary_id', this.currentSummaryId)
                    for (let i = 0; i < this.savedPages.length; i++) {
                        requestBody.append('formatted_pages['+i+']',this.savedPages[i])
                    }
                    for (let i = 0; i < this.savedPagesIds.length; i++) {
                        requestBody.append('pages_ids['+i+']',this.savedPagesIds[i])
                    }
                    axios.post(`${baseUrl}/admin/book-summary/update`, requestBody, config).then((response) => {
                        if(response.data.status == false){                         
                            // this.$swal({
                            //     title: 'عذرا, هناك خطأ',
                            //     text: response.data.errors[0],
                            //     icon: 'error'
                            // })
                        }else{
                            // this.$swal({
                            //     title: 'تم حفظ الصفحة بنجاح',
                            //     icon: 'success',
                            // })
                        }
                    })
                    
                } 
                else {  
                 document.getElementsByClassName('ql-editor')[0].innerHTML =  response?.data?.data?.data[0]?.page_content
                 document.getElementsByClassName('ql-editor')[0].id=  response?.data?.data?.data[0]?.id
                }
            }).catch(function (error) {
                // console.log(error)
            });
        },

        invokeAddModal(id){
           this.currentAddSummaryId = id
           this.cdkcurrentManagePage =1 ;
           this.visibleAddModel = true
         //get book summaries by id 
        },

        handleCdkAddPagination(page){ 
        if(page=='save') {
            if((this.copiedTextManage != '<p><br></p>')){
            if((this.pagesContent.length!=0) && ((this.pagesContent.length-1) == (this.cdkcurrentManagePage-1)))
            console.log("handleCdkAddPagination",this.pagesContent[this.cdkcurrentManagePage-1])
            this.pagesContent[this.cdkcurrentManagePage-1]=this.copiedTextManage
            } 
        //   document.getElementsByClassName('ql-editor')[0].innerHTML  = ""
        }
        else if(page=='sub') {  
            if(this.cdkcurrentManagePage-1>0) {  
            this.cdkcurrentManagePage-=1 ;
             console.log("prev",this.cdkcurrentManagePage)
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
                console.log("next",this.cdkcurrentManagePage.length)
            }
        } 

        console.log("this.pagesContent",this.pagesContent)
       
        var filteredPages = this.pagesContent.filter(function (el) {
            if(el) {
            return el != null;
            }
        });
        console.log("filteredPages",filteredPages)
        },

        addFormattedSummary(){      
           let requestBody = new FormData();
           requestBody.append('book_summary_id', this.currentAddSummaryId)
           if(this.pagesContent.length!=0) {
                for (let i = 0; i < this.pagesContent.length; i++) {
                    requestBody.append('formatted_pages['+i+']',this.pagesContent[i])
                }
            }
           
            axios.post(`${baseUrl}/admin/book-summary/page/add`, requestBody, config).then((response) => {
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
                        title: 'تم إضافة التنسيق بنجاح',
                        // text: 'Welcome Back, Admin',
                        icon: 'success'
                    })

                   this.pagesContent = []
                   document.getElementsByClassName('ql-editor')[0].innerHTML = " "
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

    },
    mounted(){
         sessionStorage.setItem("summaryCurrentPage", this.currentPage);
        axios.get(`${baseUrl}/admin/book-summaries/all?page=`+sessionStorage.getItem("summaryCurrentPage"), config)
        .then((response) => {
            this.summaries = response.data.data.data
            this.currentPage = response.data.data.current_page
            this.lastPage = response.data.data.last_page
        //    console.log("summaries",this.summaries)
        }).catch(function (error) {
            // console.log(error)
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
    
    td:nth-of-type(1) {
      min-width:170px !important; 
    }

    th:nth-of-type(8) , th:nth-of-type(10) {
      min-width:150px !important;
    }
 
 
</style> 