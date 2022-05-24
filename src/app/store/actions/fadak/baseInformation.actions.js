/**
 * @author Mostafa Eftekhari 
 */

export const SET_USER = 'SET_USER';
export const SET_USERId = "SET_USERId"

export const setUser = (user) => ({
    type: SET_USER,
    payload: {user}
});
export const setUserId = (username , userId , partyRelationshipId , accountDisabled,isNewUser)  => ({
    type: SET_USERId,
    payload: {username ,userId,partyRelationshipId ,accountDisabled,isNewUser}
});
