<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script lang="ts" setup>
//@ts-ignore
import { ApiRoutes } from '@/composable/constant/endpoint'
//@ts-ignore
import { ICurrency } from '@/composable/interface/ICurrency'
//@ts-ignore
import type { ITicket } from '@/composable/interface/ITicket'
//@ts-ignore
import type { ITransferType } from '@/composable/interface/ITransferType'
//@ts-ignore
import { useAxiosRequestWithToken } from '@/composable/service/common_http'
//@ts-ignore
import { setTicket } from '@/stores/user'
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
//@ts-ignore
import Header from '@/components/Header.vue'
//@ts-ignore
import { getToken } from '@/stores/token'
//@ts-ignore
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
//@ts-ignore
import { useToast } from 'vue-toast-notification'
const toast = useToast()
const token = getToken() as string
const router = useRouter()
const listCurrency = ref<Array<ICurrency>>([{} as ICurrency])
const listTypeTransfer = ref<Array<ITransferType>>([{} as ITransferType])
const showLoad = ref<boolean>(false)
const ticket = ref<ITicket>({
  Amount: 0,
  CurrencyFId: 0,
  Motif: '',
  Phone: '',
  TransfertStatusFId: 1,
  TransfertTypeFId: 0,
})
const currencyError = ref('')
const typeError = ref('')
const amountError = ref('')
const phoneError = ref('')
const validatorCurrency = () => {
  // Validation de la devise
  currencyError.value = ticket.value.CurrencyFId === 0 ? 'Choisissez une devise' : ''
}
const validatorAmount = () => {
  // Validation du montant
  amountError.value = ticket.value.Amount <= 0 ? 'Le montant doit être supérieur à zéro.' : ''
}
const validatorTransfertType = () => {
  // Validation du type de transfert
  typeError.value = ticket.value.TransfertTypeFId === 0 ? 'Choisissez le type de transfert' : ''
}
const validatorPhone = () => {
  const phone = ticket.value.Phone
  const regexTenDigits = /^0\d{9}$/ // Commence par 0 et contient 10 chiffres
  const regexNineDigits = /^[1-9]\d{8}$/ // Ne commence pas par 0 et contient 9 chiffres
  const regexOnlyDigits = /^\d+$/ // Vérifie que le numéro ne contient que des chiffres

  if (!regexOnlyDigits.test(phone)) {
    phoneError.value = 'Le numéro doit contenir uniquement des chiffres.'
  } else if (!regexTenDigits.test(phone) && !regexNineDigits.test(phone)) {
    phoneError.value =
      'Le numéro doit contenir 10 chiffres (commençant par 0) ou 9 chiffres (ne commençant pas par 0).'
  } else {
    phoneError.value = ''
  }
}
const storeTicket = async () => {
  showLoad.value = true
  if (
    ticket.value.CurrencyFId == 0 ||
    ticket.value.TransfertTypeFId == 0 ||
    ticket.value.Amount == 0
  ) {
    alert('Certains champs sont vide')
    showLoad.value = false
    return
  }
  const data = JSON.parse(JSON.stringify(ticket.value))
  await useAxiosRequestWithToken(token)
    .post(`${ApiRoutes.ticketCreate}`, data)
    .then(function (response) {
      console.log('Matadi', response.data)
      if (response.data.success == 1) {
        toast.open({
          message: 'Enregistrement réussie',
          type: 'success',
          position: 'bottom',
          duration: 5000,
        })
        setTicket(response.data.data[0])
        router.push({ path: '/open/screen' })
      } else {
        toast.open({
          message: 'Erreur',
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

watchEffect(async () => {
  await useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.currencyList}`)
    .then(function (response) {
      console.log('currency', response.data.data)
      listCurrency.value = response.data.data as Array<ICurrency>
    })
    .catch(function (error) {
      console.log(error)
    })
    .finally(function () {})
  await useAxiosRequestWithToken(token)
    .get(`${ApiRoutes.transferTypeList}`)
    .then(function (response) {
      console.log('transferType', response.data.data)
      listTypeTransfer.value = response.data.data as Array<ITransferType>
    })
    .catch(function (error) {
      console.log(error)
    })
    .finally(function () {})
})
</script>
<template>
  <Header />
  <div
    class="relative mx-auto max-w-[780px] px-4 top-[35px] md:flex-0 shrink-0 md:w-7/12 lg:w-5/12 xl:w-9/12"
  >
    <div
      class="relative z-0 flex flex-col w-full bg-[#f8f9fa] min-w-0 break-words border-0 shadow-soft-xl bg-clip-border"
    >
      <div class="relative py-4 card-head h-16 bg-gray-400 text-black border border-gray-300">
        <div class="">
          <div>
            <h1 class="text-center">Ouverture simple du ticket</h1>
          </div>
        </div>
      </div>
      <div class="flex-auto p-6 border border-gray-300">
        <form role="form text-left" @submit.prevent="storeTicket()">
          <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label>Montant</label>
              <input
                @blur="validatorAmount()"
                type="number"
                v-model="ticket.Amount"
                class="text-sm block focus:shadow-soft-primary-outline leading-5.6 ease-soft w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-blue-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
              />
              <div class="text-red-500 text-sm ml-4 italic" v-if="amountError">
                {{ amountError }}
              </div>
            </div>
            <div class="w-full md:w-1/2 px-3">
              <label class="ml-2">Devise</label>
              <div class="relative">
                <select
                  @blur="validatorCurrency()"
                  v-model="ticket.CurrencyFId"
                  class="ml-2 text-sm w-full focus:shadow-soft-primary-outline leading-5.6 ease-soft appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-blue-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                >
                  <option
                    v-for="item in listCurrency"
                    :key="item.currencyId"
                    :value="item.currencyId"
                  >
                    {{ item.currencyCode }}
                  </option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                >
                  <svg
                    class="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
              <div class="text-red-500 text-sm ml-4 italic" v-if="currencyError">
                {{ currencyError }}
              </div>
            </div>
          </div>
          <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label>Téléphone</label>
              <input
                @blur="validatorPhone()"
                type="tel"
                v-model="ticket.Phone"
                class="text-sm block focus:shadow-soft-primary-outline leading-5.6 ease-soft w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-blue-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
              />
              <div v-if="phoneError" class="text-red-500 text-sm ml-4 italic">{{ phoneError }}</div>
            </div>
            <div class="w-full md:w-1/2 px-3">
              <label class="ml-2">Type</label>
              <div class="relative">
                <select
                  @blur="validatorTransfertType()"
                  v-model="ticket.TransfertTypeFId"
                  class="ml-2 text-sm w-full rounded-lg focus:shadow-soft-primary-outline leading-5.6 ease-soft appearance-none border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-blue-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                >
                  <option
                    v-for="item in listTypeTransfer"
                    :key="item.transferTypeId"
                    :value="item.transferTypeId"
                  >
                    {{ item.name }}
                  </option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                >
                  <svg
                    class="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
              <div class="text-red-500 text-sm ml-4 italic" v-if="typeError">
                {{ typeError }}
              </div>
            </div>
          </div>
          <div class="mb-4">
            <label class="mr-4">Motif</label>
            <textarea
              v-model="ticket.Motif"
              class="text-sm block focus:shadow-soft-primary-outline leading-5.6 ease-soft w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-blue-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
            ></textarea>
          </div>
          <div class="flex flex-row gap-4">
            <button
              type="submit"
              class="inline-block px-3 py-2 mt-6 mb-2 font-bold text-center text-white transition-all bg-transparent border-0 rounded-sm cursor-pointer active:opacity-85 hover:scale-102 hover:shadow-soft-xs leading-pro text-sm ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 bg-gradient-to-tl from-gray-400 to-gray-400 hover:text-white"
            >
              <svg v-if="showLoad" class="spinner inline h-6 w-6 mr-3" viewBox="0 0 4 4"></svg>
              Enregistrer
            </button>
          </div>
        </form>
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
