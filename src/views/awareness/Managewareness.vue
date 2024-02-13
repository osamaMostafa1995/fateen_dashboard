<template>
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
            <CCardHeader>
                <div class="icard-header"><strong>جدول الملخصات</strong></div>
            </CCardHeader>
                <CCardBody>
                    <CButton disabled v-show="isLoading">
                       <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                       Loading...
                    </CButton>
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

                        <!-- <CCol :md="12">
                            <strong><span> الحالة</span></strong> : 
                            <br>
                            <CFormLabel for="inputState">اختيار الحالة</CFormLabel>
                            <CFormSelect v-model="statusId" id="inputState"  :class="{onError: statusError, 'form-control' : !statusError}">
                                <option value="1">قبول</option>
                                <option value="2">رفض</option>
                            </CFormSelect>
                            <CFormFeedback :class="{haveError: statusError}" v-if="statusError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br> 
                        </CCol> -->

                        <!-- <CCol :md="12">
                            <strong><span> إخفاء عدد الإعجابات</span></strong> : 
                            <br>
                            <CFormLabel for="blogHideLikesCount">اختيار حالة إخفاء عدد الإعجابات</CFormLabel>
                            <CFormSelect v-model="blogHideLikesCount" id="blogHideLikesCount"  :class="{onError: likesCountError, 'form-control' : !likesCountError}">
                                <option value="0">إخفاء</option>
                                <option value="1">إظهار</option>
                            </CFormSelect>
                            <CFormFeedback :class="{haveError: likesCountError}" v-if="likesCountError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br> 
                        </CCol> -->
                
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
        
                <CButton color="primary" @click="addBlog">إضافة</CButton>
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
      name: 'Manage',
      data(){
         return {
            currentBolgId: null,  
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
            // blogHideLikesCount :"",
            // blogStatusId: null,
            // copiedText :"",
            typeError:"",
            categoryError:"",
            titleError:"",
            contentError:"",
            originalContentError:"",
            referenceError:"",
            // statusError:"", 
            // likesCountError:"" ,
            // copiedTextError:"",
            isLoading: false,
            defaultImage: "https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png",
          }
      },
      methods: {
          addBlog(){
            this.copiedText = document.getElementsByClassName('ql-editor')[0].innerHTML 
             console.log("copiedText" ,this.copiedText )
              this.isLoading = true
              let requestBody = new FormData();
              requestBody.append('title',this.blogTitle )
              requestBody.append('references', this.blogReferences)
              requestBody.append('category_id',this.categoryId )
              requestBody.append('blog_type', this.bolgType)
              requestBody.append('content',this.blogContent )
              requestBody.append('original_content',  this.blogOriginalContent)
              requestBody.append('cover_image', this.blogCoverImagePath)
               //   requestBody.append('status_id', this.statusId)
               //   requestBody.append('blog_id', this.currentBolgId)
              //   requestBody.append('hide_likes_count',this.blogHideLikesCount )
              //  requestBody.append('formatted_content', this.copiedText)                         ask mostafa 
           
              axios.post(`${baseUrl}/admin/blog/create`, requestBody, config).then((response) => {
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
                          title: 'تم الإضافة بنجاح',
                         icon: 'success'
                      })
                    }
                  }).catch(function (error) {                                                
                  // console.log(error);
              })
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
     
  </style> 