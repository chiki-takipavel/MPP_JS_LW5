const apiUrl = 'http://localhost:8090/api';
export const endpoints = {
    getNews: id => `${apiUrl}/news/${id}`,
    putNews: id => `${apiUrl}/news/${id}`,
    deleteNews: id => `${apiUrl}/news/${id}`,
    postNews: `${apiUrl}/news`,
    getNewsList: `${apiUrl}/news`,
    iconsPath: `${apiUrl}/images/icons`,
    login: `${apiUrl}/login`,
    registration: `${apiUrl}/registration`
};
