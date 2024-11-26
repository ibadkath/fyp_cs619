import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt'; // For checking token (authentication)

const secret = process.env.NEXTAUTH_SECRET; // This secret is needed to verify the token

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if(pathname === '/'){
    const url = req.nextUrl.clone();
    url.pathname = '/SignIn'; 
    return NextResponse.redirect(url);
  }
  // Get the session token (JWT) to determine if the user is authenticated
  const token = await getToken({ req, secret });

  // If the user is authenticated and trying to access the sign-in page, redirect to /UploadFile
  if (token && pathname === '/SignIn') {
    const url = req.nextUrl.clone();
    url.pathname = '/UploadFile'; // Redirect authenticated users to UploadFile
    return NextResponse.redirect(url);
  }

  // If the user is not authenticated and trying to access a protected route like /UploadFile, redirect to sign-in page
  const protectedRoutes = ['/UploadFile']; // List of protected routes
  if (!token && protectedRoutes.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/SignIn'; // Redirect unauthenticated users to the SignIn page
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed if none of the conditions matched
  return NextResponse.next();
}

// Define which routes this middleware applies to
export const config = {
  matcher: ['/','/SignIn', '/UploadFile','/((?!_next/static|favicon.ico).*)']// Apply to these pages
 
};