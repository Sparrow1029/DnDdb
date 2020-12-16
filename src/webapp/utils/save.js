import { request } from './requests'

const save = (charObj, location = 'local') => {
  switch (location) {
    case 'local':
      console.log('saving')
      localStorage.setItem(charObj.id, JSON.stringify(charObj));
      return true
    case 'remote':
      return request.patch(
        `/characters/${charObj.id}`,
        { data: charObj })
        .then(resp => {
          return resp.data
        })
        .catch(err => {
          console.log(err)
          return false
        })
  }
}

export default save