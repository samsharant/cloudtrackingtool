// import axiosObservable from "axios-observable";
// import axiosPromise from "axios";

// import { axiosConfigOptions } from "./configs";
// import {
//   axiosRequestInterceptor,
//   axiosResponseInterceptor,
// } from "./interceptors";

// const axiosInstanceArr = [];

// function addInterceptors(axiosInstance) {
//   axiosInstance.interceptors.request.use(
//     axiosRequestInterceptor.onFulfilled,
//     axiosRequestInterceptor.onRejected
//   );

//   axiosInstance.interceptors.response.use(
//     axiosResponseInterceptor.onFulfilled,
//     axiosResponseInterceptor.onRejected
//   );

//   axiosInstanceArr.push(axiosInstance);
// }

// const axiosPromiseInstance = axiosPromise.create(axiosConfigOptions);
// addInterceptors(axiosPromiseInstance);

// const axiosObservableInstance = axiosObservable.create(axiosConfigOptions);
// addInterceptors(axiosObservableInstance);

// export default axiosObservableInstance;
// export { axiosPromiseInstance };
