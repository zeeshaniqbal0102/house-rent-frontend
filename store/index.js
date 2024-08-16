export const mutations = {
  SET_DATA(state, payload = {}) {
    state.types = payload.types || []
    state.amenities = payload.amenities || []
    state.rules = payload.rules || []
    state.config = payload.config || {}
  },
  SET_FAVORITES(state, payload = {}) {
    state.favorites = payload.listings || []
  },
  SET_NOTY_STATUS(state, hasNoty) {
    state.hasNoty = hasNoty
  },
  SET_CURRENT_LOCATION(state, payload = {}) {
    state.currentLocation = payload.currentLocation || null
  },
  SET_CURRENT_LOCATION_LOADING(state, currentLocationLoading) {
    state.currentLocationLoading = currentLocationLoading
  },
  SET_INIT_STATUS(state, data = {}) {
    for (const [key, value] of Object.entries(data)) {
      state[key] = value
    }
  },
  // auth_request(state) {
  //   state.status = 'loading'
  // },
  // auth_success(state, token, user) {
  //   state.status = 'success'
  //   state.token = token
  //   state.user = user
  // },
  // auth_error(state) {
  //   state.status = 'error'
  // },
  // logout(state) {
  //   state.status = ''
  //   state.token = ''
  // },
  SET_MQ(state, mq) {
    state.mq = mq
  },
  UPDATE_MQ(state) {
    for (let i = 0; i < state.screens.length; i++) {
      const screen = state.screens[i]
      if (window.matchMedia(`(max-width: ${screen.value}px)`).matches) {
        state.mq = screen.name
        state.mobLayout = true
        return screen.name
      }
    }
    state.mobLayout = false
    return (state.mq = 'desktop')
  },
}

export const state = () => {
  const result = {
    types: [],
    amenities: [],
    rules: [],
    config: {},
    mq: 'mobile',
    mobLayout: true,
    currentLocation: null,
    currentLocationLoading: false,
    favorites: [],
    hasNoty: 0,

    getClientDataInit: false,
    setMqListenerInit: false,
    getLocationInit: false,
    getPushInit: false,
    getNotsCountInit: false,
    getDataInit: false,
    getVerifyStatusInit: false,
    getFavoritesInit: false,

    screens: [
      { name: 'mobile', value: 1023 },
      // { name: 'tablet', value: 1024 },
    ],
  }
  return result
}

export const getters = {
  hasNoty(state) {
    return state.hasNoty
  },
  isMobile(state) {
    return state.mq === 'mobile'
  },
  config(state) {
    return state.config
  },
}

export const actions = {
  nuxtServerInit({ commit, dispatch }, { app, req }) {
    dispatch('setMq', this.$device.isMobile ? 'mobile' : 'desktop')
    // const { data } = await app.$axios.$get('/data')
    // commit('SET_DATA', data)
    // dispatch('getData')
  },

  getClientData(store, data = {}) {
    store.dispatch('getData')
    store.dispatch('setMqListener')
    if (!store.state.getLocationInit) {
      store.dispatch('getLocation')
    }
    if (this.$auth.loggedIn) {
      if (!store.state.getFavoritesInit) {
        store.dispatch('getFavorites')
      }
      // if (!store.state.getPushInit) {
      //   store.dispatch('getPush')
      // }
      if (!store.state.getVerifyStatusInit) {
        store.dispatch('getVerifyStatus')
      }
      if (!store.state.getNotsCountInit) {
        store.dispatch('getNotsCount')
      }
    }
  },
  setMqListener(store) {
    if (store.state.setMqListenerInit) {
      return
    }
    store.commit('SET_INIT_STATUS', {
      setMqListenerInit: true,
    })
    store.commit('UPDATE_MQ')
    window.addEventListener('resize', e => {
      store.commit('UPDATE_MQ')
    })
  },
  getLocation(store) {
    store.commit('SET_INIT_STATUS', {
      getLocationInit: true,
    })
    if (navigator.geolocation) {
      store.commit('SET_CURRENT_LOCATION_LOADING', true)
      navigator.geolocation.getCurrentPosition(
        position => {
          store.commit('SET_CURRENT_LOCATION', {
            currentLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          })
          store.commit('SET_CURRENT_LOCATION_LOADING', false)
        },
        () => {
          store.commit('SET_CURRENT_LOCATION_LOADING', false)
        },
        { enableHighAccuracy: true }
      )
    }
  },
  getPush(store) {
    if (!this.$auth.loggedIn) {
      return
    }
    store.commit('SET_INIT_STATUS', {
      getPushInit: true,
    })

    const messaging = this.$fireModule.messaging()

    messaging.onMessage(payload => {
      // console.log(payload)
      const noteTitle = payload.notification.title
      const noteOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
      }
      const a = new window.Notification(noteTitle, noteOptions) // eslint-disable-line
    })

    this.$axios.$get('/user/devices').then(res => {
      // console.log(res.data)
      if (!res.data.length) {
        initFirebaseMessagingRegistration(false)
      } else {
        initFirebaseMessagingRegistration(true)
      }
    })

    const initFirebaseMessagingRegistration = deviceExists => {
      messaging
        .requestPermission()
        .then(() => {
          return messaging.getToken()
        })
        .then(token => {
          // console.log(token)

          if (!deviceExists) {
            this.$axios.$post('/user/devices', { token, type: 'web' }).then(res => {
              // console.log(res)
            })
          }
        })
      // .catch(err => {
      //   // console.log('User Chat Token Error' + err)
      // })
    }
  },
  getNotsCount(store) {
    if (!this.$auth.loggedIn) {
      return
    }
    store.commit('SET_INIT_STATUS', {
      getNotsCountInit: true,
    })
    const database = this.$fireModule.database()
    // console.log(database)
    const usersRef = database.ref(this.$auth.user.firebase.counter_notifications.channel)
    usersRef.on('value', snapshot => {
      // console.log('user was added !!')
      // console.log('user was added', snapshot, snapshot.val())
      store.dispatch('setHasNoty', snapshot.val())
    })
    usersRef.on('child_changed', snapshot => {
      // console.log('user was changed !!')
      // console.log(snapshot.val())
      // console.log('user was changed', snapshot, snapshot.val())
      store.dispatch('setHasNoty', snapshot.val())
    })
  },
  getVerifyStatus(store) {
    if (
      !this.$auth.loggedIn ||
      this.$auth.user.identity_verification_status.name === 'verified' ||
      !this.$auth.user.firebase.last_notification_type.enabled
    ) {
      return
    }
    store.commit('SET_INIT_STATUS', {
      getVerifyStatusInit: true,
    })

    const database = this.$fireModule.database()
    // console.log(database)
    const usersRef = database.ref(this.$auth.user.firebase.last_notification_type.channel)
    usersRef.on('value', snapshot => {
      // console.log('user was added !!')
      // console.log('user was added', snapshot, snapshot.val())
      const value = snapshot.val()
      console.log('getVerifyStatus value', value)
      if (value && value === 'identity-verification-status') {
        this.$axios.$post('/user/verifications/verified').then(resp => {
          this.$auth.fetchUser()
        })
      }
    })
    usersRef.on('child_changed', snapshot => {
      // console.log('user was changed !!')
      // console.log(snapshot.val())
      // console.log('user was changed', snapshot, snapshot.val())
      console.log('getVerifyStatus child_changed', snapshot.val())
    })
  },

  getData(store) {
    if (store.state.getDataInit) {
      return
    }
    this.$axios.$get('/data').then(({ data }) => {
      store.commit('SET_DATA', data)
      store.commit('SET_INIT_STATUS', {
        getDataInit: true,
      })
    })
  },
  getFavorites(store, data = {}) {
    this.$axios.$get('/user/favorites').then(r => {
      store.commit('SET_FAVORITES', r.data)
      data.onUpdate && data.onUpdate()
    })
  },

  setMq(store, mq) {
    store.commit('SET_MQ', mq)
  },
  setHasNoty(store, status) {
    store.commit('SET_NOTY_STATUS', status)
  },
}
