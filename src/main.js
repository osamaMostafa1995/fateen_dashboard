import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsCallout from '@/components/DocsCallout'
import DocsExample from '@/components/DocsExample'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';


const app = createApp(App)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(VueSweetalert2);
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsCallout', DocsCallout)
app.component('DocsExample', DocsExample)
app.component('QuillEditor', QuillEditor)


app.mount('#app')
