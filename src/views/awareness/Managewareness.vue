<template>

    <CRow>

      <CCol :xs="12">

        <CCard class="mb-4">

            <CCardHeader>
                <div class="icard-header"><strong>إضافة قسم الوعي </strong></div>
            </CCardHeader>
            
            <CButton disabled v-show="isLoading">
                    <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                    تحميل ...
           </CButton> 

            <CCardBody>
 
                <CForm class="row g-3">
 
                    <CCol :md="12">
                        <p>تحميل الصورة الرئيسية</p>
                        <div>
                            <div class="dropzone dz-clickable">
                                <div class="dz-message needsclick ng-star-inserted">
                                    <span class="note needsclick">
                                        (يمكن تحديد صورة تحتوي علي الامتدادات <strong>TIFF</strong> 
                                        ,<strong _ngcontent-vma-c163="">JPG</strong> , <strong>GIF</strong> ,
                                        <strong _ngcontent-vma-c163="">PNG</strong> )
                                    </span>
                                </div>
                                <br>
                                
                               <CFormLabel for="mainfile" style="border:1px solid #3c4b64 ; margin: auto;border-radius: 5px; ">
                                    <span class=" " style="position: relative; top:25px;  "> انقر هنا لتحميل الصورة الرئيسية <CIcon size="lg" icon="cil-cloud-upload" class="mx-2" style="vertical-align: middle;"/> </span> 
                                    <CFormInput type="file" size="lg" id="mainfile" @change="onMainImageUpload" style="visibility: hidden; "/> 
                               </CFormLabel>
                               <p class="mt-2"> {{ blogCoverImageName }}</p>
                               <CFormFeedback :class="{haveError: blogCoverImagePathError}" v-if="blogCoverImagePathError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>                  
                            </div>
                        </div>
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
        
            <div class="modal-footer">
                <CButton class="py-2 px-5 m-4" color="primary" @click="addBlog">إضافة</CButton>
            </div>
            
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
      name: 'Create Blog',
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
            blogCoverImageName:"" ,
            // blogHideLikesCount :"",
            // blogStatusId: null,
            // copiedText :"",

            blogCoverImagePathError:"" ,
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

            if(this.blogCoverImagePath == ""){
            this.blogCoverImagePathError = true
            }
            if(this.blogCoverImagePath != ""){
            this.blogCoverImagePathError = false
            }

            // if(this.blogCoverImagePath == ""){
            // this.blogCoverImagePathError = true
            // }
            // if(this.blogCoverImagePath != ""){
            // this.blogCoverImagePathError = false
            // }

            this.copiedText = document.getElementsByClassName('ql-editor')[0].innerHTML 
            //  console.log("copiedText" ,this.copiedText )
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
                  }).catch((error) =>{                                                
                  // console.log(error);
              })
          },
          onMainImageUpload(event) {
            console.log(event.target.files[0])
            this.blogCoverImagePath = event.target.files[0]
            this.blogCoverImageName= event.target.files[0]?.name
            // imgInput = event.target
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
            // console.log("categories",this.categories)
        }).catch((error)=> {
           // console.log(error)
        }); 
        }
   }
  </script>
  
  <style scoped>
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
  </style> 