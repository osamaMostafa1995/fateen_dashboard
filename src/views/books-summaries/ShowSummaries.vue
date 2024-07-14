<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>جدول الملخصات</strong>

          <CButton disabled v-show="isLoading">
            <CSpinner
              component="span"
              size="sm"
              variant="grow"
              aria-hidden="true"
            />
            جاري التحميل ...
          </CButton>
        </CCardHeader>

        <CTable hover small responsive="sm" striped v-if="!isLoading">
          <CTableHead>
            <CTableRow color="dark">
              <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell>

              <CTableHeaderCell scope="col">اسم الكتاب</CTableHeaderCell>

              <CTableHeaderCell scope="col">المؤلف</CTableHeaderCell>

              <CTableHeaderCell scope="col">عدد الصفحات</CTableHeaderCell>

              <CTableHeaderCell scope="col">  مدة الملف الصوتى</CTableHeaderCell>

              <CTableHeaderCell scope="col">صورة الغلاف</CTableHeaderCell>

              <CTableHeaderCell scope="col">عدد التحميلات</CTableHeaderCell>
         

              <CTableHeaderCell scope="col">تحميل الملفات</CTableHeaderCell>

              <CTableHeaderCell scope="col">إدارة الملخص</CTableHeaderCell>

           
            </CTableRow>
          </CTableHead>

          <CTableBody>
            <CTableRow v-for="summary in summaries" :key="summary">
              <CTableHeaderCell scope="row">{{ summary.id }} </CTableHeaderCell>

              <CTableDataCell>{{ summary?.title || '-' }}</CTableDataCell>

              <CTableDataCell>{{ summary?.writer_name || '-' }}</CTableDataCell>

              <CTableDataCell>{{ summary.page_count }}</CTableDataCell>

              <CTableDataCell>{{ summary.audio_duration
 }} ث</CTableDataCell>

              <CTableDataCell
                v-if="!summary?.book?.book_cover_path.includes('null')"
              >
                <CImage
                  rounded
                  thumbnail
                  :src="summary?.cover_url"
                  onerror=" this.src=defaultImage"
                  width="50"
                  height="50"
                />
              </CTableDataCell>

              <CTableDataCell v-else>
                <CImage
                  rounded
                  thumbnail
                  :src="defaultImage"
                  width="50"
                  height="50"
                />
              </CTableDataCell>

            
     <CTableDataCell>
     {{ summary.
download_count
 }}
     </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  variant="outline"
                  @click="() => downloadSummaries(summary.content_url)"
                >
                  <CIcon icon="cil-file" size="lg" />
              
                  
                </CButton>
                     <CButton
                  color="primary"
                  variant="outline"
                  @click="() => downloadSummaries(summary.audio_url)"
                >
                  <CIcon icon="cil-media-play" size="lg" />
              
                  
                </CButton>
                   
              </CTableDataCell>

              <CTableDataCell>
                <CButton
                  color="warning"
                  variant="outline"
                  @click="
                    () =>
                      invokeEditModal(
                        summary.id,
                        summary.title,
                        summary.writer_name,
                        summary.brief_category_id,
                        summary.cover_url,
                        summary.audio_url,
                        summary.audio_duration,
                        summary.content_url,
                        summary.page_count,
                        summary.audio,
                        summary.content,
                        summary.cover,
                      )
                  "
                >
                  <CIcon icon="cil-pencil" size="lg" />
                </CButton>
                   <CButton
                  color="danger"
                  variant="outline"
                  @click="deleteCity(city.id)"
                >
                  <CIcon icon="cil-basket" size="lg" />
                </CButton>
              </CTableDataCell>

            
            </CTableRow>
          </CTableBody>
        </CTable>

        <CTable
          hover
          small
          responsive="sm"
          class="placeholder-table"
          striped
          v-if="isLoading"
        >
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col" v-for="head in header">
                {{ head }}</CTableHeaderCell
              >
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow class="text-center" v-for="row in [].constructor(10)">
              <CTableHeaderCell
                scope="col"
                v-for="column in [].constructor(10)"
              >
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

        <CModal
          size="lg"
          :visible="visibleEditModel"
          @close="
            () => {
              visibleEditModel = false
            }
          "
        >
          <CModalHeader>
            <CModalTitle>تعديل بيانات الملخص</CModalTitle>
          </CModalHeader>

          <CButton disabled v-show="isLoading">
            <CSpinner
              component="span"
              size="sm"
              variant="grow"
              aria-hidden="true"
            />
            جاري التحميل ...
          </CButton>

          <CModalBody>
            <CCardBody>
              <CForm class="row g-3">
                <h5 class="fw-bold">عرض بيانات الكتاب</h5>
                <CCol :md="12">
                  <CFormLabel > أسم الكتاب</CFormLabel>
                  <input
                    
                    type="text"
                    class="p-2"
                    :class="{
                      onError: FromPageError,
                      'form-control': !FromPageError,
                    }"
                    v-model="this.bookName"
                  />
                  <CFormFeedback
                    :class="{ haveError: FromPageError }"
                    v-if="FromPageError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>
               
                <CCol :md="12">
                  <CFormLabel > أسم المؤلف</CFormLabel>
                  <input
                    
                    type="text"
                    class="p-2"
                    :class="{
                      onError: FromPageError,
                      'form-control': !FromPageError,
                    }"
                    v-model="this.author"
                  />
                  <CFormFeedback
                    :class="{ haveError: FromPageError }"
                    v-if="FromPageError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>
             

            
                <CCol :md="12">
                  <CFormLabel for="state">اختيار قسم الكتاب</CFormLabel>
                  <CFormSelect v-model="this.bookId" id="state">
                    <option :value="item.id" v-for="item in categories" :key="item">{{item.name_en}}</option>
                   
                  </CFormSelect>
                </CCol>
               

              
                <hr />
                <h5 class="fw-bold">ملفات الملخصات </h5>
                <CRow>
                  <CCol class="mt-4 text-center" :lg="4">
                    <CFormLabel for="from_page">  صورة الغلاف </CFormLabel>
                    <br>
                    <CImage
                  rounded
                  thumbnail
                  :src="coverImage"
                  
               style="width: 100%; height: 200px"
                />
             
                    <CFormLabel
                 
                      style="
                        border: 1px solid #3c6264;
                        background: #3c6264;
                        margin: auto;
                        border-radius: 5px;
                        width: 100%;
                        height: 40px;
                        color: #ececec;
                        text-align: center;
                        margin-top:10px;
                        padding-top:5px;
                      "
                    >
                      <span
                        class=" "
                        style="font-size:11px"
                      >
                        {{ 'انقر هنا لتحميل  صورة الغلاف' }}
                        <CIcon
                          size="lg"
                          icon="cil-cloud-upload"
                          class="mx-2"
                          style="vertical-align: middle"
                        />
                      </span>
                      <CFormInput
                        type="file"
                        size="lg"
                       accept="image/*"
                        @change="onMainImageUpload"
                      hidden
                      />
                     
                    </CFormLabel>
  
                    <CFormFeedback
                      :class="{ haveError: summaryFilesError }"
                      v-if="summaryFilesError"
                      >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                    ><br />
                  </CCol>
                  <CCol class="mt-4 text-center" :lg="4">
                    <CFormLabel for="from_page"> ملف نصى </CFormLabel>
                    <p class="uploaded-files text-primary">
                     
                      {{content_url}}
                   
                  </p>
                  <CFormLabel for="from_page"> عدد الصفحات </CFormLabel>
                  <br>
                  <input
                      
                  type="text"
                  class="p-2"
                  :class="{
                    onError: FromPageError,
                    'form-control': !FromPageError,
                  }"
                  v-model="this.page_count"
                />
                <br>
                    <CFormLabel
        
                      style="
                        border: 1px solid #3c6264;
                        background: #3c6264;
                        margin: auto;
                        border-radius: 5px;
                        width: 100%;
                        height: 40px;
                        color: #ececec;
                        text-align: center;
                        padding-top:5px;
                      "
                    >
               
                      <span
                        class=" "
                        style="font-size:11px"
                      >
                        {{ 'انقر هنا لتحميل الملف النصى ' }}
                        <CIcon
                          size="lg"
                          icon="cil-cloud-upload"
                          class="mx-2"
                          style="vertical-align: middle"
                        />
                      </span>
                   
                      <CFormInput
                        type="file"
                        size="lg"
                        
                        @change="onMainPdfUpload"
                        hidden
                      />
                  
                    </CFormLabel>
  
                    <CFormFeedback
                      :class="{ haveError: summaryFilesError }"
                      v-if="summaryFilesError"
                      >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                    ><br />
                  </CCol>
                  <CCol class="mt-4 text-center" :lg="4">
                    <CFormLabel for="from_page">  ملف صوتى </CFormLabel>
                 <br>
                 <p class="uploaded-files text-primary">
                {{audio_url}}
                </p>
                <CFormLabel for="from_page">  حجم الملف </CFormLabel>
                <br>
                <input
                    
                type="text"
                class="p-2"
                :class="{
                  onError: FromPageError,
                  'form-control': !FromPageError,
                }"
                v-model="this.audio_duration"
              />
              <br>
                    <CFormLabel
                     
                      style="
                        border: 1px solid #3c6264;
                        background: #3c6264;
                        margin: auto;
                        border-radius: 5px;
                        width: 100%;
                        height: 40px;
                        color: #ececec;
                        text-align: center;
                        padding-top:5px;
                        margin-top:10px
                      "
                    >
                      <span
                        class=" "
                        style="font-size:11px"
                      >
                        {{ 'انقر هنا لتحميل  الملف الصوتى' }}
                        <CIcon
                          size="lg"
                          icon="cil-cloud-upload"
                          class="mx-2"
                          style="vertical-align: middle"
                        />
                      </span>
                      <CFormInput
                        type="file"
                        size="lg"
                        accept="audio/*"
                        
                        @change="onMainAudioUpload"
                       hidden
                      />
                   
                    </CFormLabel>
  
                    <CFormFeedback
                      :class="{ haveError: summaryFilesError }"
                      v-if="summaryFilesError"
                      >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                    ><br />
                  </CCol>
                </CRow>
              

               

         

                <br /><br />
              </CForm>
            </CCardBody>
          </CModalBody>

          <CModalFooter>
            <CButton color="primary" @click="updateSummary">تعديل</CButton>
          </CModalFooter>
        </CModal>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { CButton } from '@coreui/vue'
import axios from 'axios'
import env from '../../env'
import { setTransitionHooks } from 'vue'

const baseUrl = env.baseUrl

const token = localStorage.token
const config = {
  headers: { Authorization: `Bearer ${token}` },
}

sessionStorage.setItem('currentSummaryId', 1)

export default {
  name: 'Summaries',
  data() {
    return {
      ch_cover:false,
      ch_audio:false,
      ch_file:false,
      coverName:'',
      audio_url:'',
      audio_name:'',
      audio_duration:'',
      page_count:'',
      content_url:'',
      file_name:'',
      summaryFiles: [],
      summaryFileList: [],
      summaryFilesName: [],
      summaryFilesError: false,
      header: [
        'الرقم التعريفي',
        ' اسم الكتاب',
        'المؤلف ',
        'من الصفحة ',
        ' إلي الصفحة',
        'صورة الغلاف',
        'الحالة',
        'الصفحة التعريفية',
        'تحميل الملفات',
        'إدارة الملخص',
      ],
      editSpinner: false,
      addSpinner: false,
      listSpinner: false,
      visibleEditModel: false,
      visibleAddModel: false,
      summaries: [],
      categories:[],
      bookName: '',
      bookId: '',
      author: '',
      fromPage: '',
      toPage: '',
      coverImage: '',
      userName: '',
      userEmail: '',
      userPhone: '',
      statusId: null,
      currentSummaryId: null,
      FromPageError: '',
      ToPageError: '',
      isLoading: false,
      currentPage: 1,
      lastPage: null,
      cdkcurrentPage: 1,
      cdklastPage: 50,
      savedPages: [],
      savedPagesIds: [],
      cdkType: 'edit',
      defaultImage:
        'https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png',
      /////add model/////
      currentAddSummaryId: 0,
      copiedTextManage: '',
      copiedHTML: '',
      copiedTextManageError: '',
      cdkcurrentManagePage: 1,
      cdklastManagePage: 50,
      pageNum: 0,
      pagesContent: [],
    }
  },
  methods: {
  

 

    invokeEditModal(
      id,
     title,
      author,
      bookId,
      coverImage,
      audio_url,
      audio_duration,
      content_url,
      page_count,
      audio,
content,
cover
    ) {
      axios.get(`${baseUrl}/brief-category/all`, config).then((response) => {
            this.isLoading = false
            this.categories = response.data.data   
            }).catch((error)=> {
                this.isLoading = false
                this.$swal({
                    title: 'عذرا, هناك خطأ',
                    text: error.errors[0],
                    icon: 'error',
                    confirmButtonColor:'#eb2b2b'
               })
            }); 
      ;
        (this.currentSummaryId = id)
      this.bookName = title
      this.author = author
      this.bookId= bookId
 this.audio_url= audio_url
      this.coverImage = coverImage
    this.audio_duration=audio_duration
     this.content_url= content_url
     this.page_count= page_count
     this.audio_name=audio
     this.file_name=content
     this.coverName=cover
     this.visibleEditModel=true
     
    },

 
    updateSummary() {
      let requestBody = new FormData()
      requestBody.append('summary_id', this.currentSummaryId)
      requestBody.append('category_id', this.bookId)
      requestBody.append('writer_name', this.author)
      if(this.ch_cover){
        requestBody.append('cover', this.coverName)
      }
      if(this.ch_audio){
        requestBody.append('audio', this.audio_name)
      }
      if(this.ch_file){
        requestBody.append('content', this.file_name)
      }
      
      requestBody.append('page_count', this.page_count)
     
      requestBody.append('duration', this.audio_duration)
        requestBody.append('title', this.bookName)
   
      this.isLoading = true
      axios
        .post(`${baseUrl}/admin/brief/edit`, requestBody, config)
        .then((response) => {
          this.isLoading = false
          if (response.data.status == false) {
            this.$swal({
              title: 'عذرا, هناك خطأ',
              text: response.data.errors[0],
              icon: 'error',
            })
          } else {
            this.$swal({
              title: 'تم التعديل بنجاح',
              icon: 'success',
            })
          this.ch_audio=false
          this.ch_file=false
          this.ch_cover=false
          this.isLoading = true
    sessionStorage.setItem('summaryCurrentPage', this.currentPage)
    axios
      .get(
        `${baseUrl}/admin/brief/all?page=` +
          sessionStorage.getItem('summaryCurrentPage'),
        config,
      )
      .then((response) => {
        this.isLoading = false
        this.summaries = response.data.data.data
        this.currentPage = response.data.data.current_page
        this.lastPage = response.data.data.last_page
        console.log('summaries', this.summaries)
      })
      .catch((error) => {
        this.isLoading = false
      })
          }
        })
        .catch((error) => {
          this.isLoading = false
          this.$swal({
            title: 'عذرا, هناك خطأ',
            text: error.errors[0],
            icon: 'error',
          })
        })
    },

  

  

 
    downloadSummaries(file) {
      
       
          window.open(file,'_blank')
        
      
    },

    onMainImageUpload(event) {
      console.log('files', event.target.files[0])
      let requestBody = new FormData()
      requestBody.append('files[0]', event.target.files[0])
      this.isLoading = true
      axios
        .post(`${baseUrl}/upload/files`, requestBody)
        .then((response) => {
          this.ch_cover=true
          this.isLoading = false
this.coverName=response.data.data[0]
          this.coverImage= 'https://backend.fateen.info/public/'+response.data.data[0]
          console.log('files', this.coverImage)
        })
        .catch((error) => {
          // console.log(error)
        })

    },
    onMainAudioUpload(event) {
      console.log('files', event.target.files[0])
      let requestBody = new FormData()
      requestBody.append('files[0]', event.target.files[0])
      this.isLoading = true
      axios
        .post(`${baseUrl}/upload/files`, requestBody)
        .then((response) => {
          this.isLoading = false
          this.ch_audio=true
this.audio_name=response.data.data[0]
          this.audio_url= 'https://backend.fateen.info/public/'+response.data.data[0]
          console.log('files', this.coverImage)
        })
        .catch((error) => {
          // console.log(error)
        })

    },
    onMainPdfUpload(event) {
      console.log('files', event.target.files[0])
      let requestBody = new FormData()
      requestBody.append('files[0]', event.target.files[0])
      this.isLoading = true
      axios
        .post(`${baseUrl}/upload/files`, requestBody)
        .then((response) => {
          this.isLoading = false
this.file_name=response.data.data[0]
this.ch_file=true
          this.content_url= 'https://backend.fateen.info/public/'+response.data.data[0]
          console.log('files', this.coverImage)
        })
        .catch((error) => {
          // console.log(error)
        })

    },
  },

  mounted() {
    this.isLoading = true
    sessionStorage.setItem('summaryCurrentPage', this.currentPage)
    axios
      .get(
        `${baseUrl}/admin/brief/all?page=` +
          sessionStorage.getItem('summaryCurrentPage'),
        config,
      )
      .then((response) => {
        this.isLoading = false
        this.summaries = response.data.data.data
        this.currentPage = response.data.data.current_page
        this.lastPage = response.data.data.last_page
        console.log('summaries', this.summaries)
      })
      .catch((error) => {
        this.isLoading = false
      })
  },
  components: { CButton },
}
</script>

<style lang="scss" scoped>
button{
margin-right: 5px;
}
.paginated-style {
  cursor: pointer;
}
.icard-header {
  padding: var(--cui-card-cap-padding-y) var(--cui-card-cap-padding-x);
  margin-bottom: 0;
  color: var(--cui-card-cap-color);
  background-color: var(--cui-card-cap-bg);
  border-bottom: var(--cui-card-border-width) solid var(--cui-card-border-color);
}
.icard-header::before,
.icard-header::after {
  box-sizing: content-box;
}

th:nth-of-type(2) {
  min-width: 260px !important;
}

th:nth-of-type(8),
th:nth-of-type(10) {
  min-width: 190px !important;
}

.cdk-paginator ul.pagination button {
  height: 45px !important;
  margin-top: 8px;
}

.uploaded-files {
  span:not(:last-child) {
    &::after {
      content: '/';
      margin-left: 5px;
      margin-right: 5px;
    }
  }
}
</style>
