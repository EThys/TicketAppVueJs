import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IUser } from '@/composable/interface/IUser'
import type { ITicket } from '@/composable/interface/ITicket'

export const useUserStore = defineStore('ticket', {
    state: () => {
        return{
            user : {} as IUser || null
        }
    }, 
    actions:{
        setUser (payload:IUser) {
            this.user = payload
        }
    },
    persist: true,
},
)

export function setUser(userData: IUser): void {
    localStorage.setItem('user', JSON.stringify(userData));
  }
  
  export function getUser(): IUser | null {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }
  export function clearUser(): void {
    localStorage.removeItem('user');
  }

  export function setTicket(ticketCall: ITicket): void {
    localStorage.setItem('ticket', JSON.stringify(ticketCall));
  }
  
  export function getTicket(): ITicket | null {
    const ticket = localStorage.getItem('ticket');
    return ticket  ? JSON.parse(ticket) : null;
  }
  export function clearTicket(): void {
    localStorage.removeItem('ticket');
  }