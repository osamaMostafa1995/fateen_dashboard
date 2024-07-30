<template>
  <CForm class="row g-3">
    <h5 class="fw-bold">عرض  بيانات الكتاب</h5>
    <CCol :md="6">
      <CFormLabel> أسم الكتاب</CFormLabel>
      <input type="text" class="p-2 form-control" v-model="this.book.title" />
    </CCol>
    <CCol :md="6">
      <CFormLabel> أسم المؤلف</CFormLabel>
      <input
        type="text"
        class="p-2 form-control"
        v-model="this.book.writer_name"
      />
    </CCol>
    <CCol :md="12">
      <CFormLabel for="state"> أقسام الكتاب</CFormLabel>
      <div class="row">
        <div class="col-md-3 my-2" v-for="item in this.book.categories">
          <p class="catogry_card text-center">
            {{ item.name_ar }}
          </p>
        </div>
      </div>
    </CCol>
    <CCol :md="3">
      <CFormLabel> أسم المؤلف</CFormLabel>
      <input
        type="text"
        class="p-2 form-control"
        v-model="this.book.writer_name"
      />
    </CCol>
    <CCol :md="3">
      <CFormLabel> أسم المؤلف</CFormLabel>
      <input
        type="text"
        class="p-2 form-control"
        v-model="this.book.writer_name"
      />
    </CCol>
    <CCol :md="3">
      <CFormLabel> عدد الصفحات</CFormLabel>
      <input
        type="text"
        class="p-2 form-control"
        v-model="this.book.page_count"
      />
    </CCol>
    <CCol :md="3">
      <CFormLabel> مدة الملف الصوتي</CFormLabel>
      <input
        type="text"
        class="p-2 form-control"
        v-model="this.book.audio_duration"
      />
    </CCol>

  </CForm>
</template>
<script>
import axios from 'axios'
import env from '../../env'

import { useRoute } from 'vue-router'
const baseUrl = env.baseUrl

const token = localStorage.token
const config = {
  headers: { Authorization: `Bearer ${token}` },
}

export default {
  data() {
    return {
      book: '',
      isLoading: true,
    }
  },
  mounted() {
    const route = useRoute()
    const id = route.params.id
    axios
      .get(`${baseUrl}/admin/brief/show?summary_id=${id}`, config)
      .then((response) => {
        this.book = response.data.data
        console.log(this.book, response)
      })
      .catch(() => {})
  },
}
</script>
<style scoped>
.catogry_card {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  color: #fff !important;
  background: rgb(60, 98, 100) !important;
}
</style
