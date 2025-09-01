import axios from 'axios';
import cookie from "react-cookies";

const BASE_URL = 'http://localhost:8080/api';

export const endpoints = {
    'categories' : '/categories',
    'generators' : '/generators',
    'articles' : '/articles',
    'articleDetail': (slug, id) => `articles/${slug}_${id}`,
    'comments' : (slug, id) => `articles/${slug}_${id}/comments`,
    'postComment' : (slug, id) => `secure/${slug}_${id}/post-comment`,
    'relatedArticles' : (slug, id, limit) => `articles/${slug}_${id}/related?limit=${limit}`,
    'register' : '/user/register',
    'login' : '/user/login',
    "googleLogin": "/user/google-login",
    "profile": "/secure/profile",
    "updateProfile" : "/secure/profile",
    "changePassword": "/secure/change-password"
}

export const authApis = () => {
	return axios.create({
		baseURL: BASE_URL,
		headers: {
			Authorization: `Bearer ${cookie.load("token")}`,
		},
	});
};

export default axios.create({
    baseURL: BASE_URL
})