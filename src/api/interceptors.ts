import axios, { type AxiosInstance } from 'axios'

const options = {
	baseURL: process.env.STORE_API_URL,
	headers: {
		Authorization: `Basic ${Buffer.from('Web:').toString('base64')}`,
		'Content-Type': 'application/json'
	}
}

export const store: AxiosInstance = axios.create(options)
