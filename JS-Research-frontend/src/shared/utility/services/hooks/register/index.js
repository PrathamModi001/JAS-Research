/* eslint-disable no-unused-vars */
import axios from 'axios'
import { useMutation } from 'react-query'

import { useDispatch } from 'react-redux'
import { removeAuthToken, setUser } from 'src/redux/reducers/authSlice'
import useAxios from 'src/shared/utility/services/hooks/useAxios'
import { authorization } from './routes'

const {
  register,
  verify,
  login,
  inviteSetPassword,
  user,
  me,
  invite,
  userUpdatePassword,
  forgotPassword,
  verifyOtp,
  updateForgotPassword,
  client,
  employee,
  company,
  powerbi,
  changeemail,
  verifychangeEmail,
  sausers
} = authorization

export const useSignup = () => {
  const { url } = register.post

  return useMutation(data => axios.post(url, data).then(response => response.data))
}

export const useVerifyEmail = () => {
  const { url } = verify.post

  return useMutation(data => axios.post(url, data).then(response => response.data))
}

export const useLogin = () => {
  const { url } = login.post

  return useMutation(data => axios.post(url, data).then(response => response.data))
}

export const useInviteeSetPassword = () => {
  const callApi = useAxios()
  const dispatch = useDispatch()

  const { url, method } = inviteSetPassword.post

  return useMutation(data => {
    return callApi({
      method: method,
      url: url,
      data // Include request data for POST request
    }).then(response => {
      dispatch(removeAuthToken())

      return response
    })
  })
}

export const useUserUpdatePassword = () => {
  const callApi = useAxios()

  const { url, method } = userUpdatePassword.post

  return useMutation(data => {
    return callApi({
      method: method,
      url: url,
      data // Include request data for POST request
    }).then(response => {
      return response
    })
  })
}

export const useUserForgotPassword = () => {
  const { url } = forgotPassword.post

  return useMutation(data =>
    axios.post(url, data).then(response => {
      return response.data
    })
  )
}

export const useUserVerifyOtp = () => {
  const { url } = verifyOtp.post

  return useMutation(data =>
    axios.post(url, data).then(response => {
      return response.data
    })
  )
}

export const useUserUpdateForgotPassword = () => {
  // const { url } = updateForgotPassword.post
  const { url, method } = updateForgotPassword.post
  const callApi = useAxios()

  return useMutation(data => {
    return callApi({
      method: method,
      url: url,
      data
    }).then(response => {
      return response
    })
  })
}

export const useUserData = () => {
  const callApi = useAxios()
  const { url, method } = user.get

  return useMutation(data => {
    return callApi({
      method: method,
      url: url,
      params: data
    }).then(response => {
      return response
    })
  })
}

export const useUpdateUserData = () => {
  const callApi = useAxios()
  const { url, method } = user.put

  return useMutation(data => {
    return callApi({
      method: method,
      url: `${url}${data.id}`,
      data: data
    }).then(response => {
      return response
    })
  })
}

export const useDeleteUser = () => {
  const callApi = useAxios()
  const { url, method } = user.delete

  return useMutation(data => {
    return callApi({
      method: method,
      url: `${url}${data}`
    }).then(response => {
      return response
    })
  })
}

export const useUserMe = () => {
  const callApi = useAxios()
  const dispatch = useDispatch()
  const { url, method } = me.get

  return useMutation(() => {
    return callApi({
      method: method,
      url: url
    }).then(data => {
      dispatch(setUser(data?.data?.user))

      return data
    })
  })
}

export const useUpdateUser = () => {
  const callApi = useAxios()
  const { url, method } = me.put

  return useMutation(data => {
    return callApi({
      method: method,
      url: url,
      data
    }).then(data => {
      return data
    })
  })
}

export const useGetCompany = () => {
  const callApi = useAxios()
  const { url, method } = company.get

  return useMutation(data => {
    return callApi({
      method: method,
      params: data,
      url: url
    }).then(data => {
      return data
    })
  })
}

export const useUpdateCompany = () => {
  const callApi = useAxios()
  const { url, method } = company.put

  return useMutation(data => {
    return callApi({
      method: method,
      url: url,
      data
    }).then(data => {
      return data
    })
  })
}

export const useInvite = () => {
  const callApi = useAxios()
  const { url, method } = invite.post

  return useMutation(data => {
    return callApi({
      method: method,
      url: url,
      data
    }).then(data => {
      return data
    })
  })
}

export const useSuperAdminUsers = () => {
  const callApi = useAxios()
  const { url, method } = sausers.get

  return useMutation(data => {
    return callApi({
      url: url,
      params: data,
      method: method
    }).then(response => {
      return response.data
    })
  })
}

export const useApproved = () => {
  const callApi = useAxios()
  const { url, method } = sausers.put

  return useMutation(data => {
    return callApi({
      method: method,
      url: `${url}/${data.params}`,
      data: data?.value
    }).then(data => {
      return data
    })
  })
}

export const useClient = () => {
  const callApi = useAxios()
  const { url, method } = client.get

  return useMutation(data => {
    return callApi({
      url: url,
      params: data,
      method: method
    }).then(response => {
      return response.data
    })
  })
}

export const useEmployee = () => {
  const callApi = useAxios()
  const { url, method } = employee.get

  return useMutation(data => {
    return callApi({
      url: url,
      params: data,
      method: method
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  })
}

export const usePowerBi = () => {
  const callApi = useAxios()
  const { url, method } = powerbi.get

  return useMutation(data => {
    return callApi({
      url: url,
      params: data,
      method: method
    }).then(response => {
      return response.data
    })
  })
}

export const useAddPowerBi = () => {
  const callApi = useAxios()
  const { url, method } = powerbi.post

  return useMutation(data => {
    return callApi({
      url: url,
      method: method,
      data
    }).then(response => {
      return response
    })
  })
}

export const useUpdatePowerBi = () => {
  const callApi = useAxios()
  const { url, method } = powerbi.put

  return useMutation(data => {
    return callApi({
      url: `${url}/${data?.id}`,
      method: method,
      data: data?.payload
    }).then(response => {
      return response
    })
  })
}

export const useDeletePowerBi = () => {
  const callApi = useAxios()
  const { url, method } = powerbi.delete

  return useMutation(data => {
    return callApi({
      url: `${url}/${data}`,
      method: method
    }).then(response => {
      return response
    })
  })
}

export const useChangeEmail = () => {
  const callApi = useAxios()
  const { url, method } = changeemail.post

  return useMutation(data => {
    return callApi({
      url: url,
      method: method,
      data
    }).then(response => {
      return response
    })
  })
}

export const useVerifyChangeEmail = () => {
  const callApi = useAxios()
  const { url, method } = verifychangeEmail.post

  return useMutation(data => {
    return callApi({
      url: url,
      method: method
    }).then(response => {
      return response
    })
  })
}
