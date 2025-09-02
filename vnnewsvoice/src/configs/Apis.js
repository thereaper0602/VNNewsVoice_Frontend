import axios from 'axios';
import cookie from "react-cookies";

const BASE_URL = 'http://localhost:8080/api';

export const endpoints = {
    'categories' : '/categories',
    'generators' : '/generators',
    'articles' : '/articles',
    'articleDetail': (slug, id) => `articles/${slug}_${id}`,
    'totalArticleLike': (slug, id) => `articles/${slug}_${id}/article-like`,
    'isLikedArticle': (slug, id) => `/secure/articles/${slug}_${id}/is-liked`,
    'addArticleLike' : (slug, id) => `/secure/articles/${slug}_${id}/add-article-like`,
    'deleteArticleLike': (slug, id) => `/secure/articles/${slug}_${id}/delete-article-like`,
    'personalArticleLike': `/secure/article-likes`,
    'comments' : (slug, id) => `articles/${slug}_${id}/comments`,
    'postComment' : (slug, id) => `/secure/${slug}_${id}/post-comment`,
    'personalComment': `/secure/comments`,
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