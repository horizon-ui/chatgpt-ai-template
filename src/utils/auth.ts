// Adapted from https://stackoverflow.com/a/65374098
export function getCookie(key: string): string {
  const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? (b.pop() ?? "") : "";
}


export function login(gotoURL: RequestInfo | URL = '') {

  // Define the return API URL after a successful login
  if (!gotoURL) {
    gotoURL = `${process.env.API_DOMAIN}/auth/login`;
  }

  // Redirect to the SSO provider
  const login_url = `${ process.env.SSO_URL }?goto=${ gotoURL }`;
  window.location.href = login_url;
}
