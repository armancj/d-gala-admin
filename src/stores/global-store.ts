import { defineStore } from 'pinia'
import { LoginResponse } from '../util/ApiClient'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      isSidebarMinimized: false,
      userName: loadUser().payload.username,
      id: loadUser().payload.id,
      token: loadUser().access_token,
      avatar: loadUser().payload.avatar,
    }
  },

  actions: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized
    },

    changeUserName(userName: string) {
      this.userName = userName
    },

    changeAvatar(avatar: string) {
      this.avatar = avatar
    },
  },
})

export function loadUser() {
  return JSON.parse(localStorage.getItem('user')!) as LoginResponse
}
