<template>

  <CRow>

    <CCol :xs="12">

      <CCard class="mb-4">
        
       <CCardHeader>
            <strong>جدول الملخصات</strong>

            <CButton disabled v-show="isLoading">
                <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                جاري التحميل ... 
          </CButton>
          
        </CCardHeader>
        
         <CTable hover small responsive="sm" striped v-if="!isLoading">
           
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
                        <CImage rounded thumbnail :src='summary?.book?.book_cover_path' onerror=" this.src=defaultImage" width="50" height="50"/>  
                    </CTableDataCell>

                    <CTableDataCell v-else> <CImage rounded thumbnail :src="defaultImage" width="50" height="50"/> </CTableDataCell>
                     
                    <CTableDataCell v-if="summary.status_id == 0">  معلق </CTableDataCell>
                    
                    <CTableDataCell v-if="summary.status_id == 1">  مقبول </CTableDataCell>
                    
                    <CTableDataCell v-if="summary.status_id == 2"> مرفوض </CTableDataCell>
                    
                    <CTableDataCell>
                        <CButton
                            color="primary"
                            variant="outline"
                            @click="() => downloadSummaries(summary.summary_files_list)">  
                           <CIcon icon="cil-cloud-download" size="lg" />
                        </CButton>      
                    </CTableDataCell>
                    
                    <CTableDataCell>
                        <CButton
                            color="warning"
                            variant="outline"
                            @click="() => invokeEditModal(summary.id, summary?.book?.id, summary?.book?.author, summary?.from_page, summary?.to_page, summary?.book?.book_cover_path, summary?.status_id,  summary?.user_data.name  , summary?.user_data.email  , summary?.user_data.phone , summary?.summary_files_list)"> 
                            <CIcon icon="cil-pencil" size="lg" />
                        </CButton>      
                    </CTableDataCell>

                    <CTableDataCell>
                        <CButton
                            color="success"
                            variant="outline"
                            @click="() => invokeAddModal(summary.id , summary?.book?.book_name , summary?.book?.author ,summary?.from_page ,summary?.to_page , summary?.book?.book_cover_path)"> 
                            <CIcon icon="cil-book" size="lg" />
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
                <CTableHeaderCell scope="col" v-for="  column in [].constructor(9)"> 
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

        <CModal size="lg" :visible="visibleEditModel" @close="() => { visibleEditModel = false }">
           
            <CModalHeader>
               <CModalTitle>تعديل بيانات الملخص</CModalTitle>
            </CModalHeader>

            <CButton disabled v-show="isLoading">
                <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                جاري التحميل ... 
            </CButton>

            <CModalBody>
                <CCardBody>
                    <CForm class="row g-3">
                        <h5 class="fw-bold"> عرض بيانات الكتاب</h5>

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
                                  
                        <h5 class="fw-bold"> عرض بيانات من قام بالتلخيص</h5>

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
                            <CFormLabel for="from_page">من الصفحة</CFormLabel>
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
                            <CFormLabel for="to_page">إلي الصفحة</CFormLabel>
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
                            <CFormLabel for="state">اختيار الحالة</CFormLabel>
                            <CFormSelect v-model="statusId" id="state">
                                <option value="1">قبول</option>
                                <option value="2">رفض</option>
                            </CFormSelect>
                        </CCol>

                       <CCol class="mt-4" :md="12">
                            <CFormLabel for="from_page">  ملفات الملخصات   </CFormLabel>
                            <a role="button" class="btn btn-outline-primary m-2"  v-for="(item, index) in summaryFileList" :key="item" :href="item" target="_blank"> # الملف {{ index }}</a>
                            <CFormLabel  for="summaryFiles" style="border: 1px solid #3c6264;background: #3c6264; margin: auto;border-radius: 5px; width: 100%;height: 40px; color :#ececec">
                            <span class=" " style="position: relative; top:5px; right:32%;"> {{ 'انقر هنا لتحميل ملفات الملخصات' }} <CIcon size="lg" icon="cil-cloud-upload" class="mx-2" style="vertical-align: middle;"/> </span> 
                            <CFormInput type="file" size="lg" id="summaryFiles" @change="onMainImageUpload" style="visibility: hidden; "/> 
                            <p class="uploaded-files text-primary">
                                <span  v-for="file in summaryFilesName" :key="file"> 
                                    {{ file }} 
                                </span>
                           </p>
                        </CFormLabel>
                        
                            <CFormFeedback :class="{haveError:summaryFilesError}" v-if="summaryFilesError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>  
                        </CCol>
 
                        <CCol :md="12" class="cdk-editor mb-5">
                            <CFormLabel for="from_page">  تنسيق الملخصات   </CFormLabel>
                            <QuillEditor class="mb-5" v-model:content="copiedText" theme="snow" contentType="html" id="editor"  
                                :toolbar="['bold', 'italic', 'underline',
                                { 'list': 'ordered'}, { 'list': 'bullet' }, { 'direction': 'rtl' }, { 'header': [1, 2, 3, 4, 5, 6, false] }, 
                                {'color': [] }, { 'background': [] }, { 'font': [] }, { 'align': [] },
                                ]"   
                            />
                            <CFormFeedback :class="{haveError: copiedTextError}" v-if="copiedTextError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                        </CCol>

                        <CPagination class="cdk-paginator mt-5">
                            <div class="d-flex">  
                       
                                <div  class="mx-1 my-2" v-if="cdkcurrentPage == 1">
                                    <CPaginationItem disabled>السابقة</CPaginationItem>
                                </div>
                                <div class="mx-1 my-2" v-else>
                                    <CPaginationItem class="paginated-style" @click="handleCdkEditPagination(cdkcurrentPage--)">السابقة   </CPaginationItem>
                               </div>
   
                                <div class="mx-1 my-2" v-if="cdkcurrentPage == cdklastPage">
                                    <CPaginationItem disabled>التالية </CPaginationItem>
                                </div>
                                <div class="mx-1 my-2" v-else>
                                    <CPaginationItem class="paginated-style" @click="handleCdkEditPagination(cdkcurrentPage++)">التالية</CPaginationItem>
                                </div>
                               
                            </div>
                            <div class="my-2 mx-4 pt-2"> 
                                <span v-if="editSpinner"> 
                                    جاري التحميل  
                                    <CSpinner  class="spinner" />   
                                </span>

                                <span v-else="!editSpinner"> 
                                    رقم الصفحة {{cdkcurrentPage}}
                                </span>
                               
                            </div>
                            <CButton class="btn btn-outline-primary py-2 px-3" @click="() =>handleCdkEditPagination('save')"> حفظ الصفحة</CButton>

                        </CPagination>
                       
                       <br><br>
                    </CForm>
                </CCardBody>
            </CModalBody>

            <CModalFooter>
               <CButton color="primary" @click="updateSummary">تعديل</CButton>
            </CModalFooter>

        </CModal>
 
        <CModal size="lg" :visible="visibleAddModel" @close="() => { visibleAddModel = false }">

            <CModalHeader>
               <CModalTitle> تنسيق الملخص </CModalTitle>
            </CModalHeader>

            <CButton disabled v-show="isLoading">
                <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                جاري التحميل ... 
            </CButton>

            <CModalBody>
                <CCardBody>
                    <CForm class="row g-3">

                        <h5 class="fw-bold" > عرض بيانات الكتاب  </h5>

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
                            <strong><span>اسم المؤلف  </span></strong> : 
                            <span>{{this.author}}</span>
                        </CCol>

                        <CCol :md="12">                         
                            <strong><span>من الصفحة</span></strong> : 
                            <span>{{this.fromPage}}</span>
                        </CCol>

                        <CCol :md="12">                         
                            <strong><span>إلي الصفحة </span></strong> : 
                            <span>{{this.toPage}}</span>
                        </CCol>

                        <CCol :md="12" class="my-5">

                            <h5 class="fw-bold mb-4" > تنسيق ملخص الكتاب </h5>

                            <QuillEditor v-model:content="copiedTextManage" theme="snow" contentType="html" id="editor"
                                :toolbar="['bold', 'italic', 'underline',
                                { 'list': 'ordered'}, { 'list': 'bullet' }, { 'direction': 'rtl' }, { 'header': [1, 2, 3, 4, 5, 6, false] }, 
                                {'color': [] }, { 'background': [] }, { 'font': [] }, { 'align': [] },
                                ]"   
                            />
                            <CFormFeedback class="my-2" :class="{haveError: copiedTextManageError}" v-if="copiedTextManageError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback>  <br>                 
                        </CCol>  

                        <CPagination class="pt-5 cdk-paginator">
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
                                <div v-else class="mx-1">   
                                    <CPaginationItem class="paginated-style" @click="handleCdkAddPagination('add')">
                                    صفحة جديدة </CPaginationItem>
                                </div>
                            </div>
                            <!-- <div class="my-2 py-2"> رقم الصفحة {{cdkcurrentManagePage}}</div> -->
                            <div class="my-2 mx-4 pt-2"> 
                                <span v-if="addSpinner"> 
                                    جاري التحميل  
                                    <CSpinner  class="spinner" />   
                                </span>

                                <span v-else="!addSpinner"> 
                                    رقم الصفحة {{cdkcurrentManagePage}}
                                </span>
                               
                            </div>

                            <CButton color="primary" variant="outline" class=" py-2 px-3" @click="() =>handleCdkAddPagination('save')"> حفظ الصفحة</CButton>
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

        <CPagination  class="cdk-paginator">
            <div class="d-flex  my-2" >  
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
            </div>
            <div class="my-2 mx-4 pt-2"> 
                <span  v-if="listSpinner"> 
                    جاري التحميل  
                     <CSpinner class="spinner"/> 
                </span>
                <span  v-else="!listSpinner"> 
                 رقم الصفحة {{currentPage}} 
                </span>
            </div>
      
        </CPagination>

      </CCard>

    </CCol>

  </CRow>

</template>

<script>

import { CButton } from "@coreui/vue"
import axios from "axios"
import env from '../../env'

const baseUrl = env.baseUrl

const token = localStorage.token
const config = {
    headers: { Authorization: `Bearer ${token}` }
}

sessionStorage.setItem("currentSummaryId", 1);

export default {
    name: 'Summaries',
    data() {
        return {
            summaryFiles: [],
            summaryFileList: [],
            summaryFilesName: [],
            summaryFilesError: false,
            header: ['الرقم التعريفي', ' اسم الكتاب', 'المؤلف ', 'من الصفحة ', ' إلي الصفحة', 'صورة الغلاف', 'الحالة', 'تحميل الملفات', 'إدارة الملخص'],
            editSpinner: false,
            addSpinner: false,
            listSpinner: false,
            visibleEditModel: false,
            visibleAddModel: false,
            summaries: [],
            bookName: "",
            bookId: "",
            author: "",
            fromPage: "",
            toPage: "",
            coverImage: "",
            userName: "",
            userEmail: "",
            userPhone: "",
            statusId: null,
            currentSummaryId: null,
            FromPageError: "",
            ToPageError: "",
            isLoading: false,
            currentPage: 1,
            lastPage: null,
            cdkcurrentPage: 1,
            cdklastPage: 50,
            savedPages: [],
            savedPagesIds: [],
            cdkType: 'edit',
            defaultImage: "https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png",
            /////add model/////
            currentAddSummaryId: 0,
            copiedTextManage: "",
            copiedHTML: "",
            copiedTextManageError: "",
            cdkcurrentManagePage: 1,
            cdklastManagePage: 50,
            pageNum: 0,
            pagesContent: []
        };
    },
    methods: {
        allBookSummaries(page) {
            this.isLoading = true;
            this.listSpinner = true;
            axios.get(`${baseUrl}/admin/book-summaries/all?page=` + page, config).then((response) => {
                this.listSpinner = false;
                this.isLoading = false;
                this.summaries = response.data.data.data;
                this.currentPage = response.data.data.current_page;
                this.lastPage = response.data.data.last_page;
            }).catch((error) => {
                this.isLoading = false;
            });
        },

        handleListPagePagination(currentPage) {
            sessionStorage.setItem("summaryCurrentPage", this.currentPage);
            this.allBookSummaries(this.currentPage);
        },

        invokeEditModal(id, bookId, author, fromPage, toPage, bookCoverPath, statusId, userName, userEmail, userPhone, summaryFileList) {
            this.summaryFiles = [],
            this.summaryFileList = summaryFileList,
            this.summaryFilesName = [],
            this.currentSummaryId = id;
            this.bookId = bookId;
            this.author = author;
            this.fromPage = fromPage;
            this.toPage = toPage;
            this.coverImage = bookCoverPath;
            this.statusId = statusId;
            this.userName = userName;
            this.userEmail = userEmail;
            this.userPhone = userPhone;
            this.visibleEditModel = true;
            axios.get(`${baseUrl}/admin/book-summary/page/show?book_summary_id=${this.currentSummaryId}&page=${this.cdkcurrentPage}`, config).then((response) => {
                if (response.data.data.data.length != 0) {
                    this.cdkType = 'edit';
                    document.getElementsByClassName('ql-editor')[0].innerHTML = response?.data?.data?.data[0]?.page_content || '';
                    document.getElementsByClassName('ql-editor')[0].setAttribute('id', response?.data?.data?.data[0]?.id);
                }
                else {
                    this.cdkType = 'add';
                    document.getElementsByClassName('cdk-paginator')[0].style.display = 'none';
                    document.getElementsByClassName('cdk-editor')[0].style.display = 'none';
                }
            }).catch((error) => {
                // console.log(error)
            });
        },

        handleCdkEditPagination(Editpage) {
            this.editSpinner = true;
            axios.get(`${baseUrl}/admin/book-summary/page/show?book_summary_id=${this.currentSummaryId}&page=${this.cdkcurrentPage}`, config).then((response) => {
                this.editSpinner = false;
                this.cdklastPage = response?.data?.data.last_page;
                if (Editpage == 'save') {
                    this.savedPages.push(document.getElementsByClassName('ql-editor')[0].innerHTML);
                    this.savedPagesIds.push(document.getElementsByClassName('ql-editor')[0].id);
                    let requestBody = new FormData();
                    requestBody.append('book_summary_id', this.currentSummaryId);
                    for (let i = 0; i < this.savedPages.length; i++) {
                        requestBody.append('formatted_pages[' + i + ']', this.savedPages[i]);
                    }
                    for (let i = 0; i < this.savedPagesIds.length; i++) {
                        requestBody.append('pages_ids[' + i + ']', this.savedPagesIds[i]);
                    }
                    axios.post(`${baseUrl}/admin/book-summary/update`, requestBody, config).then((response) => {
                        if (response.data.status == false) {
                            // this.$swal({
                            //     title: 'عذرا, هناك خطأ',
                            //     text: response.data.errors[0],
                            //     icon: 'error'
                            // })
                        }
                        else {
                            // this.$swal({
                            //     title: 'تم حفظ الصفحة بنجاح',
                            //     icon: 'success',
                            // })
                        }
                    }).catch((error) => {
                        // this.$swal({
                        //     title: 'عذرا, هناك خطأ',
                        //     text: response.data.errors[0],
                        //     icon: 'error'
                        // })
                    });
                }
                else {
                    document.getElementsByClassName('ql-editor')[0].innerHTML = response?.data?.data?.data[0]?.page_content;
                    document.getElementsByClassName('ql-editor')[0].id = response?.data?.data?.data[0]?.id;
                }
            }).catch((error) => {
                this.$swal({
                    title: 'عذرا, هناك خطأ',
                    text: error.errors[0],
                    icon: 'error'
                });
            });
        },

        updateSummary() {
            let requestBody = new FormData();
            requestBody.append('book_summary_id', this.currentSummaryId);
            requestBody.append('book_id', this.bookId);
            requestBody.append('from_page', this.fromPage);
            requestBody.append('to_page', this.toPage);
            requestBody.append('status_id', this.statusId);
            if (this.summaryFiles.length != 0) {
                for (let i = 0; i < this.summaryFiles.length; i++) {
                    requestBody.append('summary_files[' + i + ']', this.summaryFiles[i]);
                }
            }
            if (this.savedPages.length != 0) {
                for (let i = 0; i < this.savedPages.length; i++) {
                    requestBody.append('formatted_pages[' + i + ']', this.savedPages[i]);
                }
            }
            if (this.savedPagesIds.length != 0) {
                for (let i = 0; i < this.savedPagesIds.length; i++) {
                    requestBody.append('pages_ids[' + i + ']', this.savedPagesIds[i]);
                }
            }
            this.isLoading = true;
            axios.post(`${baseUrl}/admin/book-summary/update`, requestBody, config).then((response) => {
                this.isLoading = false;
                if (response.data.status == false) {
                    this.$swal({
                        title: 'عذرا, هناك خطأ',
                        text: response.data.errors[0],
                        icon: 'error'
                    });
                }
                else {
                    this.$swal({
                        title: 'تم التعديل بنجاح',
                        icon: 'success'
                    });
                    this.savedPages = [];
                    this.savedPagesIds = [];
                    this.allBookSummaries(sessionStorage.getItem("summaryCurrentPage"));
                }
            }).catch((error) => {
                this.isLoading = false;
                this.$swal({
                    title: 'عذرا, هناك خطأ',
                    text: error.errors[0],
                    icon: 'error'
                });
            });
        },

        invokeAddModal(id, book_name, author, fromPage, toPage, coverImage) {
            this.bookName = book_name;
            this.author = author;
            this.fromPage = fromPage;
            this.toPage = toPage;
            this.coverImage = coverImage;
            this.currentAddSummaryId = id;
            this.cdkcurrentManagePage = 1;
            this.visibleAddModel = true;
        },

        handleCdkAddPagination(page) {
            if (page == 'save') {
                if ((this.copiedTextManage != '<p><br></p>')) {
                    if ((this.pagesContent.length != 0) && ((this.pagesContent.length - 1) == (this.cdkcurrentManagePage - 1)))
                        console.log("handleCdkAddPagination", this.pagesContent[this.cdkcurrentManagePage - 1]);
                    this.pagesContent[this.cdkcurrentManagePage - 1] = this.copiedTextManage;
                }
                //   document.getElementsByClassName('ql-editor')[0].innerHTML  = ""
            }
            else if (page == 'sub') {
                if (this.cdkcurrentManagePage - 1 > 0) {
                    this.cdkcurrentManagePage -= 1;
                    console.log("prev", this.cdkcurrentManagePage);
                    if (this.pagesContent[this.cdkcurrentManagePage - 1]) {
                        document.getElementsByClassName('ql-editor')[0].innerHTML = this.pagesContent[this.cdkcurrentManagePage - 1];
                    }
                    else {
                        document.getElementsByClassName('ql-editor')[0].innerHTML = '';
                    }
                }
            }
            else if (page == 'add') {
                if (this.cdkcurrentManagePage != this.cdklastManagePage) {
                    this.cdkcurrentManagePage += 1;
                    if (this.pagesContent[this.cdkcurrentManagePage - 1]) {
                        document.getElementsByClassName('ql-editor')[0].innerHTML = this.pagesContent[this.cdkcurrentManagePage - 1];
                    }
                    else {
                        document.getElementsByClassName('ql-editor')[0].innerHTML = '';
                    }
                    console.log("next", this.cdkcurrentManagePage.length);
                }
            }
            console.log("this.pagesContent", this.pagesContent);
            var filteredPages = this.pagesContent.filter(function (el) {
                if (el) {
                    return el != null;
                }
            });
            console.log("filteredPages", filteredPages);
        },

        addFormattedSummary() {
            let requestBody = new FormData();
            requestBody.append('book_summary_id', this.currentAddSummaryId);
            if (this.pagesContent.length != 0) {
                for (let i = 0; i < this.pagesContent.length; i++) {
                    requestBody.append('formatted_pages[' + i + ']', this.pagesContent[i]);
                }
            }
            axios.post(`${baseUrl}/admin/book-summary/page/add`, requestBody, config).then((response) => {
                if (response.data.status == false) {
                    this.isLoading = false;
                    console.log('error');
                    this.$swal({
                        title: 'عذرا, هناك خطأ',
                        text: response.data.errors[0],
                        icon: 'error'
                    });
                }
                else {
                    this.isLoading = false;
                    this.$swal({
                        title: 'تم إضافة التنسيق بنجاح',
                        icon: 'success'
                    });
                    this.pagesContent = [];
                    document.getElementsByClassName('ql-editor')[0].innerHTML = " ";
                    this.allBookSummaries(this.currentPage);
                }
            }).catch(function (error) {
                console.log(error);
            });
        },

        downloadSummaries(files) {
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    window.open(files[i], "w" + i);
                }
            }
        },

        onMainImageUpload(event) {
            if (this.summaryFiles.length == 0) {
                this.summaryFilesError == true;
            }
            else {
                this.summaryFilesError == false;
            }
            console.log("files", event.target.files[0]);
            this.summaryFiles.push(event.target.files[0]);
            this.summaryFilesName.push(event.target.files[0]?.name);
        },
    },
    
    mounted() {
        this.isLoading = true;
        sessionStorage.setItem("summaryCurrentPage", this.currentPage);
        axios.get(`${baseUrl}/admin/book-summaries/all?page=` + sessionStorage.getItem("summaryCurrentPage"), config).then((response) => {
            this.isLoading = false;
            this.summaries = response.data.data.data;
            this.currentPage = response.data.data.current_page;
            this.lastPage = response.data.data.last_page;
            console.log("summaries", this.summaries);
        }).catch((error) => {
            this.isLoading = false;
        });
    },
    components: { CButton }
}
</script>

<style lang="scss" scoped>
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
  
    th:nth-of-type(2) {
     min-width:260px !important; 
    }
 
    th:nth-of-type(8) , th:nth-of-type(10) {
      min-width:150px !important;
    }

    .cdk-paginator ul.pagination button { 
        height: 45px !important;
        margin-top: 8px;
    }

    .uploaded-files { 
        span:not(:last-child) {
            &::after  {
              content:'/';
            }
        }
    }

</style> 