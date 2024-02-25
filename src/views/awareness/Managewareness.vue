<template>

    <CRow>

      <CCol :xs="12">

        <CCard class="mb-4">

            <CCardHeader>
              <strong>إضافة قسم الوعي </strong> 
            </CCardHeader>
           
            <CCardBody>
 
                <CForm class="row g-3">
 
                    <CCol :md="12" v-if="bolgType==1">
                        <p>تحميل الصورة الرئيسية</p>
                        <div>
                            <div class="dropzone dz-clickable">
                              <img :src="blogCoverImagePath ===  this.defaultImage  ?  this.defaultImage  : 'https://backend.fateen.info/public/'+blogCoverImagePath " :key=" this.defaultImage " class="cover">
                               <div class="dz-message needsclick ng-star-inserted">
                                    <span class="note needsclick">
                                        (يمكن تحديد صورة تحتوي علي الامتدادات <strong>TIFF</strong> 
                                        ,<strong _ngcontent-vma-c163="">JPG</strong> , <strong>GIF</strong> ,
                                        <strong _ngcontent-vma-c163="">PNG</strong> )
                                    </span>
                                </div>
                                <br>
                                
                               <CFormLabel  class="dp-label" for="mainfile" >
                                    <span>  
                                        <CSpinner class="dp-spinner" component="span" size="sm" aria-hidden="true" v-show="isLoading"/>
                                        انقر هنا لتحميل الصورة الرئيسية 
                                        <CIcon class="mx-2 dp-icon" size="lg" icon="cil-cloud-upload"/> </span> 
                                       <CFormInput class="dp-input" type="file" size="lg" id="mainfile" @change="onMainImageUpload" style="visibility: hidden"/> 
                               </CFormLabel>
                               <p class="mt-2"> {{ blogCoverImageName }}</p>
                             </div>
                        </div>
                        <CFormFeedback :class="{haveError: blogCoverImagePathError}" v-if="blogCoverImagePathError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br> 
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

                    <CCol :md="12" v-if="bolgType==1">                
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

                    <CCol :md="12" v-if="bolgType==1">                
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
                 
                    <CCol :md="12" v-if="bolgType==2">
                        <p>تحميل صور قسم الوعي</p>
                        <div>
                           <div class="dropzone dz-clickable">
                                <span v-for="(blogImage , index) in blogOtherImageShowPath" :key="blogImage" class="mx-2">
                                    <div class="close" @click="deleteOtherImages(index)" v-show="blogOtherImageShowPath[0] !=  this.defaultImage"> 
                                           <span>x</span>    
                                        </div> 

                                    <img :src="blogOtherImageShowPath[0] ===  this.defaultImage  ?  this.defaultImage  : 'https://backend.fateen.info/public/'+blogImage " :key=" this.defaultImage " class="cover"/> 
                                </span>  
                                <div class="dz-message needsclick ng-star-inserted">
                                    <span class="note needsclick">
                                        (يمكن تحديد صور تحتوي علي الامتدادات <strong>TIFF</strong> 
                                        ,<strong _ngcontent-vma-c163="">JPG</strong> , <strong>GIF</strong> ,
                                        <strong _ngcontent-vma-c163="">PNG</strong> )
                                    </span>
                                </div>
                                <br>
                                

                               <CFormLabel class="dp-label" for="otherfile">
                                    <span class="px-2 mt-2"> 
                                       <CSpinner class="dp-spinner"  component="span" size="sm" aria-hidden="true" v-show="isLoading"/>  انقر هنا لتحميل صور قسم الوعي     
                                       <CIcon class="dp-icon mx-2" size="lg" icon="cil-cloud-upload"/>  
                                    </span> 
                                    <CFormInput class="dp-input" type="file" size="lg" id="otherfile" @change="otherBlogImagesUpload" style="visibility: hidden"/> 
                              
                               </CFormLabel>
                               <p class="mt-2 uploaded-files"> 
                                 <span v-for="name in blogOtherImageName" :key="name"> {{name}}</span>
                              </p>
                                          
                            </div>
                        </div>
                        <CFormFeedback :class="{haveError: blogOtherImagePathError}" v-if="blogOtherImagePathError">يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback><br>     
                    </CCol>
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
  import placeholder from '../../assets/images/placeholder.png'
  const baseUrl = env.baseUrl
  const token = localStorage.token
  const config = {
      headers: { Authorization: `Bearer ${token}` }
  }
  
//   sessionStorage.setItem("currentBolgId", 1);
  
  export default {
      name: 'Create Blog',
      data(){
      
         return {
            types: [],
            categories:[],
            originals:[],
            categoryId: "",
            bolgType:1,
            blogTitle: "",
            blogContent: "",
            blogOriginalContent: 0,
            blogReferences: "",
            blogCoverImagePath:"" , 
            blogCoverImageName:"" ,

            blogOtherImagePath:[],
            blogOtherImageName:[],
            blogOtherImageShowPath:[],
            blogOtherImagePathError:"",
            
            copiedText :"",
            blogCoverImagePathError:"" ,
            typeError:"",
            categoryError:"",
            titleError:"",
            contentError:"",
            originalContentError:"",
            referenceError:"",
            copiedTextError:"",
            isLoading: false,
            defaultImage:"",
          }
      },
      methods: {
          addBlog(){

            if(this.blogCoverImagePath == placeholder){
             this.blogCoverImagePathError = true
            }
            if(this.blogCoverImagePath != placeholder){
             this.blogCoverImagePathError = false
            }

            if(this.blogTitle == ""){
             this.titleError = true
            }
            if(this.blogTitle != ""){
             this.titleError = false
            }
 
            if(this.blogReferences == ""){
             this.referenceError = true
            }
            if(this.blogReferences != ""){
             this.referenceError = false
            }

            if(this.categoryId == ""){
             this.categoryError = true
            }
            if(this.categoryId != ""){
             this.categoryError = false
            }

            if(this.bolgType == ""){
             this.typeError = true
            }
            if(this.bolgType != ""){
             this.typeError = false
            }

            if(this.blogOriginalContent == ""){
             this.originalContentError = true
            }
            if(this.blogOriginalContent != ""){
             this.originalContentError = false
            }

            if(this.blogContent == ""){
             this.contentError = true
            }
            if(this.blogContent != ""){
             this.contentError = false
            }

            if(this.copiedText == ""){
             this.copiedTextError = true
            }
            if(this.copiedText != ""){
             this.copiedTextError = false
            }
 
            if(this.blogOtherImageShowPath[0]== placeholder){
             this.blogOtherImagePathError = true
            }
            if(this.blogOtherImageShowPath[0] != placeholder){
             this.blogOtherImagePathError = false
            }

           this.copiedText = document.getElementsByClassName('ql-editor')[0].innerHTML 
            //this.isLoading = true
            let requestBody = new FormData();
            requestBody.append('title',this.blogTitle )
            requestBody.append('category_id',this.categoryId )
            requestBody.append('blog_type', this.bolgType)
            requestBody.append('content',this.blogContent )

            if(this.blogReferences!="" && this.bolgType==1) {
            requestBody.append('references', this.blogReferences)
            }

            if(this.blogOriginalContent!="" && this.bolgType==1) { 
            requestBody.append('original_content',  this.blogOriginalContent)
            }

            if(this.copiedText!="<p><br></p>") { 
            requestBody.append('formatted_content', this.copiedText)    
            }
            
            if(this.blogCoverImagePath!= placeholder && this.bolgType==1) { 
              requestBody.append('cover_image', this.blogCoverImagePath)
            }                  
        
            if(this.blogOtherImageShowPath[0]!= placeholder && this.bolgType==2) { 
                for (let i = 0; i < this.blogOtherImageShowPath.length; i++) {
                    requestBody.append('blog_images[' + i + ']', this.blogOtherImageShowPath[i]);
                }
            }  
 
            axios.post(`${baseUrl}/admin/blog/create`, requestBody, config).then((response) => {
                 if(response.data.status == false){                         
                     this.$swal({
                          title: 'عذرا, هناك خطأ',
                          text: response.data.errors[0],
                          icon: 'error'
                      })
                  }else{
                      this.$swal({
                          title: 'تم الإضافة بنجاح',
                         icon: 'success'
                      })
                      this.$router.push('/awareness/all') 
                      this.blogOtherImageShowPath=[]
                      this.blogOtherImagePath =[]
                      this.blogOtherImageName=[]
                      this.blogCoverImagePath = ""
                      this.blogCoverImageName= ""
                    }
              }).catch((error) =>{                                                
               // console.log(error);
              })
          },

          onMainImageUpload(event) {
            this.blogCoverImagePath = event.target.files[0]
            this.blogCoverImageName= event.target.files[0]?.name
            let requestBody = new FormData();
            requestBody.append('files[0]', event.target.files[0]);
            this.isLoading = true
            axios.post(`${baseUrl}/upload/files`, requestBody).then((response) => {
            this.isLoading = false
             
                this.blogCoverImagePath = response.data.data[0]
               console.log("files",  this.blogCoverImagePath )
            }).catch((error)=> {
            // console.log(error)
            }); 
          },

          otherBlogImagesUpload(event) { 
            this.blogOtherImageShowPath = []
            this.blogOtherImagePath.push(...event.target.files)
            this.blogOtherImageName.push(event.target.files[0]?.name)
            let requestBody = new FormData();
            if (this.blogOtherImagePath.length != 0) {
                for (let i = 0; i < this.blogOtherImagePath.length; i++) {
                 requestBody.append('files[' + i + ']', this.blogOtherImagePath[i]);
                }
            }
            this.isLoading = true
            axios.post(`${baseUrl}/upload/files`, requestBody).then((response) => {
            this.isLoading = false
                for (let y=0 ; y<response.data.data.length ; y++) {
                    this.blogOtherImageShowPath.push(response.data.data[y])  
                }
               console.log("other files",  this.blogOtherImageShowPath)
            }).catch((error)=> {
            // console.log(error)
            }); 
          },

          deleteOtherImages(index) {
              console.log("index",index)
              this.blogOtherImageShowPath.splice(index,1);
              this.blogOtherImagePath.splice(index,1);
           }

      },
  
      mounted(){
        this.defaultImage =placeholder
        this.blogCoverImagePath=placeholder ;
        this.blogOtherImageShowPath[0]=placeholder ;
        // "https://placehold.co/600x400" ,
    

        this.types =[ 
            {id:1 , name_ar:'مقالات الإثرائيات'} ,
            {id:2 , name_ar:'مقالات تبادل الرأي'} ,
        ]
  
        this.originals = [ 
            {id:0 , name_ar:' غير أصلي '} ,
            {id:1 , name_ar:'أصلي '} ,  
        ]
 
        axios.get(`${baseUrl}/category/all`, config).then((response) => {
          this.categories = response.data.data
          // console.log("categories",this.categories)
        }).catch((error)=> {
          // console.log(error)
        }); 
      }
   }
  </script>
  
  <style lang="scss" scoped>
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
    background:#d0e2dc47;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    min-height: 150px;
    position: relative;
    .close {
            color:#3b6264 ;
            position: relative;
            bottom: 75px;
            right: 20px;
            height: 20px;
            width: 20px;
            display: inline-block;
            border: 1px solid #3b6264 ;
            border-radius: 50%;
            background: #fff;

            span {
                bottom: 5px;
                position: relative;
            }

            &:hover {
                color:#fff ;
                background:#3b6264;
            }
        }

    }

    img.cover {
        height: 170px; 
        width: 138px;
        margin-bottom: 10px;
        border-radius: 10px;
    }

    .uploaded-files { 
        span:not(:last-child) {
            &::after  {
              content:'/';
              margin-left: 5px;
              margin-right: 5px;
            }
        }
    }
 
    .dp-label {
        border:1px solid #85a3a5 ;
        margin: auto; 
        border-radius: 5px;height: 55px;
        span {
            position: relative; 
            top:14px;
                .dp-spinner {
                    color: #3b6264;
                    position: relative;
                    top: 2px;
                    left: 6px; 
                }
        }
        .dp-icon {
            vertical-align: middle;
        }
        
   }
        

   

  </style> 