<template>
  <CForm class="row g-3">
    <h5 class="fw-bold">عرض  بيانات الكتاب</h5>
    <CButton disabled v-show="isLoading">
    
   
        <CSpinner class="spinner" />
      
      جاري التحميل ...
    </CButton>
    <CCol :md="4">
      <h5 class="mb-3"> أسم الكتاب</h5>
      <input readonly type="text" class="p-2 form-control" v-model="this.book.title" />
    </CCol>
    <CCol :md="4">
      <h5 class="mb-3"> أسم المؤلف</h5>
      <input readonly
        type="text"
        class="p-2 form-control"
        v-model="this.book.writer_name"
      />
    </CCol>
    <CCol :md="4">
      <h5 class="mb-3"> عدد المشاهدات</h5>
      <input readonly
        type="text"
        class="p-2 form-control"
        v-model="this.book.views_count"
      />
    </CCol>

    <CCol :md="3">
      <h5 class="mb-3">عدد الإعجابات</h5>
      <input readonly
        type="text"
        class="p-2 form-control"
        v-model="this.book.likes_count"
      />
    </CCol>
    <CCol :md="3">
      <h5 class="mb-3">عدد مرات عدم الإعجاب</h5>
      <input readonly
        type="text"
        class="p-2 form-control"
        v-model="this.book.dislikes_count"
      />
    </CCol>
    <CCol :md="3">
      <h5 class="mb-3"> عدد الصفحات</h5>
      <input readonly
        type="text"
        class="p-2 form-control"
        v-model="this.book.page_count"
      />
    </CCol>
    <CCol :md="3">
      <h5 class="mb-3">  مدة الملف الصوتي</h5>
      <input readonly
        type="text"
        class="p-2 form-control"
        v-model="this.book.audio_duration"
      />
    </CCol>
    <CCol :md="12">
      <h5 class="mb-3"> أقسام الكتاب</h5>
      <div class="row">
        <div class="col-md-3 my-2" v-for="item in this.book.categories">
          <p class="catogry_card text-center">
            {{ item.name_ar }}
          </p>
        </div>
      </div>
    </CCol>
    <CCol :md="12">
      <h5 class="mb-3"> التعبيرات</h5>
      <div class="row">
        <div class="col-md-3 my-2" v-for="item in this.book.expressions">
        <div class="card p-0 text-center" >
          <CImage
         
          rounded
          thumbnail
          :src="item.image_url"
          style="width: 100%; height: 200px"
        />
          <p class="mt-2">  عدد المرات : {{ item.count }}</p>
          <p class="catogry_card m-0 text-center">
            {{ item.name_ar }}
          </p>
        </div>
        </div>
      </div>
    </CCol>
    <CCol :md="12">
 <div class="d-flex justify-content-between align-items-center">
  <h5 class="mb-3"> التعليقات</h5>
 </div>
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
    <CTable hover small responsive="sm" striped v-if="!isLoading">
      <CTableHead>
        <CTableRow color="dark">
          <CTableHeaderCell scope="col">الرقم التعريفي</CTableHeaderCell>

          <CTableHeaderCell scope="col">اسم التعليق</CTableHeaderCell>
          <CTableHeaderCell scope="col">اسم المستخدم</CTableHeaderCell>
          <CTableHeaderCell scope="col">صورة المستخدم</CTableHeaderCell>
          <CTableHeaderCell scope="col">إدارة التعليق</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>
        <CTableRow v-for="item in book?.reviews" :key="summary">
          <CTableHeaderCell scope="row">{{ item.id }} </CTableHeaderCell>

          <CTableDataCell
       
            >{{ item?.comment|| '-' }}</CTableDataCell
          >
          <CTableDataCell
     
          >{{ item?.user.name|| '-' }}</CTableDataCell
        >
        <CTableDataCell
       
        >
        <CImage
         
        rounded
        thumbnail
        :src="item.user.imagePath"
        style="width: 50px; height: 50px"
      />
        </CTableDataCell
      >
          <CTableDataCell>  <CButton
            color="primary"
            variant="outline"
            @click="() => toggleWeb(item)"
          >
            {{ item?.is_comment_visible==0? 'اظهار' : 'اخفاء' }}
          </CButton></CTableDataCell>

        
        </CTableRow>
      </CTableBody>
    </CTable>
    <div class="d-flex justify-content-between align-items-center w-100">
      <CPagination class="cdk-paginator ">
        <div class="d-flex my-2">
          <div class="mx-1 my-2" v-if="currentPage == 1">
            <CPaginationItem disabled>السابقة</CPaginationItem>
          </div>
  
          <div class="mx-1 my-2" v-else>
            <CPaginationItem
              class="paginated-style"
              @click="handleListPagePagination(currentPage--)"
              >السابقة
            </CPaginationItem>
          </div>
  
          <div class="mx-1 my-2" v-if="currentPage == lastPage">
            <CPaginationItem disabled>التالية</CPaginationItem>
          </div>
          <div class="mx-1 my-2" v-else>
            <CPaginationItem
              class="paginated-style"
              @click="handleListPagePagination(currentPage++)"
              >التالية
            </CPaginationItem>
          </div>
        </div>
  
        <!-- <div class="my-2 mx-4 pt-2"> رقم الصفحة {{currentPage}}</div> -->
  
      
      </CPagination>
      <CButton class="py-2 px-5 m-4" color="primary" @click="show_comments(this.book)">عرض المزيد</CButton>

    </div>
  
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
      currentPage: 1,
      lastPage:1,
    }
  },
  methods: {
    show_comments(book){
 
    
    

 axios
   .get(`${baseUrl}/admin/review/all?summary_id=${book.id}`, config)
   .then((response) => {
    this.currentPage = response.data.data.current_page
        this.lastPage = response.data.data.last_page
 
        this.book.reviews = response.data.data.data
   
   })
   .catch((error) => {
     this.isLoading = false
   })
},
    toggleWeb(book){
 
    
    
      let requestBody = new FormData()

      requestBody.append('review_id', book.id)
      axios
        .post(`${baseUrl}/admin/review/toggle`, requestBody, config)
        .then((response) => {
      
      
          book.is_comment_visible = !book.is_comment_visible
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
      console.log(currentPage)
      sessionStorage.setItem('booksdetailsCurrentPage', this.currentPage)
      axios
        .get(
          `${baseUrl}/admin/review/all?summary_id=${book.id}&page=` +
            sessionStorage.getItem('booksdetailsCurrentPage'),
          config,
        )
        .then((response) => {
          this.isLoading = false
          this.book.reviews = response.data.data.data
          this.currentPage = response.data.data.current_page
          this.lastPage = response.data.data.last_page
          
        })
        .catch((error) => {
          this.isLoading = false
        })
    },
  },
  mounted() {
    const route = useRoute()
    const id = route.params.id
    axios
      .get(`${baseUrl}/admin/brief/show?summary_id=${id}`, config)
      .then((response) => {
      this.isLoading=false
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
