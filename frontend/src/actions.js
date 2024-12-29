import axios from "axios";
import { useAuthStore } from "./store";
import { toast } from "react-toastify";

export const getUserData = async () => {
  const backendUrl = useAuthStore.getState().backendUrl;
  const setUserData = useAuthStore.getState().setUserData;
  const setIsLoggedIn = useAuthStore.getState().setIsLoggedIn;
  try {
    axios.defaults.withCredentials = true;
    const { data } = await axios.get(backendUrl + "/api/user/data");
    if (!data.success) {
      toast(data.message);
      return;
    }
    setIsLoggedIn(true);
    setUserData(data.userData);
    return;
  } catch (error) {
    toast(error.response.data.message);
  }
};
