<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong> اللافتات الرئيسية</strong>

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
              <CTableHeaderCell scope="col">صورة </CTableHeaderCell>
              <CTableHeaderCell scope="col">الرابط</CTableHeaderCell>
              <CTableHeaderCell scope="col">الاسم </CTableHeaderCell>
              <CTableHeaderCell scope="col">إدارة اللافتة</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            <CTableRow v-for="blog in blogs" :key="blog">
              <CTableHeaderCell scope="row">{{ blog.id }} </CTableHeaderCell>

              <CTableDataCell v-if="blog?.image_url">
                <CImage
                  rounded
                  thumbnail
                  :src="blog?.image_url"
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

              <CTableDataCell><span class='open' @click="open(blog?.image_url)">رابط اللافتة</span> </CTableDataCell>

              <CTableDataCell> {{ blog?.name }}</CTableDataCell>

              <CTableDataCell>
                <CButton
                  color="warning"
                  variant="outline"
                  @click="
                    () =>
                      invokeEditModal(
                        blog.id,
                        blog?.url,
                        blog?.name,
                        blog?.logo_url,
                        blog?.logo,
                      )
                  "
                >
                  <CIcon icon="cil-pencil" size="lg" />
                </CButton>
                &nbsp;

                <CButton
                  color="danger"
                  @click="deleteCity(blog?.id)"
                  variant="outline"
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
            <CTableRow class="text-center" v-for="row in [].constructor(5)">
              <CTableHeaderCell scope="col" v-for="column in [].constructor(5)">
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
            <CModalTitle>إدارة  اللافتات الرئيسية</CModalTitle>
          </CModalHeader>

          <!-- <CButton disabled v-show="isLoading">
                  <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                  جاري التحميل ...
              </CButton> -->

          <CModalBody>
            <CCardBody>
              <CForm class="row g-3">
                <!-- <CCol :md="12">
                              <CTableDataCell>
                                  <CImage rounded thumbnail :src="this.blogCoverImagePath" width="100" height="100"/>
                              </CTableDataCell>
                          </CCol> -->
                <CCol :md="12">
                  <p>تحميل الصورة الرئيسية</p>
                  <div>
                    <div class="dropzone dz-clickable">
                      <img
                        v-if="blogCoverImagePath"
                        :src="
                          blogCoverImagePath == this.defaultImage
                            ? this.defaultImage
                            : blogCoverImagePath
                        "
                        :key="this.defaultImage"
                        class="cover"
                      />
                      <div class="dz-message needsclick ng-star-inserted">
                        <span class="note needsclick">
                          (يمكن تحديد صورة تحتوي علي الامتدادات
                          <strong>TIFF</strong> ,<strong _ngcontent-vma-c163=""
                            >JPG</strong
                          >
                          , <strong>GIF</strong> ,
                          <strong _ngcontent-vma-c163="">PNG</strong> )
                        </span>
                      </div>
                      <br />

                      <CFormLabel class="dp-label" for="mainfile">
                        <span>
                          <CSpinner
                            class="dp-spinner"
                            component="span"
                            size="sm"
                            aria-hidden="true"
                            v-show="isLoading"
                          />
                          انقر هنا لتحميل الصورة الرئيسية
                          <CIcon
                            class="mx-2 dp-icon"
                            size="lg"
                            icon="cil-cloud-upload"
                          />
                        </span>
                        <CFormInput
                          class="dp-input"
                          type="file"
                          size="lg"
                          id="mainfile"
                          @change="onMainImageUpload"
                          style="visibility: hidden"
                        />
                      </CFormLabel>
                      <p class="mt-2">{{ blogCoverImageName }}</p>
                    </div>
                  </div>
                  <CFormFeedback
                    :class="{ haveError: blogCoverImagePathError }"
                    v-if="blogCoverImagePathError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>

                <CCol :md="12">
                  <strong><label class="mb-1">الاسم </label></strong> :
                  <input
                    id="blogTitle"
                    type="text"
                    class="p-2"
                    :class="{
                      onError: titleError,
                      'form-control': !titleError,
                    }"
                    v-model="blogTitle"
                  />
                  <CFormFeedback
                    :class="{ haveError: titleError }"
                    v-if="titleError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  >
                  <br />
                </CCol>
                <CCol :md="12">
                  <strong><label class="mb-1">الرابط </label></strong> :
                  <input
                    id="blogContent"
                    type="text"
                    class="p-2"
                    :class="{
                      onError: contentError,
                      'form-control': !contentError,
                    }"
                    v-model="blogContent"
                  />
                  <CFormFeedback
                    :class="{ haveError: titleError }"
                    v-if="titleError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  >
                  <br />
                </CCol>
              </CForm>
            </CCardBody>
          </CModalBody>

          <CModalFooter>
            <CButton color="primary" @click="updateBlog">تعديل</CButton>
          </CModalFooter>
        </CModal>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import axios from 'axios'
import env from '../../env'
import placeholder from '../../assets/images/placeholder.png'
const baseUrl = env.baseUrl

const token = localStorage.token
const config = {
  headers: { Authorization: `Bearer ${token}` },
}

sessionStorage.setItem('currentBolgId', 1)

export default {
  name: 'Blogs',
  data() {
    return {
      header: [
        'الرقم التعريفي',
        ' صورة  ',
        'الرابط ',
        'الاسم  ',
        'إدارة الوسيلة',
      ],
      listSpinner: false,
      currentBolgId: null,
      visibleEditModel: false,
      visibleAddModel: false,
      blogs: [],
      types: [],
      categories: [],
      originals: [],

      categoryId: '',
      bolgType: '',
      blogTitle: '',
      blogContent: '',
      blogOriginalContent: '',
      blogReferences: '',
      blogCoverImagePath: ' ',
      blogHideLikesCount: '',
      blogStatusId: null,
      copiedText: '',

      blogOtherImagePath: [],
      blogOtherImageName: [],
      blogOtherImageShowPath: [],
      blogOtherImagePathError: '',
      filePath: '',
      typeError: '',
      categoryError: '',
      titleError: '',
      contentError: '',
      originalContentError: '',
      referenceError: '',
      statusError: '',
      likesCountError: '',
      copiedTextError: '',

      isLoading: false,
      currentPage: 1,
      lastPage: null,

      defaultImage: '',
      ///////////old /////////

      FromPageError: '',
      ToPageError: '',
      cdkcurrentPage: 1,
      cdklastPage: 50,
      savedPages: [],
      savedPagesIds: [],
      cdkType: 'edit',

      /////add model/////

      currentAddBlogId: 0,
      copiedTextManage:
        '<p><bold>this is a book summary with bold text</bold></p>',
      copiedHTML: '',
      copiedTextManageError: '',

      cdkcurrentManagePage: 1,
      cdklastManagePage: 50,

      pageNum: 0,
      pagesContent: [],
    }
  },

  methods: {
  open(url){
 window.open(url, '_blank')
  },
    handleListPagePagination() {
      this.allBlogs()
    },

    invokeEditModal(id, url, title, image , logo) {
      this.currentBolgId = id
      this.blogTitle = title
      this.blogContent = url

      this.blogCoverImagePath = image
      this.logoPath = logo
      this.visibleEditModel = true
    },

    updateBlog() {
      let requestBody = new FormData()
      // this.currentBolgId = id
      // this.blogTitle = title
      // this.blogContent = url
      requestBody.append('platform_id', this.currentBolgId)
      // requestBody.append('category_id', this.categoryId)
      // requestBody.append('blog_type', this.bolgType)
      requestBody.append('platform_name', this.blogTitle)
      requestBody.append('platform_url', this.blogContent)
      // requestBody.append('formatted_content', this.copiedText)
      // requestBody.append('original_content', this.blogOriginalContent)
      // requestBody.append('references', this.blogReferences)
      // requestBody.append('hide_likes_count', this.blogHideLikesCount)
      // requestBody.append('status_id', this.blogStatusId)

      if (this.blogCoverImagePath != placeholder) {
        requestBody.append('platform_logo', this.logoPath)
      }

      this.isLoading = true

      axios
        .post(`${baseUrl}/admin/social-platform/edit`, requestBody, config)
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
            this.blogs = response.data.data
            this.savedPages = []
            this.savedPagesIds = []
            this.blogOtherImagePath = []
            this.blogOtherImageShowPath = []
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

    // allBlogs() {
    //   this.isLoading = true
    //   this.listSpinner = true
    //   axios
    //     .get(`${baseUrl}/admin/social-platform/all`, config)
    //     .then(() => {
    //       // this.isLoading = false
    //       // this.listSpinner=false
    //       // this.blogs = response.data.data.data
    //       // this.currentPage = response.data.data.current_page
    //       // this.lastPage = response.data.data.last_page
    //       console.log('bb', this.blogs)
    //     })
    //     .catch(() => {
    //       this.isLoading = false
    //       // console.log(error)
    //     })
    // },

    onMainImageUpload(event) {
      this.blogCoverImagePath = event.target.files[0]
      this.blogCoverImageName = event.target.files[0]?.name
      let requestBody = new FormData()
      requestBody.append('files[0]', event.target.files[0])
      this.isLoading = true
      axios
        .post(`${baseUrl}/upload/files`, requestBody)
        .then((response) => {
          this.isLoading = false
          this.logoPath = response.data.data[0]
          this.blogCoverImagePath =
            'https://backend.fateen.info/public/' + response.data.data[0]
          console.log('files', this.blogCoverImagePath)
        })
        .catch(() => {
          // console.log(error)
        })
    },
    // blogOtherImageShowPath
    // otherBlogImagesUpload(event) {
    //     // this.blogOtherImageShowPath = []
    //     this.blogOtherImagePath.push(...event.target.files)
    //     this.blogOtherImageName.push(event.target.files[0]?.name)
    //     let requestBody = new FormData();
    //     if (this.blogOtherImagePath.length != 0) {
    //         for (let i = 0; i < this.blogOtherImagePath.length; i++) {
    //         requestBody.append('files[' + i + ']', this.blogOtherImagePath[i]);
    //         }
    //     }
    //     this.isLoading = true
    //     axios.post(`${baseUrl}/upload/files`, requestBody).then((response) => {
    //     this.isLoading = false
    //         for (let y=0 ; y<response.data.data.length ; y++) {
    //             // this.blogOtherImageShowPath.push('https://backend.fateen.info/public/'+response.data.data[y])
    //             this.blogOtherImageShowPath.push(response.data.data[y])
    //         }
    //     console.log("other files",  this.blogOtherImageShowPath)
    //     }).catch((error)=> {
    //     // console.log(error)
    //     });
    // },

    deleteCity(id) {
      console.log('id', id)
      this.$swal({
        title: 'الحذف',
        text: 'هل تريد حذف الوسيلة ؟',
        type: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'حذف',
        cancelButtonText: 'إلغاء',
      }).then((isConfirm) => {
        if (isConfirm.value == true) {
          const params = new URLSearchParams()
          params.append('platforms_ids[0]', id)

          axios
            .delete(`${baseUrl}/admin/social-platform/remove`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              data: params,
            })
            .then((response) => {
              if (response.data.status == true) {
                this.$swal({
                  title: 'تم الحذف بنجاح',
                  icon: 'success',
                })
                this.blogs = response.data.data
              } else {
                this.$swal({
                  title: 'عذرا, هناك خطأ',
                  text: response.data.errors[0],
                  icon: 'error',
                })
              }
            })
            .catch((error) => {
              this.$swal({
                title: 'عذرا, هناك خطأ',
                text: error.errors[0],
                icon: 'error',
              })
            })
        }
      })
    },
  },

  mounted() {
    this.defaultImage = placeholder
    this.blogCoverImagePath = placeholder
    // this.blogOtherImageShowPath[0]=placeholder ;

    this.isLoading = true

    axios
      .get(`${baseUrl}/admin/brief-banner/all`, config)
      .then((response) => {
        console.log('blogs', response.data.data)
        this.isLoading = false
        this.blogs = response.data.data
        // this.currentPage = response.data.data.current_page
        // this.lastPage = response.data.data.last_page
      })
      .catch(() => {
        this.isLoading = false
      })

      // axios
      //   .get(`${baseUrl}/category/all`, config)
      //   .then((response) => {
      //     this.categories = response.data.data
      //   })
      .catch(() => {})
  },
}
</script>

<style lang="scss" scoped>
.open{
cursor:pointer}
th:nth-of-type(1),
th:nth-of-type(2) {
  min-width: 130px !important;
}

th:nth-of-type(3) {
  min-width: 280px !important;
}

th:nth-of-type(9) {
  min-width: 133px !important;
}

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
  background: #d0e2dc47;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-height: 150px;
  position: relative;

  .close {
    color: #3b6264;
    position: relative;
    bottom: 75px;
    right: 20px;
    height: 20px;
    width: 20px;
    display: inline-block;
    border: 1px solid #3b6264;
    border-radius: 50%;
    background: #fff;

    span {
      bottom: 5px;
      position: relative;
    }

    &:hover {
      color: #fff;
      background: #3b6264;
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
    &::after {
      content: '/';
      margin-left: 5px;
      margin-right: 5px;
    }
  }
}

.dp-label {
  border: 1px solid #85a3a5;
  margin: auto;
  border-radius: 5px;
  height: 55px;
  span {
    position: relative;
    top: 14px;
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
