
export const MY_WORKEFFORT = "MY_WORKEFFORT";


export const getWorkEffotr = (number = 0) => {
  return async (dispatch) => {
   
    
      await dispatch({
        type: MY_WORKEFFORT,
        payload: number,
      });
    
  };
};
