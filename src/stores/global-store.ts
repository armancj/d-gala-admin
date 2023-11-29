import { defineStore } from 'pinia'
import { LoginResponse } from '../util/ApiClient'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      isSidebarMinimized: false,
      userName: loadUser().payload.username,
    }
  },

  actions: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized
    },

    changeUserName(userName: string) {
      this.userName = userName
    },
  },
})

export function loadUser() {
  return JSON.parse(localStorage.getItem('user')!) as LoginResponse
}
