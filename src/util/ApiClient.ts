import axios, { AxiosResponse } from 'axios'

export interface Data<T> {
  data: T
}

export interface DataClass {
  result: Result[]
  total: number
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
