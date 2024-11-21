<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script lang="ts" setup>
//@ts-ignore
import { ApiRoutes } from '@/composable/constant/endpoint'
//@ts-ignore
import type { IUser, IUserAuth } from '@/composable/interface/IUser'
//@ts-ignore
import { useAxiosRequestWithToken } from '@/composable/service/common_http'
//@ts-ignore
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
//@ts-ignore
import { setUser, useUserStore } from '@/stores/user'
//@ts-ignore
import { setToken, getToken } from '@/stores/token'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import 'vue3-toastify/dist/index.css'
//@ts-ignore
import type { IToken } from '@/composable/interface/IToken'

const showLoad = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const loading = ref<boolean>(false)
const toast = useToast()
const router = useRouter()
const auth = ref<IUserAuth>({
  UserName: '',
  Password: '',
})

const login = async () => {
  loading.value = true
  const data = JSON.parse(JSON.stringify(auth.value))
  const abortController = new AbortController()
  const abortSignal = abortController.signal

  const networkTimeout = setTimeout(() => {
    abortController.abort()
    loading.value = false
    toast.open({
      message: 'Network Error, please check your internet.',
      type: 'error',
      position: 'bottom',
      duration: 5000,
    })
  }, 30000)

  await useAxiosRequestWithToken()
    .post(`${ApiRoutes.userLogin}`, data, { signal: abortSignal })
    .then(function (response) {
      //success
      clearTimeout(networkTimeout)
      const token = response.data.data.accessToken
      console.log('MATAMAAAAAAAAA', token)
      console.log('babi', response.data)

      if (token != null) {
        setToken(token as IToken)
        setUser(response.data.data as IUser)
        router.push('/simple')
      }

      loading.value = false
    })
    .catch(function (error) {
      //error
      clearTimeout(networkTimeout)
      console.log(error)
      toast.open({
        message: error.response.data.message,
        type: 'warning',
        position: 'top-right',
        duration: 5000,
      })
      loading.value = false
    })
}

const loginValidate = async () => {
  loading.value = true
  if (
    !auth.value.Password ||
    !auth.value.UserName ||
    auth.value.Password.trim() === '' ||
    auth.value.UserName.trim() === ''
  ) {
    setTimeout(() => {
      toast.open({
        message: 'Oops...Veuillez remplir vos informations!',
        type: 'warning',
        position: 'top-right',
        duration: 5000,
      })
      loading.value = false
    }, 300)
    return
  } else {
    await login()
  }
}
</script>
<template>
  <div style="background-color: #c82333" class="h-screen w-screen">
    <div
      class="relative mx-auto max-w-[445px] px-4 top-[125px] md:flex-0 shrink-0 md:w-7/12 lg:w-5/12 xl:w-4/12"
    >
      <div
        class="relative z-0 flex flex-col bg-[#F8FAFC] min-w-0 break-words border-0 shadow-soft-xl rounded-sm bg-clip-border"
      >
        <div class="pb-6 pt-8 text-center bg-[#F8FAFC] border-b-0 rounded-t-2xl">
          <h2 class="text-4xl font-bold">Soficom</h2>
        </div>
        <div class="text-center bg-[#F8FAFC] border-b-0 rounded-t-2xl">
          <h2 class="text-2xl">Connexion</h2>
        </div>
        <div class="text-center bg-[#F8FAFC] border-b-0 rounded-t-2xl">
          <h2 class="text-1xl">Pour accéder à Q-SYS</h2>
        </div>

        <div class="flex-auto pt-6 px-8">
          <form role="form text-left " @submit.prevent="loginValidate">
            <div class="mb-4">
              <input
                type="text"
                v-model="auth.UserName"
                class="text-base focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-sm border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-2 font-normal text-gray-700 transition-all focus:border-red-500 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                placeholder="Saisissez l'identifiant"
                aria-label="Email"
                aria-describedby="email-addon"
              />
            </div>
            <div class="mb-4">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="auth.Password"
                class="text-base focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-sm border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-2 font-normal text-gray-700 transition-all focus:border-red-500 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                placeholder="Saisissez le mot de passe"
                aria-label="Password"
                aria-describedby="password-addon"
              />
            </div>
            <input class="mb-4" v-model="showPassword" type="checkbox" />
            <label>Afficher le mot de passe</label>
            <div class="w-full mb-4">
              <label class="text-lg text-black w-1/4"></label>
              <button
                style="background-color: #787d81"
                class="text-lg rounded-md text-white px-6 py-1 mt-4 w-full"
                type="submit"
                v-if="!loading"
              >
                <i class="fa fa-sign-in-alt"></i>
                Connexion
              </button>
              <p v-else style="color: green">
                <span class="fas fa-sync fa-spin"></span> Verification
              </p>
            </div>
            <p class="mt-4 mb-0 leading-normal text-center text-sm">
              <a href="#" class="font-bold text-blue-500 hover:text-blue-300 hover:underline"
                >Identifiant / Mot de passe oublié?</a
              >
            </p>
            <p class="mt-4 mb-10 leading-normal text-center text-sm">
              En cliquant sur connexion, vous acceptez
              <a href="#" class="text-blue-500 hover:text-blue-300 hover:underline">notre accord</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #25353f;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
