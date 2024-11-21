// import { ref } from "vue/dist/vue.mjs";
// import type { ICall } from "../interface/ICall";
// import type { IUserAuth } from "../interface/IUser";
// //Call

// //User
// export const auth = ref<IUserAuth>({
//     UserName:'',
//     Password:''
//   });  
// //Init Boolean
// export const showLoad = ref<Boolean>(false);  
export function getCurrentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }