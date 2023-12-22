import axios, { AxiosError, AxiosResponse } from 'axios'

export interface Data<T> {
  data: T
}
export interface ColorValue {
  hexadecimal: string
  photo: any[]
}

export interface Product {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  content: string
  priceCut: null
  price: number
  slug: string
  sizes: string[]
  component: any[]
  stars: number
  viewCount: number
  gender: string
  tags: string[]
  stock: number
  status: string
  reviewsTotal: number
  deleted: boolean
  userId: number
  colorDefault: string
  categoryName?: string
}

export interface Categories {
  data: CategoriesData
}

export interface CategoriesData {
  result: CategoriesResult[]
  count: number
  total: number
}

export interface CategoriesResult {
  id: number
  createdAt: Date
  name: string
  generalCategory: boolean
  parentId: null
  userId: number
  deleted: boolean
  updatedAt: Date
}

export interface DataClass {
  result: Result[]
  total: number
}

type Messages = string | string[]
export interface ErrorResult {
  statusCode: number
  message: Messages
  timestamp: string
  path: string
}
export interface Result {
  id: number
  createdAt: Date
  email: string
  username: string
  firstname: string
  lastname: string
  phone: string
  role: string
  status: string
  avatar?: string
}

export interface DataAll<T> {
  result: T[]
  total: number
}

export interface userResult {
  id: number
  createdAt: Date
  email: string
  username: string
  firstname: string
  lastname: string
  phone: string
  role: string
  status: string
}

export interface LoginResponse {
  payload: Payload
  access_token: string
  refresh_Token: string
}

export interface Payload {
  id: number
  createdAt: Date
  email: string
  phone: string
  username: string
  firstname: string
  lastname: string
  role: string
  status: string
  updatedAt: Date
  avatar?: string
}

export interface Result {
  id: number
  createdAt: Date
  email: string
  username: string
  firstname: string
  lastname: string
  phone: string
  role: string
  status: string
}

export async function makeRequest<T>(url: string, data?: any) {
  try {
    const response = await axios
      .create({
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        },
      })
      .post<AxiosResponse<T>>(import.meta.env.VITE_BASE_URL + url, data)

    if (response?.status === 200) {
      return response.data.data
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ERR_BAD_REQUEST') {
      console.log('here', error)
      throw new Error('Invalido email o contraseña')
    }
    throw new Error('Problemas de Conexion')
  }
}

export async function sendDataToServer<T>(data: T, url: string, token?: string) {
  return await axios
    .post<T>(import.meta.env.VITE_BASE_URL + url, JSON.stringify(data), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .catch((err) => {
      throw err
    })
}

export async function sendUpdateDataToServer<T>(data: T, url: string, token?: string) {
  return await axios
    .patch<T>(import.meta.env.VITE_BASE_URL + url, JSON.stringify(data), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .catch((err) => {
      throw err
    })
}

export const handleErrors = async (error: AxiosError<ErrorResult>, message?: string) => {
  const errorData = error?.response?.data

  if (errorData?.statusCode === 400)
    return {
      toastTitle: 'Petición invalida',
      toastText: errorData.message as string,
    }

  if (errorData?.statusCode === 409)
    return {
      toastTitle: 'Conflicto en el Sistema',
      toastText: !message ? 'El nombre de  usuario, el correo o el teléfono están en el sistema.' : message,
    }

  if (errorData?.statusCode === 500)
    return {
      toastTitle: 'Error interno del Servidor',
      toastText: errorData?.message as string,
    }

  return {
    toastTitle: 'Error Unknown',
    toastText: `${error}- code: ${errorData?.statusCode}`,
  }
}

export async function getResponseAll(token: string, url: string, skip?: number, itemsPerPage?: number) {
  return (
    await axios.get(import.meta.env.VITE_BASE_URL + `${url}?skip=${skip}&take=${itemsPerPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data
}
export async function deleteResponseUser(token: string, url: string) {
  return (
    await axios.delete(import.meta.env.VITE_BASE_URL + `${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data
}

export async function findOneResponse(token: string, url: string) {
  return (
    await axios.get(import.meta.env.VITE_BASE_URL + `${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data
}

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Los meses en JavaScript empiezan en 0
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export async function uploadImagesProduct(id: number, cadena: string, formData: FormData, token: string) {
  const hexadecimal = encodeURIComponent(cadena)
  await axios.post(
    import.meta.env.VITE_BASE_URL + `/api/rest/v1/files/uploads/photo/${id}?hexadecimal=${hexadecimal}`,
    formData,
    {
      headers: {
        accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
