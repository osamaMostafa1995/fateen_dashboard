<template>

    <CRow>

      <CCol :xs="12">

        <CCard class="mb-4">

            <CCardHeader>
                <strong>جدول قسم الوعي</strong>

                <CButton disabled v-show="isLoading">
                  <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                   جاري التحميل ... 
                </CButton>

            </CCardHeader>

            
            <CTable hover small responsive="sm" striped  v-if="!isLoading">

                <CTableHead>

                    <CTableRow color="dark">
                        <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell> 
                        <CTableHeaderCell scope="col">صورة الغلاف</CTableHeaderCell>                
                        <CTableHeaderCell scope="col">العنوان</CTableHeaderCell>
                        <CTableHeaderCell scope="col">اسم القسم</CTableHeaderCell>
                        <CTableHeaderCell scope="col">صورة الكاتب</CTableHeaderCell>      
                        <CTableHeaderCell scope="col">اسم الكاتب</CTableHeaderCell>       
                        <CTableHeaderCell scope="col">الحالة</CTableHeaderCell>              
                        <CTableHeaderCell scope="col">عدد الإعجابات</CTableHeaderCell>                
                        <CTableHeaderCell scope="col">إخفاء الإعجابات</CTableHeaderCell>                
                        <CTableHeaderCell scope="col">إدارة الملخص</CTableHeaderCell>
                
                    </CTableRow>

                </CTableHead>

                <CTableBody>

                    <CTableRow v-for="blog in blogs" :key="blog">

                        <CTableHeaderCell scope="row">{{blog.id}} </CTableHeaderCell>

                        <CTableDataCell v-if="blog?.cover_image_path">  <CImage rounded thumbnail :src='blog?.cover_image_path' width="50" height="50"/>   </CTableDataCell>    <CTableDataCell v-else>   <CImage rounded thumbnail :src="defaultImage" width="50" height="50"/> </CTableDataCell>
                       
                        <CTableDataCell> {{blog?.title }}</CTableDataCell>

                        <CTableDataCell> {{blog?.category?.name }}</CTableDataCell>

                        <CTableDataCell v-if="blog?.writter_image_path">  <CImage rounded thumbnail :src='blog?.writter_image_path' width="50" height="50"/>   </CTableDataCell>  <CTableDataCell v-else> <CImage rounded thumbnail :src="defaultImage" width="50" height="50"/>  </CTableDataCell>
                    
                        <CTableDataCell>{{blog?.written_by }}</CTableDataCell>
                        
                        <CTableDataCell v-if="blog.status_id == 0">  معلق    </CTableDataCell>   <CTableDataCell v-if="blog.status_id == 1">   مقبول     </CTableDataCell>   <CTableDataCell v-if="blog.status_id == 2">  مرفوض </CTableDataCell>
                            
                        <CTableDataCell>{{blog?.likes_count }}</CTableDataCell>

                        <CTableDataCell v-if="blog.hide_likes_count == 0">  إظهار </CTableDataCell>    <CTableDataCell v-else="blog.hide_likes_count == 1">إخفاء  </CTableDataCell>
                        
                        <CTableDataCell>
                            <CButton color="warning" variant="outline" @click="() => invokeEditModal(blog.id, blog?.category_id, blog?.type, blog?.title, blog?.content , blog?.original_content, blog?.references , blog?.cover_image_path, blog?.hide_likes_count, blog?.status_id , blog?.formatted_content)">   
                               <CIcon icon="cil-pencil" size="lg" />  
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

          <!-- Edit Modal -->

           <CModal size="lg" :visible="visibleEditModel" @close="() => { visibleEditModel = false }">

                <CModalHeader>
                    <CModalTitle>إدارة قسم الوعي</CModalTitle>
                </CModalHeader>

                <!-- <CButton disabled v-show="isLoading">
                    <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                    جاري التحميل ... 
                </CButton> -->

                <CModalBody>
                    <CCardBody>
                        <CForm class="row g-3">
                          
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
                                <CFormFeedback :class="{haveError: titleError}" v-if="titleError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback> <br>           
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
                                <CFormSelect v-model="blogStatusId" id="inputState"  :class="{onError: statusError, 'form-control' : !statusError}">
                                    <option value=1>قبول</option>
                                    <option value=2>رفض</option>
                                </CFormSelect>
                                <CFormFeedback :class="{haveError: statusError}" v-if="statusError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br> 
                            </CCol>

                            <CCol :md="12">
                                <strong><span> إخفاء الإعجابات</span></strong> : 
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
                    <CButton color="primary" @click="updateBlog">تعديل</CButton>
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

            <!-- <div class="my-2 mx-4 pt-2"> رقم الصفحة {{currentPage}}</div> -->

            <div class="my-2 mx-4 pt-2"> 
                <span v-if="listSpinner"> 
                    جاري التحميل  
                    <CSpinner  class="spinner" />   
                </span>

                <span v-else="!listSpinner"> 
                    رقم الصفحة {{currentPage}}
                </span>
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
    name: 'Blogs',
    data(){
            return {
              header:['الرقم التعريفي'  ,' صورة الغلاف ', 'العنوان ' , 'اسم القسم ' , 'صورة الكاتب ' , 'اسم الكاتب' , 'الحالة' , 'عدد الإعجابات' , 'إخفاء الإعجابات', 'إدارة الملخص'],
              listSpinner:false ,
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

              currentAddBlogId:0,
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
                this.allBlogs(this.currentPage)
            },
          
            invokeEditModal(id, categoryId, bolgType, blogTitle, blogContent, blogOriginalContent, blogReferences, blogCoverImagePath, blogHideLikesCount, blogStatusId , formattedContent){
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
                this.copiedText=formattedContent
                this.visibleEditModel = true
           
            },

            updateBlog(){
               this.copiedText = document.getElementsByClassName('ql-editor')[0].innerHTML 
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
                requestBody.append('status_id', this.blogStatusId)

                this.isLoading = true

                axios.post(`${baseUrl}/admin/blog/update`, requestBody, config).then((response) => {
                this.isLoading = false 
                if(response.data.status == false){                         
                    this.$swal({
                        title: 'عذرا, هناك خطأ',
                        text: response.data.errors[0],
                        icon: 'error'
                    })
                }
                else {
                    this.$swal({
                        title: 'تم التعديل بنجاح',
                        icon: 'success'
                    })

                    this.savedPages = []
                    this.savedPagesIds = []
                    this.allBlogs(sessionStorage.getItem("awarenessCurrentPage"))
                }
                }).catch( (error)=> { 
                    this.isLoading = false                                                
                    this.$swal({
                        title: 'عذرا, هناك خطأ',
                        text: error.errors[0],
                        icon: 'error'
                    })
                })
            },
         
            allBlogs(page) {
                this.isLoading = true
                this.listSpinner=true
                axios.get(`${baseUrl}/admin/blog/all?page=`+page, config)
                .then((response) => {
                    this.isLoading = false
                    this.listSpinner=false
                    this.blogs = response.data.data.data
                    this.currentPage = response.data.data.current_page
                    this.lastPage = response.data.data.last_page
                    console.log("bb",this.blogs)
                }).catch((error) => {
                    this.isLoading = false
                    // console.log(error)
                }); 
            }
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
 
        this.isLoading = true;
        sessionStorage.setItem("awarenessCurrentPage", this.currentPage);
        axios.get(`${baseUrl}/admin/blog/all?page=`+sessionStorage.getItem("awarenessCurrentPage"), config)
        .then((response) => {
            console.log("blogs" ,response.data.data.data)
            this.isLoading = false
            this.blogs = response.data.data.data
            this.currentPage = response.data.data.current_page
            this.lastPage = response.data.data.last_page
            
        }).catch((error) => {
            this.isLoading = false
        }); 
    
        axios.get(`${baseUrl}/category/all`, config)
        .then((response) => {
            this.categories = response.data.data
        }).catch((error) => {
        
        }); 

     }
  }
  </script>
  
  <style scoped>
    th:nth-of-type(1) ,  th:nth-of-type(2) {
       min-width: 130px  !important; 
    }

    th:nth-of-type(3) {
       min-width: 280px  !important; 
    }

    th:nth-of-type(9) {
       min-width: 133px  !important; 
    }  
  
  </style> 