// NextJS Imports
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'



// The domain of the API
const APIDOMAIN = process.env.API_DOMAIN;

// List of routes available to the public
// Middleware function will not be called on these
const publicRoutes = [
  '/auth/login',
]

// The default route to send users to once they are logged in
const defaultRoute = '/'

// The route to send users to 
const loginRoute   = '/auth/login'



/**
 * Middleware
 *
 * Runs before routes are loaded, and performs user authentication:
 *   - If user is not logged in, redirects to login page
 */
export default async function middleware(req: NextRequest) {

  // Check the intended next URL
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)

  // Check for an API session cookie
  const session = cookies().get('session')

  // If there's a session cookie, check it against the API to ensure it represents a
  // valid session (logged in, not expired)
  // If not, we know we'll need to authenticate, so we can skip this API call
  let userData = null
  if (session) {
    userData = await (
      await fetch(`${APIDOMAIN}/user`, {
        credentials: 'include',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Cookie": cookies().getAll().map(({name, value}) => `${name}=${value}`).join('; '),
        }
      })
    ).json()
  }

  // If user not logged in, redirect to the login route
  if (!isPublicRoute && !(userData)) {
    return NextResponse.redirect(new URL(loginRoute, req.nextUrl))
  }

  // If user is logged in, redirect login page to default route
  const response = (isPublicRoute && userData)
    ? NextResponse.redirect(new URL(defaultRoute, req.nextUrl))
    : NextResponse.next()

  // Add the retrieved user data to the response object, so we can use it to render the new page
  response.cookies.set( 'userData', JSON.stringify(userData) )

  // Return the next page
  return response
}


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$).*)'],
}
