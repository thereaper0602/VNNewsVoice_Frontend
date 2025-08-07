import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const endpoints = {
    'categories' : '/categories',
    'articles' : '/articles',
    'articleDetail': (slug, id) => `/${slug}_${id}`
}

export default axios.create({
    baseURL: BASE_URL
})