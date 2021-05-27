const http = require('./http');
const token = () => wx.getStorageSync('token');
const {
  baseApi
} = require('../config/env');

const env = () => wx.getStorageSync('env');
const baseUrl = `${baseApi[env()]}`;

// const financeUrl = `${baseApi[env()]}/v1`;
// 问题列表
const getQuestions = () => {
  let url = `${baseUrl}/titu/generateLxtiku`
  // console.log('url', url)
  return http.get(url)
}
const getQuestionsByIds = (ids) => {
  let url = `${baseUrl}/titu/queryResutlByIds?ids=${ids}`
  return http.get(url)
}
// 练习
const addCommonScore = (params) => {
  let url = `${baseUrl}/lxdfb/add`
  return http.post(url, {
    params: params
  })
}
// 考试
const addExamScore = (params) => {
  let url = `${baseUrl}/jsdfb/add`
  return http.post(url, {
    params: params
  })
}
// 练习记录list
const getPracticeList = (params) => {
  let url = `${baseUrl}/lxdfb/list`
  return http.get(url, {
    params: params
  })
}
// 考试记录
const getExamList = (params) => {
  let url = `${baseUrl}/jsdfb/list`
  return http.get(url, {params:params})
}

const getPractiveAnswers = (params) => {
  let url = `${baseUrl}/lxdfb/queryById?id=` + params.id
  return http.get(url)
}
const getExamAnswers = (params) => {
  let url = `${baseUrl}/jsdfb/queryById?id=` + params.id
  return http.get(url)
}
const getExams = (params) => {
  let url = `${baseUrl}/jsxmb/list`
  return http.get(url, {
    params: params
  })
}

const updateUserInfo = (params) => {
  let url = `${baseUrl}/user/userInfo`
  return http.get(url, {
    params: params
  })
}



module.exports = {
  getQuestions,
  addCommonScore,
  getPracticeList,
  getPractiveAnswers,
  getExamAnswers,
  getExamList,
  getQuestionsByIds,
  getExams,
  updateUserInfo,
  addExamScore
};