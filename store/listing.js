const getDefaultState = () => {
  return {
    step: 1,
    subStep: 1,

    id: '',
    // step 1
    currentStep: '',
    type_id: '',
    type_other: '',
    guests_size: 1,
    address_1: '',
    address_two: '',
    city: '',
    state: '',
    zip: '',
    place_id: '',
    // step 2
    amenities: [],
    amenities_other: '',
    images: [],
    description: '',
    title: '',
    rules: [],
    rules_other: '',
    integrations: {
      hostfully: {
        property_uid: '',
        active: false,
      },
    },
    // step 3
    rent_time_min: 1,
    weekdays: [
      {
        from: '09:00 AM',
        to: '10:00 PM',
      },
    ],
    weekends: [
      {
        from: '09:00 AM',
        to: '10:00 PM',
      },
    ],
    price: '',
    deposit: '',
    cleaning_fee: '',
  }
}

export const state = () => getDefaultState()

export const actions = {
  set(store, data) {
    store.commit('UPDATE', data)
  },
  resetState(store) {
    store.commit('RESET')
  },
  async submitStep(store, step) {
    const listing = localStorage.listing ? JSON.parse(localStorage.listing) : {}

    const {
      id,
      type_id,
      type_other,
      guests_size,
      address_1,
      address_two,
      city,
      state,
      zip,
      place_id,
      // step 2
      amenities,
      amenities_other,
      images,
      description,
      title,
      rules,
      rules_other,
      // step 3
      price,
      rent_time_min,
      weekdays,
      weekends,
      deposit,
      cleaning_fee,
      integrations,
    } = store.state

    const params = new FormData()

    console.log(integrations)

    params.append('hostfully_property_uid', integrations.hostfully.property_uid)
    params.append('type_id', type_id)
    type_other && params.append('type_other', type_other)
    params.append('guests_size', guests_size)
    params.append('place_id', place_id)
    if (address_two) {
      params.append('address_two', address_two)
    }
    params.append('address', [address_1, address_two, city, state, zip].join(' '))
    // if (step === 1 || !step) {
    //   // params = {
    //   //   type_id,
    //   //   guests_size,
    //   //   place_id,
    //   //   address: [address_1, address_two, city, state, zip].join(' '),
    //   // }
    // }
    if (step === 2 || step === 3 || !step) {
      // params = {
      //   amenities,
      //   description,
      //   title,
      //   rules,
      //   images: images[0],
      // }
      amenities &&
        amenities.forEach(id => {
          params.append('amenities[]', id)
        })
      amenities_other && params.append('amenities_other', amenities_other)
      description && params.append('description', description)
      title && params.append('title', title)
      rules &&
        rules.forEach(id => {
          params.append('rules[]', id)
        })
      rules_other && params.append('rules_other', rules_other)
    }
    if (step === 2 || !step) {
      images &&
        images.forEach(image => {
          if (!image.submited) {
            params.append('images[]', image.file)
          }
        })
    }
    if (step === 3 || !step) {
      // params = {
      //   price,
      //   deposit,
      //   cleaning_fee,
      // }
      if (weekdays.length) {
        weekdays.forEach((slot, i) => {
          params.append(`times[weekdays][${i}][from]`, slot.from)
          params.append(`times[weekdays][${i}][to]`, slot.to)
        })
      }
      if (weekends.length) {
        weekends.forEach((slot, i) => {
          params.append(`times[weekends][${i}][from]`, slot.from)
          params.append(`times[weekends][${i}][to]`, slot.to)
        })
      }

      rent_time_min && params.append('rent_time_min', rent_time_min)
      price && params.append('price', price)
      deposit && params.append('deposit', deposit)
      cleaning_fee && params.append('cleaning_fee', cleaning_fee)
    }

    try {
      const resp = await this.$axios({
        method: 'POST',
        url: id ? `/user/listings/${id}` : '/user/listings',
        headers: {
          Authorization:
            localStorage.getItem('auth._token.local') || `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        data: params,
      })

      if (resp.data.success) {
        const id = resp.data.data.id
        if (images) {
          store.dispatch('set', {
            images: images.map(image => ({ file: image.file, submited: true })),
          })
        }
        if (id) {
          store.dispatch('set', { id })

          if (step) {
            listing.id = id
            // localStorage.listing = JSON.stringify(listing)
          }
        }
      }
      return resp
    } catch (error) {
      return error.response.data
    }
  },
}

export const mutations = {
  UPDATE(state, data) {
    for (const [key, value] of Object.entries(data)) {
      // const listing = localStorage.listing ? JSON.parse(localStorage.listing) : {}
      // listing[key] = value
      state[key] = value
      // localStorage.listing = JSON.stringify(listing)
    }
  },
  RESET(state) {
    for (const [key, value] of Object.entries(getDefaultState())) {
      state[key] = value
    }
  },
}
