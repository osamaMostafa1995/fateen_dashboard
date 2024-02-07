<template>
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
          <div class="icard-header"><strong>جدول الملخصات</strong></div>
           <CTable hover small responsive="sm">
              <CTableHead>
                <CTableRow color="dark">
                    <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell>
                    <CTableHeaderCell scope="col">صورة الغلاف</CTableHeaderCell>                
                    <CTableHeaderCell scope="col">العنوان</CTableHeaderCell>
                    <CTableHeaderCell scope="col">اسم القسم</CTableHeaderCell>
                    <!-- <CTableHeaderCell scope="col">المحتوي</CTableHeaderCell> -->
                    <CTableHeaderCell scope="col">صورة الكاتب</CTableHeaderCell>      
                    <CTableHeaderCell scope="col">اسم الكاتب</CTableHeaderCell>       
                    <CTableHeaderCell scope="col">الحالة</CTableHeaderCell>              
                    <CTableHeaderCell scope="col">عدد الإعجابات</CTableHeaderCell>                
                    <CTableHeaderCell scope="col">إخفاء عدد الإعجابات</CTableHeaderCell>                
                    <CTableHeaderCell scope="col">إدارة الملخص</CTableHeaderCell>
                    <!-- <CTableHeaderCell scope="col">تنسيق الملخص</CTableHeaderCell> -->
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="blog in blogs" :key="blog">
                    <CTableHeaderCell scope="row">{{blog.id}} </CTableHeaderCell>
                    <CTableDataCell v-if="blog?.cover_image_path"> <!--v-if="!blog?.cover_image_path.includes('null')"-->
                        <CImage rounded thumbnail :src='blog?.cover_image_path' width="50" height="50"/>  <!--blog?.cover_image_path.replace(`"`, ``)-->
                    </CTableDataCell>
                    <CTableDataCell v-else>
                        <CImage rounded thumbnail :src="defaultImage" width="50" height="50"/>
                    </CTableDataCell>
                    
                    <CTableDataCell>{{blog?.title || '-'}}</CTableDataCell>
                    <CTableDataCell>{{blog?.category?.name|| '-'}}</CTableDataCell>
                    <!-- <CTableDataCell>{{blog?.content || '-' }}</CTableDataCell> -->

                    <CTableDataCell v-if="blog?.writter_image_path"> <!--v-if="!blog?.writter_image_path.includes('null')"-->
                        <CImage rounded thumbnail :src='blog?.writter_image_path' width="50" height="50"/>  <!--blog?.writter_image_path.replace(`"`, ``)-->
                    </CTableDataCell>
                    <CTableDataCell v-else>
                        <CImage rounded thumbnail :src="defaultImage" width="50" height="50"/>
                    </CTableDataCell>
                    <CTableDataCell>{{blog?.written_by || '-'}}</CTableDataCell>
                    

                    <CTableDataCell v-if="blog.status_id == 0">
                        معلق
                    </CTableDataCell>
                    <CTableDataCell v-if="blog.status_id == 1">
                        مقبول
                    </CTableDataCell>
                    <CTableDataCell v-if="blog.status_id == 2">
                        مرفوض
                    </CTableDataCell>
    
                    <CTableDataCell>{{blog?.likes_count }}</CTableDataCell>

                    <CTableDataCell v-if="blog.hide_likes_count == 0">
                        إظهار
                    </CTableDataCell>
                    <CTableDataCell v-else="blog.hide_likes_count == 1">
                        إخفاء 
                    </CTableDataCell>
    
                    <CTableDataCell>
                    <CButton
                        color="warning"
                        variant="outline"
                        @click="() => invokeEditModal(blog.id, blog?.category_id, blog?.type, blog?.title, blog?.content , blog?.original_content, blog?.references , blog?.cover_image_path, blog?.hide_likes_count, blog?.status_id)"> 
                    <CIcon icon="cil-pencil" size="lg" />
                    </CButton>      
                    </CTableDataCell>
    
                    <!-- <CTableDataCell>
                    <CButton
                        color="success"
                        variant="outline"
                        @click="() => invokeAddModal(blog.id )"> 
                    <CIcon icon="cil-book" size="lg" />
                    </CButton>      
                    </CTableDataCell> -->
    
                </CTableRow>
              </CTableBody>
          </CTable>
         
          <!-- Edit Modal -->

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
                          <h5 class="fw-bold">بيانات قسم الوعي</h5>
                          
                          <CCol :md="12">                
                              <CTableDataCell>
                                  <CImage rounded thumbnail :src="this.blogCoverImagePath" width="100" height="100"/>
                              </CTableDataCell>
                          </CCol>

                          <CCol :md="12">                
                            <strong><label class="mb-1">العنوان </label></strong> : 
                            <input 
                            id="blogTitle" 
                            type="text"
                            class="p-2" 
                            :class="{onError: titleError, 'form-control' : !titleError}"
                            v-model="blogTitle"
                            />
                            <CFormFeedback :class="{haveError: titleError}" v-if="titleError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>           
                         </CCol>

                         <CCol :md="12">                
                            <strong><label class="mb-1">المرجع </label></strong> : 
                            <input 
                            id="blogReferences" 
                            type="text"
                            class="p-2" 
                            :class="{onError: referenceError, 'form-control' : !referenceError}"
                            v-model="blogReferences"
                            />
                            <CFormFeedback :class="{haveError: referenceError}" v-if="referenceError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>           
                         </CCol>
  
                          <CCol :md="12">                
                                <strong><span> اسم القسم</span></strong> : 
                                <br> 
                                <CFormLabel for="categoryId">اختيار اسم القسم</CFormLabel>
                                <CFormSelect v-model="categoryId" id="categoryId"  class="p-2"  :class="{onError: categoryError, 'form-control' : !categoryError}">
                                    <option v-for="category in categories" :value="category.id" :key="category">{{category.name_ar}}</option>
                                </CFormSelect>
                                <CFormFeedback :class="{haveError: categoryError}" v-if="categoryError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>           
                          </CCol>

                          <CCol :md="12">                
                                <strong><span>نوع المقال</span></strong> : 
                                <br> 
                                <CFormLabel for="btype">اختيار نوع المقال</CFormLabel>
                                <CFormSelect v-model="bolgType" id="btype"  class="p-2"  :class="{onError: typeError, 'form-control' : !typeError}">
                                    <option v-for="btype in types" :value="btype.id" :key="btype">{{btype.name_ar}}</option>
                                </CFormSelect>
                                <CFormFeedback :class="{haveError: typeError}" v-if="typeError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>           
                          </CCol>

                         <CCol :md="12">
                             <strong><span> الحالة</span></strong> : 
                             <br>
                              <CFormLabel for="inputState">اختيار الحالة</CFormLabel>
                              <CFormSelect v-model="statusId" id="inputState"  :class="{onError: statusError, 'form-control' : !statusError}">
                                  <option value="1">قبول</option>
                                  <option value="2">رفض</option>
                              </CFormSelect>
                              <CFormFeedback :class="{haveError: statusError}" v-if="statusError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br> 
                          </CCol>

                          <CCol :md="12">
                             <strong><span> إخفاء عدد الإعجابات</span></strong> : 
                             <br>
                              <CFormLabel for="blogHideLikesCount">اختيار حالة إخفاء عدد الإعجابات</CFormLabel>
                              <CFormSelect v-model="blogHideLikesCount" id="blogHideLikesCount"  :class="{onError: likesCountError, 'form-control' : !likesCountError}">
                                  <option value="0">إخفاء</option>
                                  <option value="1">إظهار</option>
                              </CFormSelect>
                              <CFormFeedback :class="{haveError: likesCountError}" v-if="likesCountError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br> 
                          </CCol>
                   
                          <CCol :md="12">                
                                <strong><span> نوع المحتوي  </span></strong> : 
                                <br> 
                                <CFormLabel for="original">اختيار نوع المحتوي </CFormLabel>
                                <CFormSelect v-model="blogOriginalContent" id="original"  class="p-2"  :class="{onError: originalContentError, 'form-control' : !originalContentError}">
                                    <option v-for="original in originals" :value="original.id" :key="original">{{original.name_ar}}</option>
                                </CFormSelect>
                                <CFormFeedback :class="{haveError: originalContentError}" v-if="originalContentError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>           
                          </CCol>

                         <CCol :md="12">                
                            <strong><label class="mb-1">المحتوي </label></strong> : 
                            <textarea 
                            id="blogContent" 
                            type="text"
                            class="p-2" 
                            :class="{onError: contentError, 'form-control' : !contentError}"
                            v-model="blogContent"
                            ></textarea>
                            <CFormFeedback :class="{haveError: contentError}" v-if="contentError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>           
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
                          <br><br>
                      </CForm>
                  </CCardBody>
              </CModalBody>
              <CModalFooter>
                 <CButton color="primary" @click="updateSummary">تعديل</CButton>
              </CModalFooter>
          </CModal>
     
          <!-- Add Modal -->
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
                        <CCol :md="12" class="my-5">
                          <QuillEditor v-model:content="copiedTextManage" theme="snow" contentType="html" id="editor"
                              :toolbar="['bold', 'italic', 'underline',
                              { 'list': 'ordered'}, { 'list': 'bullet' }, { 'direction': 'rtl' }, { 'header': [1, 2, 3, 4, 5, 6, false] }, 
                              {'color': [] }, { 'background': [] }, { 'font': [] }, { 'align': [] },
                              ]"   
                          />
                          <CFormFeedback class="my-2" :class="{haveError: copiedTextManageError}" v-if="copiedTextManageError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback>  <br>                 
                      </CCol>  
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
  
  sessionStorage.setItem("currentBolgId", 1);
  
  export default {
      name: 'Tables',
      data(){
          return {
              currentBolgId: null,  
              visibleEditModel: false,
              visibleAddModel: false,
              blogs: [],
              types: [],
              categories:[],
              originals:[],
              
              categoryId: "",
              bolgType:"",
              blogTitle: "",
              blogContent: "",
              blogOriginalContent: "",
              blogReferences: "",
              blogCoverImagePath: " " , 
              blogHideLikesCount :"",
              blogStatusId: null,
              copiedText :"",

              typeError:"",
              categoryError:"",
              titleError:"",
              contentError:"",
              originalContentError:"",
              referenceError:"",
              statusError:"", 
              likesCountError:"" ,
              copiedTextError:"",

              isLoading: false,
              currentPage: 1,
              lastPage: null,

              defaultImage: "https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png",



              ///////////old /////////
              FromPageError :"",
              ToPageError :"",
              cdkcurrentPage:1 ,
              cdklastPage: 50,
              savedPages:[],
              savedPagesIds:[] ,
              cdkType:'edit' , 
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
          handleListPagePagination(currentPage){  
              sessionStorage.setItem("awarenessCurrentPage", this.currentPage);
              axios.get(`${baseUrl}/admin/blog/all?page=`+this.currentPage, config)
              .then((response) => {
                  this.blogs = response.data.data.data
                  this.currentPage = response.data.data.current_page
                  this.lastPage = response.data.data.last_page
              }).catch(function (error) {
                console.log(error)
              }); 
          },
          
          invokeEditModal(id, categoryId, bolgType, blogTitle, blogContent, blogOriginalContent, blogReferences, blogCoverImagePath, blogHideLikesCount, blogStatusId){
              this.currentBolgId = id
              this.categoryId = categoryId
              this.bolgType = bolgType
              this.blogTitle = blogTitle
              this.blogContent = blogContent
              this.blogOriginalContent = blogOriginalContent
              this.blogReferences = blogReferences
    
              this.blogCoverImagePath = blogCoverImagePath
              this.blogHideLikesCount = blogHideLikesCount
              this.blogStatusId = blogStatusId
  
              this.visibleEditModel = true
           
          },

          updateSummary(){
            this.copiedText = document.getElementsByClassName('ql-editor')[0].innerHTML 
             console.log("copiedText" ,this.copiedText )
              this.isLoading = true
              let requestBody = new FormData();
              requestBody.append('blog_id', this.currentBolgId)
              requestBody.append('category_id',this.categoryId )
              requestBody.append('blog_type', this.bolgType)
              requestBody.append('title',this.blogTitle )
              requestBody.append('content',this.blogContent )
              requestBody.append('formatted_content', this.copiedText)
              requestBody.append('original_content',  this.blogOriginalContent)
              requestBody.append('references', this.blogReferences)
              requestBody.append('hide_likes_count',this.blogHideLikesCount )
              requestBody.append('status_id', this.statusId)
      
            //   if(this.savedPages.length!=0) {
            //       for (let i = 0; i < this.savedPages.length; i++) {
            //           requestBody.append('formatted_pages['+i+']',this.savedPages[i])
            //       }
            //   }
  
            //   if(this.savedPagesIds.length!=0) {
            //       for (let i = 0; i < this.savedPagesIds.length; i++) {
            //           requestBody.append('pages_ids['+i+']',this.savedPagesIds[i])
            //       }
            //   }
             
              axios.post(`${baseUrl}/admin/blog/update`, requestBody, config).then((response) => {
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
                         icon: 'success'
                      })
  
                      this.savedPages = []
                      this.savedPagesIds = []
                  }
                  }).then( () => {
                  axios.get(`${baseUrl}/admin/blog/all?page=`+sessionStorage.getItem("awarenessCurrentPage"), config)
                      .then((response) => {
                          this.blogs = response.data.data.data                       
                      }).catch(function (error) {                                                        
                          // console.log(error)
                      });
                  }).catch(function (error) {                                                
                  // console.log(error);
              }).catch(function (error) {                                                
                  // console.log(error);
              })
          },
      
          invokeAddModal(id){
            //  this.currentAddSummaryId = id
            //  this.cdkcurrentManagePage =1 ;
            //  this.visibleAddModel = true
          },
   
          addFormattedSummary(){      
            //  let requestBody = new FormData();
            //  requestBody.append('book_summary_id', this.currentAddSummaryId)
            //  if(this.pagesContent.length!=0) {
            //       for (let i = 0; i < this.pagesContent.length; i++) {
            //           requestBody.append('formatted_pages['+i+']',this.pagesContent[i])
            //       }
            //   }
             
            //   axios.post(`${baseUrl}/admin/book-summary/page/add`, requestBody, config).then((response) => {
            //       if(response.data.status == false){                         
            //           this.isLoading = false
            //            console.log('error')
            //           this.$swal({
            //               title: 'عذرا, هناك خطأ',
            //               text: response.data.errors[0],
            //               icon: 'error'
            //           })
            //       }else{
            //           this.isLoading = false
            //           this.$swal({
            //               title: 'تم إضافة التنسيق بنجاح',
            //               // text: 'Welcome Back, Admin',
            //               icon: 'success'
            //           })
  
            //          this.pagesContent = []
            //          document.getElementsByClassName('ql-editor')[0].innerHTML = " "
            //       }
            //       }).then( () => {
            //       axios.get(`${baseUrl}/admin/book-summaries/all?page=`+sessionStorage.getItem("awarenessCurrentPage"), config)
            //           .then((response) => {
            //               this.blogs = response.data.data.data                       
            //           }).catch(function (error) {                                                        
            //                console.log(error)
            //           });
            //       }).catch(function (error) {                                                
            //        console.log(error);
            //   }).catch(function (error) {                                                
            //       console.log(error);
            //   })
          },
  
      },
      mounted(){

        this.types =[ 
            {id:1 , name_ar:'مقالات الإثرائيات'} ,
            {id:2 , name_ar:'مقالات تبادل الرأي'} ,
        ]
  
        this.originals = [ 
            {id:0 , name_ar:' غير أصلي '} ,
            {id:1 , name_ar:'أصلي '} ,  
        ]

         sessionStorage.setItem("awarenessCurrentPage", this.currentPage);
          axios.get(`${baseUrl}/admin/blog/all?page=`+sessionStorage.getItem("awarenessCurrentPage"), config)
          .then((response) => {
              this.blogs = response.data.data.data
              this.currentPage = response.data.data.current_page
              this.lastPage = response.data.data.last_page
          //    console.log("blogs",this.blogs)
          }).catch(function (error) {
              // console.log(error)
          }); 
    

          axios.get(`${baseUrl}/category/all`, config)
            .then((response) => {
                this.categories = response.data.data
                console.log("categories",this.categories)
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
      
      th:nth-of-type(9) {
        min-width:170px !important; 
      }
/*   
       th:nth-of-type(10) {
        min-width:150px !important;
      }
    */
   
  </style> 