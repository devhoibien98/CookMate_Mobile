import axiosInstance from './axiosInstance';

export const getUserById = async (userId: string) => {
  try {
    const res = await axiosInstance.get(`/users/${userId}`);
    return res.data;
  } catch (err) {
    console.error('Lỗi khi gọi getUserById:', err);
    throw err;
  }
};

export const updateUser = async (userId: string, userData: object) => {
  try {
    const res = await axiosInstance.put(`/users/${userId}`, userData);
    return res.data;
  } catch (err) {
    console.error('Lỗi khi gọi updateUser:', err);
    throw err;
  }
};
