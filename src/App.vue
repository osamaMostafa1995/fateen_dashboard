<template>
  <router-view />
</template>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
.cdk-paginator {
  ul.pagination {
      justify-content: space-between !important;
      button {
        height: 40px !important;
      }
  }
}
 
</style>
