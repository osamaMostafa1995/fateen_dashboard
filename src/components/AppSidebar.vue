<template>
  <CSidebar
    position="fixed"
    :unfoldable="sidebarUnfoldable"
    :visible="sidebarVisible"
    @visible-change="
      (event) =>
        $store.commit({
          type: 'updateSidebarVisible',
          value: event,
        })
    "
  >
    <CSidebarBrand>
      <!-- <CIcon
        custom-class-name="sidebar-brand-full"
        :icon="logoNegative"
        :height="35"
      />  -->
      <CCardImage class="logo" orientation="top" :src="mainLogo" style="  "/>  
       <h3 class="text-center mb-0"> فطين </h3>
      <!-- <CIcon
        custom-class-name="sidebar-brand-narrow"
        :icon="sygnet"
        :height="35"
      /> -->
    </CSidebarBrand>
    <AppSidebarNav />
    <!-- <CSidebarToggler
      class="d-none d-lg-flex"
      @click="$store.commit('toggleUnfoldable')"
    /> -->
  </CSidebar>
</template>

<style scoped>
 .logo {
  height: 40px;
  width: 40px; 
  /* margin-bottom: 10px;  */
  margin-left: 5px;
  filter: brightness(0) saturate(100%) invert(93%) sepia(9%) saturate(249%) hue-rotate(131deg) brightness(83%) contrast(83%);
 }

 
</style>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { AppSidebarNav } from './AppSidebarNav'
// import { logoNegative } from '@/assets/brand/logo-negative'
import mainLogo from '@/assets/images/pngegg.png'

import { sygnet } from '@/assets/brand/sygnet'
export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
  },
  setup() {
    const store = useStore()
    return {
      // logoNegative,
      mainLogo,
      sygnet,
      sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
      sidebarVisible: computed(() => store.state.sidebarVisible),
    }
  },
}
</script>