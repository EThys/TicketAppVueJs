<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
//@ts-ignore
import { clearUser, getUser } from '@/stores/user'
//@ts-ignore
import { clearToken } from '@/stores/token'
import { useRouter } from 'vue-router'
const router = useRouter()
const user = getUser()
const logout = () => {
  clearUser()
  clearToken()
  router.push('/login')
}

//Logique pour déconnecter un user aprés 30 minutes d'inactivité
const inactivityTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
const INACTIVITY_LIMIT = 30 * 60 * 1000

const resetTimer = () => {
  if (inactivityTimeout.value) {
    clearTimeout(inactivityTimeout.value)
  }
  inactivityTimeout.value = setTimeout(logout, INACTIVITY_LIMIT)
}

const setupEventListeners = () => {
  window.addEventListener('mousemove', resetTimer)
  window.addEventListener('keydown', resetTimer)
}

onMounted(() => {
  setupEventListeners()
  resetTimer() // Démarrer le timer au chargement
})

onBeforeUnmount(() => {
  if (inactivityTimeout.value) {
    clearTimeout(inactivityTimeout.value)
  }
  window.removeEventListener('mousemove', resetTimer)
  window.removeEventListener('keydown', resetTimer)
})
//fin
</script>

<template>
  <nav style="background-color: #343a40" class="flex justify-between items-center p-4">
    <div class="flex space-x-4">
      <span class="font-medium text-lg text-white">Soficom Q-SYS</span>
      <router-link class="hover:text-white text-gray-300" to="/">Accueil</router-link>
      <router-link class="hover:text-white text-gray-300" to="/simple">Simple</router-link>
      <router-link class="hover:text-white text-gray-300" to="/call">Appels</router-link>
      <router-link class="hover:text-white text-gray-300" to="/setting">Paramètres</router-link>
      <router-link class="hover:text-white text-gray-300" to="/open">Ouvrir ticket</router-link>
    </div>
    <div class="flex space-x-4 items-center">
      <span class="flex items-center space-x-1">
        <span class="text-white"><i class="fa-solid fa-user"></i> {{ user?.username }}</span>
      </span>
      <a
        href="#"
        class="flex items-center space-x-1 text-white hover:text-red-700"
        @click="logout()"
      >
        <span><i class="fa-solid fa-sign-out-alt text-red-500"></i> Déconnexion</span>
      </a>
    </div>
  </nav>
</template>
<style scoped></style>
