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
        padding: 10px 20px;
        margin-top: 8px;
      }
  }
}

.page-link  , .modal-footer button { 
  padding: 10px 20px 5px 20px;
}

td button{ 
  padding:10px 15px 0px 15px !important ;
}

.modal-footer {
   border: none !important;
}

div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm ,  div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel   {
  background-color:#303c54!important; 
  padding: 15px 20px 10px 20px !important; 
  box-shadow:  none !important;
}

div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel  {
  background-color:#c50c0c !important;
}
</style>
