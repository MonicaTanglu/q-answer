const token = () => wx.getStorageSync('token');
const app = getApp()
const extractData = (res, originMessage) => {
  let data = res.data;
  if (originMessage) return data;
  if (data.code !== 200 && data.code !== 201 && data.code !== 204) {
    let reason = data.message || '出错了';
    wx.showToast({
      title: reason,
      icon: 'none',
      duration: 2000,
    });
    if(data.code === 511) {
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }, 1000);
    }
    return null;
  } else {
    return res.data.result ? res.data.result : true;
  }
};

const handleError = (error) => {
  let errorString = error.errMsg || '出错了';
  wx.showToast({
    title: errorString,
    icon: 'none',
    duration: 2000,
  });
  return null;
};

const get = (url, {
  params = {},
  headers = {}
} = {}, originMessage = false) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: params,
      header: Object.assign({
        'X-Access-Token': token()
      }, headers),
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => resolve(extractData(res, originMessage)),
      fail: (res) => resolve(handleError(res)),
    });
  });
}
const post = (url, {
    params = {},
    headers = {}
  } = {}, originMessage = false) =>
  new Promise((resolve, reject) => {
    wx.request({
      url,
      data: params,
      header: Object.assign({
        'X-Access-Token': token()
      }, headers),
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => resolve(extractData(res, originMessage)),
      fail: (res) => reject(handleError(res)),
    });
  });

const put = (url, params, originMessage = false) =>
  new Promise((resolve, reject) => {
    wx.request({
      url,
      data: params,
      header: {
        'X-Access-Token': token()
      },
      method: 'PUT',
      dataType: 'json',
      responseType: 'text',
      success: (res) => resolve(extractData(res, originMessage)),
      fail: (res) => handleError(res),
    });
  });

const del = (url, {
    params = {},
    headers = {}
  } = {}, originMessage = false) =>
  new Promise((resolve, reject) => {
    wx.request({
      url,
      data: params,
      header: Object.assign({
        'X-Access-Token': token()
      }, headers),
      method: 'DELETE',
      dataType: 'json',
      responseType: 'text',
      success: (res) => resolve(extractData(res, originMessage)),
      fail: (res) => handleError(res),
    });
  });

const patch = (url, params, originMessage = false) => {
  new Promise((resolve, reject) => {
    wx.request({
      url,
      data: params,
      header: {
        'X-Access-Token': token()
      },
      method: 'PATCH',
      dataType: 'json',
      responseType: 'text',
      success: (res) => resolve(extractData(res, originMessage)),
      fail: (res) => handleError(res),
    });
  });
}

const upload = (url, file) =>
  new Promise((resolve, reject) => {
    wx.uploadFile({
      url,
      name: 'file',
      header: {
        'X-Access-Token': token()
      },
      filePath: file.path,
      success: (res) => resolve(res),
      file: (res) => handleError(res),
    });
  });

module.exports = {
  get,
  post,
  put,
  del,
  patch,
  upload,
};