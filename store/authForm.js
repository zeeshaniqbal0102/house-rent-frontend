export const state = () => ({
   phone: '',
   phone_verified: 0,
   step: 'login',
   role: 'guest',
 })

 export const actions = {
   set(store, data) {
     store.commit('UPDATE', data)
   },
 }

 export const mutations = {
   UPDATE(state, data) {
     for (const [key, value] of Object.entries(data)) {
       state[key] = value
     }
   },
 }
