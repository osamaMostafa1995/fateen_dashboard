<template>
  <strong style="font-size: 1.2em;" class="py-1 px-1">الأدمن</strong>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-1 my-1">
      <!-- <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Account
      </CDropdownHeader> -->
     
      <!-- <CDropdownDivider /> -->
    
      <CDropdownItem class="my-1"> <span @click="logout" style="cursor: pointer"><CIcon icon="cil-lock-locked" /> الخروج </span></CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import avatar from '@/assets/images/avatars/man-avatar.jpg'
import { useRouter } from 'vue-router'
export default {

  name: 'AppHeaderDropdownAccnt',
  setup() {
            
    const router = useRouter()
    const logout = () => { 
      localStorage.removeItem("data")
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("alert")

      router.push("/login")
      // window.location.reload()  
    }
    return {
      avatar: avatar,
      itemsCount: 42,
      logout   
    }
  },
}
</script>
