<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>إضافة  وسيلة الأجتماعية </strong>
        </CCardHeader>

        <CCardBody>
          <CForm class="row g-3">
            <CCol :md="12" v-if="bolgType == 1">
              <p>تحميل الصورة الرئيسية</p>
              <div>
                <div class="dropzone dz-clickable">
                  <img
                    :src="
                      blogCoverImagePath === this.defaultImage
                        ? this.defaultImage
                        : 'https://backend.fateen.info/public/' +
                          blogCoverImagePath
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
                :class="{ onError: titleError, 'form-control': !titleError }"
                v-model="blogTitle"
              />
              <CFormFeedback
                :class="{ haveError: titleError }"
                v-if="titleError"
                >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
              ><br />
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
                :class="{ haveError: contentError }"
                v-if="contentError"
                >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
              ><br />
            </CCol>





          </CForm>
        </CCardBody>

        <div class="modal-footer">
          <CButton class="py-2 px-5 m-4" color="primary" @click="addBlog"
            >إضافة</CButton
          >
        </div>
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

//   sessionStorage.setItem("currentBolgId", 1);

export default {
  name: 'Create Blog',
  data() {
    return {
      types: [],
      categories: [],
      originals: [],
      categoryId: '',
      bolgType: 1,
      blogTitle: '',
      blogContent: '',
      blogOriginalContent: 0,
      blogReferences: '',
      blogCoverImagePath: '',
      blogCoverImageName: '',

      blogOtherImagePath: [],
      blogOtherImageName: [],
      blogOtherImageShowPath: [],
      blogOtherImagePathError: '',

      copiedText: '',
      blogCoverImagePathError: '',
      typeError: '',
      categoryError: '',
      titleError: '',
      contentError: '',
      originalContentError: '',
      referenceError: '',
      copiedTextError: '',
      isLoading: false,
      defaultImage: '',
    }
  },
  methods: {
    addBlog() {
      if (this.blogCoverImagePath == placeholder) {
        this.blogCoverImagePathError = true
      }
      if (this.blogCoverImagePath != placeholder) {
        this.blogCoverImagePathError = false
      }

      if (this.blogTitle == '') {
        this.titleError = true
      }
      if (this.blogTitle != '') {
        this.titleError = false
      }
      if (this.blogContent == '') {
        this.contentError = true
      }
      if (this.blogContent != '') {
        this.contentError = false
      }






      //this.isLoading = true
      let requestBody = new FormData()
      requestBody.append('platform_name', this.blogTitle)

      requestBody.append('platform_url', this.blogContent)







      if (this.blogCoverImagePath != placeholder ) {
        requestBody.append('platform_logo', this.blogCoverImagePath)
      }



      axios
        .post(`${baseUrl}/admin/social-platform/add`, requestBody, config)
        .then((response) => {
          if (response.data.status == false) {
            this.$swal({
              title: 'عذرا, هناك خطأ',
              text: response.data.errors[0],
              icon: 'error',
            })
          } else {
            this.$swal({
              title: 'تم الإضافة بنجاح',
              icon: 'success',
            })
            this.$router.push('/landing-page/home')

          }
        })
        .catch((error) => {
          // console.log(error);
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

          this.blogCoverImagePath = response.data.data[0]
          console.log('files', this.blogCoverImagePath)
        })
        .catch((error) => {
          // console.log(error)
        })
    },

    otherBlogImagesUpload(event) {
      this.blogOtherImageShowPath = []
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
          console.log('other files', this.blogOtherImageShowPath)
        })
        .catch((error) => {
          // console.log(error)
        })
    },


  },

  mounted() {
    this.defaultImage = placeholder
    this.blogCoverImagePath = placeholder
    this.blogOtherImageShowPath[0] = placeholder
    // "https://placehold.co/600x400" ,




  },
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
