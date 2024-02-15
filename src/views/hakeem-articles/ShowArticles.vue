<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <div class="icard-header"><strong>جدول المقالات</strong></div>
         <CTable hover small responsive="sm">
            <CTableHead>
            <CTableRow color="dark">
                <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell>
                <CTableHeaderCell scope="col">العنوان</CTableHeaderCell>
                <CTableHeaderCell scope="col">الوصف</CTableHeaderCell>
                <CTableHeaderCell scope="col">الإقتباس</CTableHeaderCell>
                <CTableHeaderCell scope="col">مثال</CTableHeaderCell>
                <CTableHeaderCell scope="col">الصورة الرئيسية</CTableHeaderCell>
                <!-- <CTableHeaderCell scope="col">الصور المرجعية</CTableHeaderCell> -->
                
                <CTableHeaderCell scope="col">الإعدادات</CTableHeaderCell>
            </CTableRow>
            </CTableHead>
            <CTableBody>
            <CTableRow v-for="article in articles" :key="article">
                <CTableHeaderCell scope="row">{{article.id}}</CTableHeaderCell>
                <CTableDataCell>{{article.title}}</CTableDataCell>
                <CTableDataCell>
                    <p v-for="element in (article.description.split(/\r?\n/))" :key="element">
                        {{element}}
                    </p>
                </CTableDataCell>
                <CTableDataCell>
                    <p>
                        <b>{{article.quotes_title}}</b><br>
                        <p v-for="element in (article.quotes.split(/\r?\n/))" :key="element">
                            {{element}}
                        </p>
                    </p>
                </CTableDataCell>
                <CTableDataCell>
                    <p v-for="element in (article.example.split(/\r?\n/))" :key="element">
                        {{element}}
                    </p>
                </CTableDataCell>
                <CTableDataCell>
                    <CImage rounded thumbnail :src="article.imagePath" width="50" height="50"/>
                </CTableDataCell>
                <!-- <CTableDataCell>
                    <CImage class="my-1" v-for="referenceImage in article.reference_images_list" :key="referenceImage" rounded thumbnail :src="referenceImage" width="50" height="50"/>
                </CTableDataCell> -->
                <CTableDataCell>
                <CButton
                    color="warning"
                    variant="outline"
                    @click="() => invokeModal(article.id, article.title, article.description, article.quotes_title, article.quotes, article.example, article.imagePath, article.reference_images_list)"
                >
                <CIcon icon="cil-pencil" size="lg" />
                </CButton>
                &nbsp;
                <CButton
                    color="danger"
                    variant="outline"
                    @click="deleteArticle(article.id)"
                >              
                <CIcon icon="cil-basket" size="lg" />
                </CButton>
                
                </CTableDataCell>
            </CTableRow>
            </CTableBody>
        </CTable>

        <CModal :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }">
            <CModalHeader>
            <CModalTitle>تعديل مقالة</CModalTitle>
            </CModalHeader>
            <CButton disabled v-show="isLoading">
                <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                Loading...
            </CButton>
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
                            <CFormFeedback :class="{haveError: titleError}" v-if="titleError">يجب ألا يكون الحقل المطلوب فارغاً او اكثر من 60 حرف</CFormFeedback><br>                  
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
                            <p for="quoteTitle">عنوان للإقتباس</p>
                            <CFormTextarea 
                                id="quoteTitle" 
                                type="text" 
                                class="form-control"
                                v-model="quoteTitle"
                                rows="4"
                            ></CFormTextarea>
                            <CFormFeedback :class="{haveError: quoteTitleError}" v-if="quoteTitleError">يجب ألا يكون الحقل المطلوب فارغاً او اكثر من 60 حرف</CFormFeedback><br>                  
                        </CCol>
                        <CCol :md="12">                         
                            <p for="quote">اقتباس</p>
                            <CFormTextarea 
                                id="quote" 
                                type="text" 
                                class="form-control"
                                v-model="quote"
                                rows="4"
                            ></CFormTextarea>
                        </CCol>
                        <CCol :md="12">                         
                            <p for="example">مثال</p>
                            <CFormTextarea 
                                id="example" 
                                type="text" 
                                class="form-control"
                                v-model="example"
                                rows="4"
                            ></CFormTextarea>
                        </CCol>
                        <CCol :md="12">
                            <p>تحميل الصورة الرئيسية</p>
                            <div>
                            <div class="dropzone dz-clickable">
                                <div class="dz-message needsclick ng-star-inserted">
                                <span class="note needsclick">
                                    (يمكن تحديد صورة تحتوي علي الامتدادات <strong>TIFF</strong> 
                                    ,<strong _ngcontent-vma-c163="">JPG</strong> , <strong>GIF</strong> ,
                                    <strong _ngcontent-vma-c163="">PNG</strong> )</span>
                                </div><br>
                                <!-- <input v-bind="getInputProps()" /> -->
                                <CFormInput type="file" size="lg" id="mainfile" @change="onMainImageUpload"/>
                            </div>
                            </div>
                        </CCol>
                        <CCol :md="12">
                            <div>
                                <div class="dropzone dz-clickable">
                                    <div v-if="tmpReferenceImages != null">
                                        <p>الصور المرفوعة مسبقا</p>
                                        <div class="mx-1 d-inline-block" v-for="referenceImage in tmpReferenceImages" :key="referenceImage">
                                            <CImage class="mx-2 d-block"  rounded thumbnail :src="referenceImage" width="50" height="50"/>
                                            <CButton
                                            class="d-inline-block my-2"
                                                color="danger"
                                                variant="outline"
                                                @click="deleteImage(referenceImage, tmpReferenceImages)"
                                            >حذف</CButton>
                                        </div>
                                        <br><br>
                                    </div>
                                    <p>انقر هنا لتحميل صور أخري</p>
                                    <CFormInput type="file" size="lg" id="myfiles" multiple @change="onFilesUpload"/>
                                </div>
                            </div>
                        </CCol>
                    </CForm>
                </CCardBody>
            </CModalBody>
            <CModalFooter>
            <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
                غلق
            </CButton>
            <CButton color="primary" @click="updateArticle">تعديل</CButton>
            </CModalFooter>
        </CModal>


        <CPagination>
            <CPaginationItem class="paginated-style" @click="handlePagination(1)">الأولي</CPaginationItem>
            <div v-if="currentPage == 1">
                <CPaginationItem disabled>السابقة</CPaginationItem>
            </div>
            <div v-else>
                <CPaginationItem class="paginated-style" @click="handlePagination(currentPage-1)">السابقة</CPaginationItem>
            </div>
            
            <div v-if="currentPage+1 <= lastPage">
                <CPaginationItem class="paginated-style" @click="handlePagination(currentPage+1)">{{currentPage+1}}</CPaginationItem>
            </div>
            <div v-if="currentPage+2 <= lastPage">
                <CPaginationItem class="paginated-style" @click="handlePagination(currentPage+2)">{{currentPage+2}}</CPaginationItem>
            </div>

            <div v-if="currentPage+3 <= lastPage">
                <CPaginationItem class="paginated-style" @click="handlePagination(currentPage+3)">{{currentPage+3}}</CPaginationItem>
            </div>
            
            <div v-if="currentPage == lastPage">
                <CPaginationItem disabled>التالية</CPaginationItem>
            </div>
            <div v-else>
                <CPaginationItem class="paginated-style" @click="handlePagination(currentPage+1)">التالية</CPaginationItem>
            </div>
            <CPaginationItem class="paginated-style" @click="handlePagination(lastPage)">الأخيرة</CPaginationItem>
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

sessionStorage.setItem("articleCurrentPage", 1);

export default {
    name: 'Tables',
    data(){
        return {
            visibleLiveDemo: false,

            articles: [],
            title: "",
            titleError: "",
            description: "",
            quoteTitle: "",
            quoteTitleError: "",
            quote: "",
            example: "",
            mainImage: "",
            referenceImages: [],
            tmpReferenceImages: [],
                        
            files: [],
            files_links: [],
            totalReferencesImages: [],

            currentArticleId: null,

            isLoading: false,
            currentPage: null,
            lastPage: null
        }
    },
    methods: {
        handlePagination(id){
            sessionStorage.setItem("articleCurrentPage", id);
            axios.get(`${baseUrl}/hakeem-articles/all?page=`+id, config)
            .then((response) => {
                // console.log(response.data.data)
                this.articles = response.data.data.data
                this.currentPage = response.data.data.current_page
                this.lastPage = response.data.data.last_page
                // console.log(this.currentPage)
                // console.log(this.lastPage)
            }).catch((error) => {
                console.log(error)
            }); 
        },
        deleteArticle(id) {
            if(confirm("هل متأكد من عملية الحذف؟")){
                axios.delete(`${baseUrl}/admin/article/delete?article_id=${id}`, config)
                .then(response => {
                    this.$swal({
                        title: 'تم الحذف بنجاح',
                        icon: 'success'
                    })
                }).then( () => {
                    axios.get(`${baseUrl}/hakeem-articles/all?page=`+sessionStorage.getItem("articleCurrentPage"))
                    .then((response) => {
                        this.articles = response.data.data.data
                        this.currentPage = response.data.data.current_page
                        this.lastPage = response.data.data.last_page
                    }).catch( (error) =>{
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
        invokeModal(id, title, description, quoteTitle, quote, example, imagePath, referenceImages){
          this.currentArticleId = id
          this.title = title
          this.description = description
          this.quoteTitle = quoteTitle
          this.quote = quote
          this.example = example
          this.mainImage = imagePath
          this.tmpReferenceImages = referenceImages
          this.visibleLiveDemo = true
        },
        updateArticle(){
        //   console.log(this.currentArticleId)
            this.isLoading = true

            if(this.files.length > 0){
                let requestBody = new FormData();
                for( var i = 0; i < this.files.length; i++ ){
                    let file = this.files[i];
                    requestBody.append('files[' + i + ']', file);
                }

                axios.post(`${baseUrl}/upload/files`, requestBody, config).then((response) => {
                // console.log(response.data);
                if(response.data.status == false){
                console.log('error')
                this.$swal({
                    title: 'عذرا, هناك خطأ',
                    icon: 'error'
                })
                }else{
                // console.log(response.data.data)
                this.files = response.data.data
                // console.log(this.files)
                this.totalReferencesImages = this.files.concat(this.tmpReferenceImages)
                // console.log(this.totalReferencesImages)
                }
            }).then( () => {
                            
                let requestBody = new FormData();

                requestBody.append('article_id', this.currentArticleId)

                if(this.title == '' || this.title.length > 60){
                    this.titleError = true
                }

                if(this.title != '' && this.title.length <= 60){
                    this.titleError = false
                    requestBody.append('title', this.title)
                }

                if(this.description != ''){
                    requestBody.append('description', this.description)
                }

                if(this.quoteTitle == '' || this.quoteTitle.length > 60){
                    this.quoteTitleError = true
                }

                if(this.quoteTitle != '' && this.quoteTitle.length <= 60){
                    this.quoteTitleError = false
                    requestBody.append('quotes_title', this.quoteTitle)
                }

                if(this.quotes != ''){
                    requestBody.append('quotes', this.quote)
                }

                if(this.example != ''){
                    requestBody.append('example', this.example)
                }

                if(this.mainImage.length == 1){
                    requestBody.append('image', this.mainImage)
                }

                for( var i = 0; i < this.totalReferencesImages.length; i++ ){
                    let file = this.totalReferencesImages[i]
                    requestBody.append('reference_images[' + i + ']', file)
                }

                if(!this.titleError && !this.quoteTitleError){
                        axios.post(`${baseUrl}/admin/article/update`, requestBody, config).then((response) => {
                        if(response.data.status == false){                                                    
                            this.isLoading = false
                            this.$swal({
                                title: 'عذرا, هناك خطأ',
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
                            axios.get(`${baseUrl}/hakeem-articles/all?page=`+sessionStorage.getItem("ArticleCurrentPage"))
                            .then((response) => {
                                this.articles = response.data.data.data
                                this.files = []
                                this.tmpReferenceImages = []
                                this.totalReferencesImages = []
                            }).catch( (error) =>{
                                console.log(error)
                            });
                        }).catch((error) =>  {
                        console.log(error);
                    });

                }else{
                    this.isLoading = false
                }
         
                }).catch((error) => {
                    console.log(error);
            });
                
            }else{

            let requestBody = new FormData();
            requestBody.append('article_id', this.currentArticleId)

            if(this.title == '' || this.title.length > 60){
                this.titleError = true
            }

            if(this.title != '' && this.title.length <= 60){
                this.titleError = false
                requestBody.append('title', this.title)
            }

            if(this.description != ''){
                requestBody.append('description', this.description)
            }

            if(this.quoteTitle == '' || this.quoteTitle.length > 60){
                this.quoteTitleError = true
            }

            if(this.quoteTitle != '' && this.quoteTitle.length <= 60){
                this.quoteTitleError = false
                requestBody.append('quotes_title', this.quoteTitle)
            }

            if(this.quote != ''){
                requestBody.append('quotes', this.quote)
            }

            if(this.example != ''){
                requestBody.append('example', this.example)
            }

            if(this.mainImage.length == 1){
                requestBody.append('image', this.mainImage)
            }

            if(this.tmpReferenceImages.length > 0){
                for( var i = 0; i < this.tmpReferenceImages.length; i++ ){
                    let file = this.tmpReferenceImages[i]
                    requestBody.append('reference_images[' + i + ']', file)
                }
            }else{
                requestBody.append('reference_images[0]', null)
            }

            if(!this.titleError && !this.quoteTitleError){
                axios.post(`${baseUrl}/admin/article/update`, requestBody, config).then((response) => {
                    if(response.data.status == false){
                                    
                        console.log(response.data)
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
                    axios.get(`${baseUrl}/hakeem-articles/all?page=`+sessionStorage.getItem("articleCurrentPage"))
                        .then((response) => {
                            this.articles = response.data.data.data
                            this.files = []
                            this.tmpReferenceImages = []
                            this.totalReferencesImages = []                        
                        }).catch( (error) => {                                                        
                            console.log(error)
                        });
                    }).catch( (error) =>{                                                
                    console.log(error);
                }).catch( (error) => {                                                
                    console.log(error);
                })
            }else{
                this.isLoading = false
            }      
        }
          
        },
        onMainImageUpload(event) {
            // console.log(event.target.files)
            this.mainImage = event.target.files[0]
        },
        onFilesUpload(event) {
            // console.log(event.target.files)
            this.files = event.target.files
        },
        deleteImage(imagePath, images){
            this.tmpReferenceImages = []
            for(let i=0;i<images.length;i++){
                if(images[i] == imagePath){
                    continue;
                }else{
                    this.tmpReferenceImages.push(images[i])
                }
            }
        }
    },
    mounted(){
        axios.get(`${baseUrl}/hakeem-articles/all?page=`+sessionStorage.getItem("articleCurrentPage"), config)
        .then((response) => {
            this.articles = response.data.data.data
            this.currentPage = response.data.data.current_page
            this.lastPage = response.data.data.last_page

            // console.log(this.facts)
        }).catch( (error) => {
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

    p{
        width:250px;
  
        /**Major Properties**/
        overflow:hidden;
        line-height: 2rem;
        max-height: 8rem;
        -webkit-box-orient: vertical;
        display: block;
        display: -webkit-box;
        overflow: hidden !important;
        text-overflow: ellipsis;
        -webkit-line-clamp: 4;
    }

</style>