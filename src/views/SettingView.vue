<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script lang="ts" setup>
//@ts-ignore
import { ApiRoutes } from '@/composable/constant/endpoint'
//@ts-ignore
import Header from '@/components/Header.vue'
//@ts-ignore
import type { ICounter } from '@/composable/interface/ICounter'
//@ts-ignore
import { useAxiosRequestWithToken } from '@/composable/service/common_http'
//@ts-ignore
import { getToken } from '@/stores/token'
import { ref, watchEffect } from 'vue'
//@ts-ignore
import { useToast } from 'vue-toast-notification'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
const counterList = ref<Array<ICounter>>([{} as ICounter])
const counters = ref<ICounter>([{} as ICounter])
const token = getToken() as string
const showUpdate = ref<boolean>(false)
const isActive = ref<number | null>(null)
const open = ref<boolean>(false)
const toast = useToast()
const showLoad = ref<boolean>(false)
const showUpgrade = ref<boolean>(false)
const counterRequestStore = ref<ICounter>({
  counterName: '',
  branchFId: 2,
})
const counterUpdate = ref<ICounter>({
  counterName: '',
  branchFId: 2,
})
const callStateButton = () => {
  showUpdate.value = !showUpdate.value
}
const getAllCounter = async () => {
  await useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.counterList}`)
    .then(function (response) {
      console.log('counterList', response.data.data)
      counterList.value = response.data.data as Array<ICounter>
    })
    .catch(function (error) {
      console.log(error)
    })
    .finally(function () {})
}

watchEffect(async () => {
  getAllCounter()
})

const selectCounter = (counter: ICounter) => {
  counters.value = counter
  isActive.value = counter.counterId
  counterUpdate.value = { ...counter }
  console.log('Guichet sélectionné:', isActive.value)
}

const store_update = async (id: number) => {
  showUpgrade.value = true
  const data = JSON.parse(JSON.stringify(counterUpdate.value))
  await useAxiosRequestWithToken(token)
    .put(`${ApiRoutes.counterUpdate}/${id}`, data)
    .then(function (response) {
      console.log(response)
      getAllCounter()
      counterUpdate.value = ''
    })
    .catch(function (error) {
      // handle error
      console.log(error)
    })
    .finally(function () {
      // always executed
      showUpgrade.value = false
    })
}

const deleteCounter = async (id: number) => {
  try {
    if (window.confirm('Do you want to delete this counter?')) {
      const response = await useAxiosRequestWithToken(token).delete(
        `${ApiRoutes.counterDelete}/${id}`,
      )
      console.log('MATAMAAAAAAAA', response.data.success == 0)

      if (response.data.success == 1) {
        toast.open({
          message: 'Suppression réussie',
          type: 'success',
          position: 'bottom',
          duration: 5000,
        })
        setTimeout(() => getAllCounter(), 1000)
      } else {
        toast.open({
          message: 'Erreur lors de la suppression',
          type: 'error',
          position: 'bottom',
          duration: 5000,
        })
      }
    }
  } catch (error) {
    console.error('Erreur du serveur', error)
    toast.open({
      message: 'Erreur du serveur',
      type: 'error',
      position: 'bottom',
      duration: 5000,
    })
  }
}

const store_counter = async () => {
  showLoad.value = true
  const data = JSON.parse(JSON.stringify(counterRequestStore.value))
  await useAxiosRequestWithToken(token)
    .post(`${ApiRoutes.counterCreate}`, data)
    .then(function (response) {
      console.log(response)
      if (response.data.success == 1) {
        toast.open({
          message: 'Enregistrement réussie',
          type: 'success',
          position: 'bottom',
          duration: 5000,
        })
        getAllCounter()
      } else {
        toast.open({
          message: 'Cet item existe deja',
          type: 'error',
          position: 'bottom',
          duration: 5000,
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
    .finally(function () {
      showLoad.value = false
    })
}
</script>
<template>
  <Header />
  <form
    class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-4 p-20 relative"
  >
    <div class="bg-gray-200 p-4 rounded-lg">
      <div class="w-full shadow-md rounded-lg overflow-hidden">
        <div class="bg-gray-300 px-4 py-2">
          <h2 class="text-gray-700 text-lg font-semibold">Liste des guichets</h2>
        </div>
        <ul class="divide-y divide-gray-300">
          <li
            @click="selectCounter(item)"
            v-for="item in counterList"
            :key="item.counterId"
            :value="item.counterId"
            :class="{
              'bg-blue-500': isActive === item.counterId,
              'hover:bg-blue-500': isActive === item.counterId,
              'text-white': isActive === item.counterId,
              'bg-white': isActive !== item.counterId,
            }"
            class="px-4 py-2 bg-white hover:bg-gray-100 cursor-pointer"
          >
            {{ item.counterName }}
          </li>
        </ul>
      </div>
    </div>

    <div
      class="relative z-0 flex flex-col h-64 w-full bg-[#f8f9fa] min-w-0 break-words border-0 shadow-soft-xl bg-clip-border"
    >
      <div class="relative py-4 card-head h-16 bg-gray-400 text-black">
        <div class="">
          <div>
            <h1 class="ml-4">Details pour le guichet : {{ counters?.counterName }}</h1>
          </div>
        </div>
      </div>

      <div v-if="counterUpdate.counterName || counters?.counterName" class="flex-auto p-6">
        <form role="form text-left">
          <div class="mb-4">
            <label class="mr-4">Nom</label>
            <input
              type="text"
              v-model="counterUpdate.counterName"
              class="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft w-full appearance-none rounded-lg border border-solid border-gray-300 bg-gray-300 bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-blue-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
            />
          </div>
          <div class="flex flex-row gap-4" v-if="!showUpdate">
            <button
              @click="callStateButton()"
              type="button"
              class="inline-block w-[150px] px-2 py-2 mt-6 mb-2 font-bold text-center text-black transition-all bg-transparent border-0 rounded-lg cursor-pointer active:opacity-85 hover:scale-102 hover:shadow-soft-xs leading-pro text-sm ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 bg-gradient-to-tl from-yellow-300 to-yellow-200 hover:text-white"
            >
              Modifier
            </button>
            <button
              @click="deleteCounter(counters?.counterId)"
              type="button"
              class="inline-block w-[150px] px-2 py-2 mt-6 mb-2 font-bold text-center text-white transition-all bg-transparent border-0 rounded-lg cursor-pointer active:opacity-85 hover:scale-102 hover:shadow-soft-xs leading-pro text-sm ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 bg-gradient-to-tl from-red-500 to-red-500 hover:text-white"
            >
              Supprimer
            </button>
          </div>
          <div class="flex flex-row gap-4" v-else>
            <button
              @click="store_update(counters?.counterId)"
              type="button"
              class="inline-block w-[150px] px-2 py-2 mt-6 mb-2 font-bold text-center text-white transition-all bg-transparent border-0 rounded-lg cursor-pointer active:opacity-85 hover:scale-102 hover:shadow-soft-xs leading-pro text-sm ease-soft-in tracking-tight-soft shadow-soft-md bg-blue-800 hover:text-white"
            >
              Enregistrer
            </button>
            <button
              @click="callStateButton()"
              type="button"
              class="inline-block w-[150px] px-2 py-2 mt-6 mb-2 font-bold text-center text-white transition-all bg-transparent border-0 rounded-lg cursor-pointer active:opacity-85 hover:scale-102 hover:shadow-soft-xs leading-pro text-sm ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 bg-gradient-to-tl from-red-500 to-red-500 hover:text-white"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
    <div
      class="relative z-0 flex flex-col w-full h-64 bg-[#f8f9fa] min-w-0 break-words border-0 shadow-soft-xl bg-clip-border"
    >
      <div class="relative py-4 card-head h-16 bg-gray-400 text-black">
        <div class="">
          <div>
            <h1 class="ml-4">Ajouter un guichet</h1>
          </div>
        </div>
      </div>

      <div class="flex-auto p-6">
        <form role="form text-left">
          <div class="mb-4">
            <label class="mr-4">Nom</label>
            <input
              type="text"
              required
              v-model="counterRequestStore.counterName"
              placeholder="name"
              class="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-blue-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
            />
          </div>
          <div class="flex flex-row gap-4">
            <button
              type="button"
              @click="store_counter"
              class="inline-block w-[150px] px-2 py-2 mt-6 mb-2 font-bold text-center text-white transition-all bg-transparent border-0 rounded-lg cursor-pointer active:opacity-85 hover:scale-102 hover:shadow-soft-xs leading-pro text-sm ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 bg-gradient-to-tl from-blue-400 to-blue-400 hover:border-blue-800 hover:text-white"
            >
              Enregistrer
              <svg v-if="showLoad" class="spinner inline h-6 w-6 mr-3" viewBox="0 0 4 4"></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </form>
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
