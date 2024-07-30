<template>
  <CForm class="row g-3">
    <h5 class="fw-bold">أضافة بيانات الكتاب</h5>
    <CCol :md="12">
      <CFormLabel> أسم الكتاب</CFormLabel>
      <input
        type="text"
        class="p-2"
        :class="{
          onError: bookNameError,
          'form-control': !bookNameError,
        }"
        v-model="this.bookName"
      />
      <CFormFeedback :class="{ haveError: bookNameError }" v-if="bookNameError"
        >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
      ><br />
    </CCol>

    <CCol :md="12">
      <CFormLabel> أسم المؤلف</CFormLabel>
      <input
        type="text"
        class="p-2"
        :class="{
          onError: authorNameError,
          'form-control': !authorNameError,
        }"
        v-model="this.author"
      />
      <CFormFeedback :class="{ haveError: bookNameError }" v-if="bookNameError"
        >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
      ><br />
    </CCol>

    <CCol :md="12">
      <CFormLabel for="state">اختيار قسم الكتاب</CFormLabel>
      <div class="row">
        <div class="col-md-3 mb-2" v-for="item in categories">
          <p
            @click="catsArray(item)"
            class="catogry_card text-center"
            v-bind:class="{
              'text-danger': this.category_ids?.includes(item.id),
            }"
          >
            {{ item.name_en }}
          </p>
        </div>
      </div>
      <!-- <CFormLabel for="state">اختيار قسم الكتاب</CFormLabel>
      <CFormSelect v-model="this.bookId" id="state">
        <option :value="item.id" v-for="item in categories" :key="item" >
          {{ item.name_en }}
        </option>
      </CFormSelect> -->
    </CCol>
    <hr />
    <h5 class="fw-bold">ملفات الملخصات</h5>
    <CRow>
      <CCol class="mt-4 text-center" :lg="4">
        <CFormLabel for="from_page"> صورة الغلاف </CFormLabel>
        <br />
        <CImage
          v-if="coverImage != ''"
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
            margin-top: 10px;
            padding-top: 5px;
          "
        >
          <span v-if="!coverloading" class=" " style="font-size: 11px">
            {{ 'انقر هنا لتحميل  صورة الغلاف' }}
            <CIcon
              size="lg"
              icon="cil-cloud-upload"
              class="mx-2"
              style="vertical-align: middle"
            />
          </span>
          <span v-if="coverloading" class=" " style="font-size: 11px">
            يرجى الانتظار حتى يتم التحميل
          </span>
          <CFormInput
            type="file"
            size="lg"
            accept="image/*"
            @change="onMainImageUpload"
            hidden
          />
        </CFormLabel>

        <CFormFeedback :class="{ haveError: coverError }" v-if="coverError"
          >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
        ><br />
      </CCol>
      <CCol class="mt-4 text-center" :lg="4">
        <CFormLabel for="from_page"> ملف نصى </CFormLabel>
        <br />
        <span class="uploaded-files text-primary" v-if="content_url != ''">
          {{ content_url }}
        </span>

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
            padding-top: 5px;
            margin-top: 10px;
          "
        >
          <span v-if="!fileloading" class=" " style="font-size: 11px">
            {{ 'انقر هنا لتحميل   ملف نصى ' }}
            <CIcon
              size="lg"
              icon="cil-cloud-upload"
              class="mx-2"
              style="vertical-align: middle"
            />
          </span>
          <span v-if="fileloading" class=" " style="font-size: 11px">
            يرجى الانتظار حتى يتم التحميل
          </span>

          <CFormInput type="file" size="lg" @change="onMainPdfUpload" hidden />
        </CFormLabel>

        <CFormFeedback :class="{ haveError: fileError }" v-if="fileError"
          >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
        ><br />
      </CCol>
      <CCol class="mt-4 text-center" :lg="4">
        <CFormLabel for="from_page"> ملف صوتى </CFormLabel>
        <br />
        <span class="uploaded-files text-primary" v-if="audio_url != ''">
          {{ audio_url }}
        </span>

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
            padding-top: 5px;
            margin-top: 10px;
          "
        >
          <span v-if="!audioloading" class=" " style="font-size: 11px">
            {{ 'انقر هنا لتحميل   ملف صوتى  ' }}
            <CIcon
              size="lg"
              icon="cil-cloud-upload"
              class="mx-2"
              style="vertical-align: middle"
            />
          </span>
          <span v-if="audioloading" class=" " style="font-size: 11px">
            يرجى الانتظار حتى يتم التحميل
          </span>

          <CFormInput
            type="file"
            size="lg"
            accept="audio/*"
            @change="onMainAudioUpload"
            hidden
          />
        </CFormLabel>

        <CFormFeedback :class="{ haveError: audioError }" v-if="audioError"
          >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
        ><br />
      </CCol>
    </CRow>
    <CCol :md="6">
      <CFormLabel> عدد صفحات</CFormLabel>
      <input
        type="text"
        class="p-2"
        :class="{
          onError: page_countError,
          'form-control': !page_countError,
        }"
        v-model="this.page_count"
      />
      <CFormFeedback
        :class="{ haveError: page_countError }"
        v-if="page_countError"
        >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
      ><br />
    </CCol>
    <CCol :md="6">
      <CFormLabel> مدة الملف الصوتى</CFormLabel>
      <input
        type="text"
        class="p-2"
        :class="{
          onError: durationError,
          'form-control': !durationError,
        }"
        v-model="this.duration"
      />
      <CFormFeedback :class="{ haveError: durationError }" v-if="durationError"
        >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
      ><br />
    </CCol>
    <CCol :md="12">
      <CFormLabel>Overview</CFormLabel>
      <input
        type="text"
        class="p-2"
        :class="{
          onError: overviewError,
          'form-control': !overviewError,
        }"
        v-model="this.overview"
      />
      <CFormFeedback :class="{ haveError: overviewError }" v-if="overviewError"
        >يجب ألا يكون الحقل المطلوب فارغاً.</CFormFeedback
      ><br />
    </CCol>
    <hr />
    <div class="text-end">
      <CButton color="primary" @click="add()">أضافة</CButton>
    </div>
  </CForm>
</template>

<script>
import axios from 'axios'
import env from '../../env'

const baseUrl = env.baseUrl

const token = localStorage.token
const config = {
  headers: { Authorization: `Bearer ${token}` },
}
// import VueHtml2pdf from 'vue-html2pdf'
export default {
  name: 'Format Summaries',
  data() {
    return {
      categories: [],
      bookName: '',
      bookNameError: '',
      authorNameError: '',
      author: '',
      category_ids: [],
      coverImage: '',
      coverError: '',
      ch_cover: false,
      coverName: '',
      coverloading: false,
      file_name: '',
      content_url: '',
      fileloading: false,
      fileError: '',
      audioloading: false,
      audio_name: '',
      audio_url: '',
      audioError: '',
      overview: '',
      overviewError: '',
      duration: '',
      durationError: '',
      page_count: '',
      page_countError: '',
    }
  },

  methods: {
    catsArray(item) {
      const index = this.category_ids.indexOf(item.id)
      console.log(index)
      if (index > -1) {
        // Number is in the array, remove it
        this.category_ids.splice(index, 1)
      } else {
        // Number is not in the array, add it
        this.category_ids.push(item.id)
      }
      console.log(this.category_ids)
    },
    onMainAudioUpload(event) {
      console.log('files', event.target.files[0])
      let requestBody = new FormData()
      requestBody.append('files[0]', event.target.files[0])
      this.audioloading = true
      axios
        .post(`${baseUrl}/upload/files`, requestBody)
        .then((response) => {
          this.audioloading = false
          this.ch_audio = true
          this.audio_name = response.data.data[0]
          this.audio_url =
            'https://backend.fateen.info/public/' + response.data.data[0]
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
      this.fileloading = true
      axios
        .post(`${baseUrl}/upload/files`, requestBody)
        .then((response) => {
          this.fileloading = false
          this.file_name = response.data.data[0]

          this.content_url =
            'https://backend.fateen.info/public/' + response.data.data[0]
          console.log('files', this.coverImage)
        })
        .catch((error) => {
          // console.log(error)
        })
    },
    onMainImageUpload(event) {
      console.log('files', event.target.files[0])
      let requestBody = new FormData()
      requestBody.append('files[0]', event.target.files[0])
      this.coverloading = true
      axios
        .post(`${baseUrl}/upload/files`, requestBody)
        .then((response) => {
          this.ch_cover = true
          this.coverloading = false
          this.coverName = response.data.data[0]
          this.coverImage =
            'https://backend.fateen.info/public/' + response.data.data[0]
          console.log('files', this.coverImage)
        })
        .catch((error) => {
          // console.log(error)
        })
    },
    add() {
      console.log(this.author, this.bookName)
      if (this.bookName == '') {
        this.bookNameError = true
      }
      if (this.bookName != '') {
        this.bookNameError = false
      }

      if (this.author == '') {
        this.authorNameError = true
      }
      if (this.author != '') {
        this.authorNameError = false
      }
      if (this.coverImage == '') {
        this.coverError = true
      }
      if (this.coverImage != '') {
        this.coverError = false
      }
      if (this.content_url == '') {
        this.fileError = true
      }
      if (this.content_url != '') {
        this.fileError = false
      }
      if (this.audio_url == '') {
        this.audioError = true
      }
      if (this.audio_url != '') {
        this.audioError = false
      }
      if (this.page_count == '') {
        this.page_countError = true
      }
      if (this.page_count != '') {
        this.page_countError = false
      }
      if (this.duration == '') {
        this.durationError = true
      }
      if (this.duration != '') {
        this.durationError = false
      }
      if (this.overview == '') {
        this.overviewError = true
      }
      if (this.overview != '') {
        this.overviewError = false
      }
      let requestBody = new FormData()
      for (let index = 0; index < this.category_ids.length; index++) {
        requestBody.append(`category_ids[${index}]`, this.category_ids[index])
      }

      requestBody.append('writer_name', this.author)

      requestBody.append('cover', this.coverName)
      requestBody.append('audio', this.audio_name)

      requestBody.append('content', this.file_name)

      requestBody.append('page_count', this.page_count)

      requestBody.append('audio_duration', this.duration)
      requestBody.append('title', this.bookName)
      requestBody.append('overview', this.overview)
      this.isLoading = true
      axios
        .post(`${baseUrl}/admin/brief/add`, requestBody, config)
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
            this.$router.push('/books-summaries/all')
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
  },

  mounted() {
    axios
      .get(`${baseUrl}/brief-category/all`, config)
      .then((response) => {
        this.isLoading = false
        this.categories = response.data.data
        this.category_ids.push(this.categories[0].id)
      })
      .catch((error) => {
        this.isLoading = false
        this.$swal({
          title: 'عذرا, هناك خطأ',
          text: error.errors[0],
          icon: 'error',
          confirmButtonColor: '#eb2b2b',
        })
      })
  },
}
</script>

<style scoped>
.catogry_card {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}
.text-danger {
  color: #fff !important;
  background: rgb(60, 98, 100) !important;
}
</style>
