const TOKEN_KEY = "lahze_session_token";

const USER_ID_KEY = "lahze_user_id";



export function saveToken(
  token: string
) {

  localStorage.setItem(
    TOKEN_KEY,
    token
  );

}



export function getToken(): string | null {

  return localStorage.getItem(
    TOKEN_KEY
  );

}



export function saveUserId(
  userId: number
) {

  localStorage.setItem(
    USER_ID_KEY,
    String(userId)
  );

}



export function getUserId(): number | null {

  const userId = localStorage.getItem(
    USER_ID_KEY
  );


  if (!userId) {
    return null;
  }


  return Number(userId);

}



export function removeToken() {

  localStorage.removeItem(
    TOKEN_KEY
  );


  localStorage.removeItem(
    USER_ID_KEY
  );

}