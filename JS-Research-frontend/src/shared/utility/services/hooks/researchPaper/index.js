import { useMutation } from 'react-query'

import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectAuthToken } from 'src/redux/reducers/authSlice'
import useAxios from 'src/shared/utility/services/hooks/useAxios'
import { researchPaper } from './routes'

const {
  authorAndYear,
  getResearchPaper,
  updateResearchPaper,
  updateResearchPaperFile,
  createResearchPaper,
  addFileToAWS,
  getResearchPaperById,
  getfiledetails,
  deleteResearchPaper,
  getPaperPDFById,
  deleteResearchPaperByID
} = researchPaper

export const useAuthorYearData = () => {
  const callApi = useAxios()
  const { url, method } = authorAndYear.get

  return useMutation(() => {
    return callApi({
      method: method,
      url: url
    }).then(response => {
      return response
    })
  })
}

export const useGetResearchPaperData = () => {
  const callApi = useAxios()
  const { url, method } = getResearchPaper.get

  return useMutation(data => {
    return callApi({
      method: method,
      url: url + `?${data.authors}&${data.yearOfPublication}&pageNo=${data.pageNo}&limit=${data.limit}`,
      params: data.otherQueryParams
    }).then(response => {
      return response
    })
  })
}

export const useSendFileData = () => {
  const callApi = useAxios()
  const { url, method } = getfiledetails.post
  const authToken = useSelector(selectAuthToken)

  return useMutation(data => {
    const header = { 'Access-Control-Allow-Headers': '*' }

    return axios
      .post(url, data, {
        headers: header
      })
      .then(response => {
        return response?.data
      })

    // }
  })
}

export const useSendFilePDF = () => {
  return useMutation(data => {
    const header = { 'Content-Type': 'multipart/form-data' }

    return axios.post(data?.url, data?.formData, { headers: header }).then(response => {
      return response
    })

    // }
  })
}

export const useCreateResearchPaperData = () => {
  const callApi = useAxios()
  const { url, method } = createResearchPaper.post
  const authToken = useSelector(selectAuthToken)

  return useMutation(data => {
    if (authToken) {
      return callApi({
        method: method,
        url: url,
        data: data
      }).then(response => {
        return response
      })
    } else {
      return axios.post(url, data).then(response => {
        return response?.data
      })
    }
  })
}

export const useResearchPaperPDF = () => {
  const callApi = useAxios()
  const { url, method } = getPaperPDFById.get

  return useMutation(data => {
    return callApi({
      method: method,
      url: url + data.id
    }).then(response => {
      return response
    })
  })
}

export const useResearchPaperById = () => {
  const callApi = useAxios()
  const { url, method } = getResearchPaperById.get

  return useMutation(data => {
    return callApi({
      method: method,
      url: url + data.id
    }).then(response => {
      return response
    })
  })
}

export const useUpdateResearchPaper = () => {
  const callApi = useAxios()
  const { url, method } = updateResearchPaper.put
  const authToken = useSelector(selectAuthToken)

  return useMutation(data => {
    if (authToken) {
      return callApi({
        method: method,
        url: url + data?.id,
        data: data?.data
      }).then(response => {
        return response
      })
    } else {
      return axios.put(url + data?.id, data?.data).then(response => {
        return response
      })
    }
  })
}

export const useDeleteResearchPaper = () => {
  const callApi = useAxios()
  const { url, method } = deleteResearchPaper.delete

  return useMutation(data => {
    return callApi({
      method: method,
      url: url,
      params: {
        fileuuid: data?.uuid
      }
    }).then(response => {
      return response
    })
  })
}

export const useDeleteResearchPaperByID = () => {
  const callApi = useAxios()

  const { url, method } = deleteResearchPaperByID.delete

  return useMutation(data => {
    return callApi({
      method: method,
      url: url + data.id,
      data: { reasonOfRejection: data?.reasonOfRejection }
    }).then(response => {
      return response
    })
  })
}

export const useUpdateResearchPaperFile = () => {
  const callApi = useAxios()
  const { url, method } = updateResearchPaperFile.put

  return useMutation(data => {
    return callApi({
      method: method,
      url: url + data.uuid,
      data: data?.data,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      return response
    })
  })
}
