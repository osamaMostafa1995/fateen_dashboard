<template>
  <router-view />
</template>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
.onError {  
        position: relative;
        flex: 1 1 auto;
        width: 1%;
        min-width: 0;
        display: block;
        width: 100%;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: var(--cui-input-color, rgba(44, 56, 74, 0.95));
        background-color: var(--cui-input-bg, #fff);
        background-clip: padding-box;
        border: 1px solid var(--cui-input-border-color, red);
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 0.375rem;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    
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
