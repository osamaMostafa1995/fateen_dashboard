<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>جدول قسم الوعي</strong>

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
              <CTableHeaderCell scope="col">صورة الغلاف</CTableHeaderCell>
              <CTableHeaderCell scope="col">العنوان</CTableHeaderCell>
              <CTableHeaderCell scope="col">اسم القسم</CTableHeaderCell>
              <CTableHeaderCell scope="col">صورة الكاتب</CTableHeaderCell>
              <CTableHeaderCell scope="col">اسم الكاتب</CTableHeaderCell>
              <CTableHeaderCell scope="col">الحالة</CTableHeaderCell>
              <CTableHeaderCell scope="col">الصفحة التعريفية</CTableHeaderCell>
              <CTableHeaderCell scope="col">عدد الإعجابات</CTableHeaderCell>
              <CTableHeaderCell scope="col">إخفاء الإعجابات</CTableHeaderCell>
              <CTableHeaderCell scope="col">إدارة الملخص</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            <CTableRow v-for="blog in blogs" :key="blog">
              <CTableHeaderCell scope="row">{{ blog.id }} </CTableHeaderCell>

              <CTableDataCell v-if="blog?.cover_image_path">
                <CImage
                  rounded
                  thumbnail
                  :src="blog?.cover_image_path"
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

              <CTableDataCell> {{ blog?.title }}</CTableDataCell>

              <CTableDataCell> {{ blog?.category?.name }}</CTableDataCell>

              <CTableDataCell v-if="blog?.writter_image_path">
                <CImage
                  rounded
                  thumbnail
                  :src="blog?.writter_image_path"
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

              <CTableDataCell>{{ blog?.written_by }}</CTableDataCell>

              <CTableDataCell v-if="blog.status_id == 0"> معلق </CTableDataCell>
              <CTableDataCell v-if="blog.status_id == 1">
                مقبول
              </CTableDataCell>
              <CTableDataCell v-if="blog.status_id == 2">
                مرفوض
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  variant="outline"
                  @click="() => toggleWeb(blog)"
                >
                  {{ !blog?.is_shown_in_landing ? 'اظهار' : 'اخفاء' }}
                </CButton>
              </CTableDataCell>
              <CTableDataCell>{{ blog?.likes_count }}</CTableDataCell>

              <CTableDataCell v-if="blog.hide_likes_count == 0">
                إظهار
              </CTableDataCell>
              <CTableDataCell v-else="blog.hide_likes_count == 1"
                >إخفاء
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="warning"
                  variant="outline"
                  @click="
                    () =>
                      invokeEditModal(
                        blog.id,
                        blog?.category_id,
                        blog?.type,
                        blog?.title,
                        blog?.content,
                        blog?.original_content,
                        blog?.references,
                        blog?.cover_image_path,
                        blog?.hide_likes_count,
                        blog?.status_id,
                        blog?.formatted_content,
                        blog?.blog_images,
                      )
                  "
                >
                  <CIcon icon="cil-pencil" size="lg" />
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
                v-for="column in [].constructor(11)"
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
            <CModalTitle>إدارة قسم الوعي</CModalTitle>
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
                <CCol :md="12" v-show="bolgType == 1">
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
                  <strong><label class="mb-1">العنوان </label></strong> :
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

                <CCol :md="12" v-show="bolgType == 1">
                  <strong><label class="mb-1">المرجع </label></strong> :
                  <input
                    id="blogReferences"
                    type="text"
                    class="p-2"
                    :class="{
                      onError: referenceError,
                      'form-control': !referenceError,
                    }"
                    v-model="blogReferences"
                  />
                  <CFormFeedback
                    :class="{ haveError: referenceError }"
                    v-if="referenceError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>

                <CCol :md="12">
                  <strong><span> اسم القسم</span></strong> :
                  <br />
                  <CFormLabel for="categoryId">اختيار اسم القسم</CFormLabel>
                  <CFormSelect
                    v-model="categoryId"
                    id="categoryId"
                    class="p-2"
                    :class="{
                      onError: categoryError,
                      'form-control': !categoryError,
                    }"
                  >
                    <option
                      v-for="category in categories"
                      :value="category.id"
                      :key="category"
                    >
                      {{ category.name_ar }}
                    </option>
                  </CFormSelect>
                  <CFormFeedback
                    :class="{ haveError: categoryError }"
                    v-if="categoryError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>

                <CCol :md="12">
                  <strong><span>نوع المقال</span></strong> :
                  <br />
                  <CFormLabel for="btype">اختيار نوع المقال</CFormLabel>
                  <CFormSelect
                    v-model="bolgType"
                    id="btype"
                    class="p-2"
                    :class="{ onError: typeError, 'form-control': !typeError }"
                  >
                    <option
                      v-for="btype in types"
                      :value="btype.id"
                      :key="btype"
                    >
                      {{ btype.name_ar }}
                    </option>
                  </CFormSelect>
                  <CFormFeedback
                    :class="{ haveError: typeError }"
                    v-if="typeError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>

                <CCol :md="12">
                  <strong><span> الحالة</span></strong> :
                  <br />
                  <CFormLabel for="inputState">اختيار الحالة</CFormLabel>
                  <CFormSelect
                    v-model="blogStatusId"
                    id="inputState"
                    :class="{
                      onError: statusError,
                      'form-control': !statusError,
                    }"
                  >
                    <option value="1">قبول</option>
                    <option value="2">رفض</option>
                  </CFormSelect>
                  <CFormFeedback
                    :class="{ haveError: statusError }"
                    v-if="statusError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>

                <CCol :md="12">
                  <strong><span> إخفاء الإعجابات</span></strong> :
                  <br />
                  <CFormLabel for="blogHideLikesCount"
                    >اختيار حالة إخفاء عدد الإعجابات</CFormLabel
                  >
                  <CFormSelect
                    v-model="blogHideLikesCount"
                    id="blogHideLikesCount"
                    :class="{
                      onError: likesCountError,
                      'form-control': !likesCountError,
                    }"
                  >
                    <option value="0">إخفاء</option>
                    <option value="1">إظهار</option>
                  </CFormSelect>
                  <CFormFeedback
                    :class="{ haveError: likesCountError }"
                    v-if="likesCountError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>

                <CCol :md="12">
                  <strong><span> نوع المحتوي </span></strong> :
                  <br />
                  <CFormLabel for="original">اختيار نوع المحتوي </CFormLabel>
                  <CFormSelect
                    v-model="blogOriginalContent"
                    id="original"
                    class="p-2"
                    :class="{
                      onError: originalContentError,
                      'form-control': !originalContentError,
                    }"
                  >
                    <option
                      v-for="original in originals"
                      :value="original.id"
                      :key="original"
                    >
                      {{ original.name_ar }}
                    </option>
                  </CFormSelect>
                  <CFormFeedback
                    :class="{ haveError: originalContentError }"
                    v-if="originalContentError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>

                <CCol :md="12">
                  <strong><label class="mb-1">المحتوي </label></strong> :
                  <textarea
                    id="blogContent"
                    type="text"
                    class="p-2"
                    :class="{
                      onError: contentError,
                      'form-control': !contentError,
                    }"
                    v-model="blogContent"
                  ></textarea>
                  <CFormFeedback
                    :class="{ haveError: contentError }"
                    v-if="contentError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>

                <CCol :md="12" class="cdk-editor my-5">
                  <QuillEditor
                    v-model:content="copiedText"
                    theme="snow"
                    contentType="html"
                    id="editor"
                    :toolbar="[
                      'bold',
                      'italic',
                      'underline',
                      { list: 'ordered' },
                      { list: 'bullet' },
                      { direction: 'rtl' },
                      { header: [1, 2, 3, 4, 5, 6, false] },
                      { color: [] },
                      { background: [] },
                      { font: [] },
                      { align: [] },
                    ]"
                  />
                  <CFormFeedback
                    :class="{ haveError: copiedTextError }"
                    v-if="copiedTextError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>
                <br /><br />

                <CCol :md="12" v-show="bolgType == 2">
                  <p>تحميل صور قسم الوعي</p>
                  <div>
                    <div class="dropzone dz-clickable">
                      <span
                        v-for="(blogImage, index) in blogOtherImageShowPath"
                        :key="blogImage"
                      >
                        <div
                          class="close"
                          @click="deleteOtherImages(index)"
                          v-show="
                            blogOtherImageShowPath[0] != this.defaultImage
                          "
                        >
                          <span>x</span>
                        </div>
                        <img
                          v-if="blogOtherImageShowPath.length == 0"
                          :src="this.defaultImage"
                          :key="this.defaultImage"
                          class="cover"
                        />
                        <img
                          v-else="blogOtherImageShowPath.length != 0"
                          :src="
                            'https://backend.fateen.info/public/' + blogImage
                          "
                          :key="blogImage"
                          class="cover"
                        />
                        <!-- <img :src="blogImage"  class="cover"/>  -->
                      </span>
                      <div class="dz-message needsclick ng-star-inserted">
                        <span class="note needsclick">
                          (يمكن تحديد صور تحتوي علي الامتدادات
                          <strong>TIFF</strong> ,<strong _ngcontent-vma-c163=""
                            >JPG</strong
                          >
                          , <strong>GIF</strong> ,
                          <strong _ngcontent-vma-c163="">PNG</strong> )
                        </span>
                      </div>
                      <br />

                      <CFormLabel class="dp-label" for="otherfile">
                        <span class="px-2 mt-2">
                          <CSpinner
                            class="dp-spinner"
                            component="span"
                            size="sm"
                            aria-hidden="true"
                            v-show="isLoading"
                          />
                          انقر هنا لتحميل صور قسم الوعي
                          <CIcon
                            class="dp-icon mx-2"
                            size="lg"
                            icon="cil-cloud-upload"
                          />
                        </span>
                        <CFormInput
                          class="dp-input"
                          type="file"
                          size="lg"
                          id="otherfile"
                          @change="otherBlogImagesUpload"
                          style="visibility: hidden"
                        />
                      </CFormLabel>
                      <!-- <p class="mt-2 uploaded-files">
                                    <span v-for="name in blogOtherImageName" :key="name"> {{name}}</span>
                                </p> -->
                    </div>
                  </div>
                  <CFormFeedback
                    :class="{ haveError: blogOtherImagePathError }"
                    v-if="blogOtherImagePathError"
                    >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
                  ><br />
                </CCol>
              </CForm>
            </CCardBody>
          </CModalBody>

          <CModalFooter>
            <CButton color="primary" @click="updateBlog">تعديل</CButton>
          </CModalFooter>
        </CModal>

        <CPagination class="cdk-paginator">
          <div class="d-flex my-2">
            <div class="mx-1 my-2" v-if="currentPage == 1">
              <CPaginationItem disabled>السابقة</CPaginationItem>
            </div>

            <div class="mx-1 my-2" v-else>
              <CPaginationItem
                class="paginated-style"
                @click="handleListPagePagination(currentPage--)"
                >السابقة</CPaginationItem
              >
            </div>

            <div class="mx-1 my-2" v-if="currentPage == lastPage">
              <CPaginationItem disabled>التالية</CPaginationItem>
            </div>
            <div class="mx-1 my-2" v-else>
              <CPaginationItem
                class="paginated-style"
                @click="handleListPagePagination(currentPage++)"
                >التالية</CPaginationItem
              >
            </div>
          </div>

          <!-- <div class="my-2 mx-4 pt-2"> رقم الصفحة {{currentPage}}</div> -->

          <div class="my-2 mx-4 pt-2">
            <span v-if="listSpinner">
              جاري التحميل
              <CSpinner class="spinner" />
            </span>

            <span v-else="!listSpinner"> رقم الصفحة {{ currentPage }} </span>
          </div>
        </CPagination>
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
        ' صورة الغلاف ',
        'العنوان ',
        'اسم القسم ',
        'صورة الكاتب ',
        'اسم الكاتب',
        'الحالة',
        'الصفحة التعريفية',
        'عدد الإعجابات',
        'إخفاء الإعجابات',
        'إدارة الملخص',
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
    toggleWeb(book) {
      this.isLoading = true
      this.listSpinner = true
      axios
      let requestBody = new FormData()

      requestBody.append('blog_id', book.id)
      axios
        .post(`${baseUrl}/admin/landing/blog/toggle`, requestBody, config)
        .then((response) => {
          this.listSpinner = false
          this.isLoading = false
          book.is_shown_in_landing = !book.is_shown_in_landing
          this.$swal({
            title: 'نجاح',
            text: response.data.message,
            icon: 'success',
          })
        })
        .catch((error) => {
          this.isLoading = false
        })
    },
    handleListPagePagination(currentPage) {
      sessionStorage.setItem('awarenessCurrentPage', this.currentPage)
      this.allBlogs(this.currentPage)
    },

    invokeEditModal(
      id,
      categoryId,
      bolgType,
      blogTitle,
      blogContent,
      blogOriginalContent,
      blogReferences,
      blogCoverImagePath,
      blogHideLikesCount,
      blogStatusId,
      formattedContent,
      otherBlogImgs,
    ) {
      this.currentBolgId = id
      this.categoryId = categoryId
      this.bolgType = bolgType
      this.blogTitle = blogTitle
      this.blogContent = blogContent
      this.blogOriginalContent = blogOriginalContent
      this.blogReferences = blogReferences
      this.blogCoverImagePath = blogCoverImagePath
      // this.blogOtherImageShowPath = otherBlogImgs
      this.blogHideLikesCount = blogHideLikesCount
      this.blogStatusId = blogStatusId
      this.copiedText = formattedContent
      this.visibleEditModel = true

      if (otherBlogImgs && otherBlogImgs.length != 0) {
        this.blogOtherImageShowPath = []
        console.log('otherBlogImgs', otherBlogImgs)
        for (let i = 0; i < otherBlogImgs.length; i++) {
          this.blogOtherImageShowPath.push(otherBlogImgs[i]?.image)
        }
      }
    },

    updateBlog() {
      this.copiedText =
        document.getElementsByClassName('ql-editor')[0].innerHTML
      let requestBody = new FormData()
      requestBody.append('blog_id', this.currentBolgId)
      requestBody.append('category_id', this.categoryId)
      requestBody.append('blog_type', this.bolgType)
      requestBody.append('title', this.blogTitle)
      requestBody.append('content', this.blogContent)
      requestBody.append('formatted_content', this.copiedText)
      requestBody.append('original_content', this.blogOriginalContent)
      requestBody.append('references', this.blogReferences)
      requestBody.append('hide_likes_count', this.blogHideLikesCount)
      requestBody.append('status_id', this.blogStatusId)

      if (this.blogCoverImagePath != placeholder && this.bolgType == 1) {
        requestBody.append('cover_image', this.blogCoverImagePath)
      }

      if (this.bolgType != 1) {
        if (this.blogOtherImagePath.length != 0) {
          for (let i = 0; i < this.blogOtherImageShowPath.length; i++) {
            requestBody.append(
              'blog_images[' + i + ']',
              this.blogOtherImageShowPath[i],
            )
          }
        } else {
        }
      }

      this.isLoading = true

      axios
        .post(`${baseUrl}/admin/blog/update`, requestBody, config)
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

            this.savedPages = []
            this.savedPagesIds = []
            this.blogOtherImagePath = []
            this.blogOtherImageShowPath = []
            this.allBlogs(sessionStorage.getItem('awarenessCurrentPage'))
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

    allBlogs(page) {
      this.isLoading = true
      this.listSpinner = true
      axios
        .get(`${baseUrl}/admin/blog/all?page=` + page, config)
        .then((response) => {
          this.isLoading = false
          this.listSpinner = false
          this.blogs = response.data.data.data
          this.currentPage = response.data.data.current_page
          this.lastPage = response.data.data.last_page
          console.log('bb', this.blogs)
        })
        .catch((error) => {
          this.isLoading = false
          // console.log(error)
        })
    },

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
          this.blogCoverImagePath =
            'https://backend.fateen.info/public/' + response.data.data[0]
          console.log('files', this.blogCoverImagePath)
        })
        .catch((error) => {
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

    otherBlogImagesUpload(event) {
      this.blogOtherImagePath = []
      this.blogOtherImagePath.push(...event.target.files)
      this.blogOtherImageName.push(event.target.files[0]?.name)
      let requestBody = new FormData()
      if (this.blogOtherImagePath.length != 0) {
        for (let i = 0; i < this.blogOtherImagePath.length; i++) {
          requestBody.append('files[' + i + ']', this.blogOtherImagePath[i])
        }
      }
      this.isLoading = true
      axios
        .post(`${baseUrl}/upload/files`, requestBody)
        .then((response) => {
          this.isLoading = false
          for (let y = 0; y < response.data.data.length; y++) {
            this.blogOtherImageShowPath.push(response.data.data[y])
          }
          // console.log("other files",  this.blogOtherImageShowPath)
        })
        .catch((error) => {
          // console.log(error)
        })
    },

    deleteOtherImages(index) {
      console.log('index', index)
      this.blogOtherImageShowPath.splice(index, 1)
      this.blogOtherImagePath.splice(index, 1)
      //  console.log( "blogOtherImageShowPath",this.blogOtherImageShowPath)
      //  console.log("blogOtherImagePath",this.blogOtherImagePath)
    },
  },

  mounted() {
    this.defaultImage = placeholder
    this.blogCoverImagePath = placeholder
    // this.blogOtherImageShowPath[0]=placeholder ;

    this.types = [
      { id: 1, name_ar: 'مقالات الإثرائيات' },
      { id: 2, name_ar: 'مقالات تبادل الرأي' },
    ]

    this.originals = [
      { id: 0, name_ar: ' غير أصلي ' },
      { id: 1, name_ar: 'أصلي ' },
    ]

    this.isLoading = true
    sessionStorage.setItem('awarenessCurrentPage', this.currentPage)
    axios
      .get(
        `${baseUrl}/admin/blog/all?page=` +
          sessionStorage.getItem('awarenessCurrentPage'),
        config,
      )
      .then((response) => {
        console.log('blogs', response.data.data.data)
        this.isLoading = false
        this.blogs = response.data.data.data
        this.currentPage = response.data.data.current_page
        this.lastPage = response.data.data.last_page
      })
      .catch((error) => {
        this.isLoading = false
      })

    axios
      .get(`${baseUrl}/category/all`, config)
      .then((response) => {
        this.categories = response.data.data
      })
      .catch((error) => {})
  },
}
</script>

<style lang="scss" scoped>
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
