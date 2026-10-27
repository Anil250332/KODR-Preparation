const AUTH_STORAGE_KEY = 'data-routing-authenticated'

export const isAuthenticated = () =>
  localStorage.getItem(AUTH_STORAGE_KEY) === 'true'

export const logIn = () => {
  localStorage.setItem(AUTH_STORAGE_KEY, 'true')
}

export const logOut = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
