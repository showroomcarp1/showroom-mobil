import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Handler middleware untuk proteksi route admin
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 1. Safety Guard: Jika Env Variables tidak terbaca, kembalikan response biasa
  // Mencegah crash Error 500 Vercel saat Edge Runtime
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase Environment Variables missing in Middleware!");
    return supabaseResponse;
  }

  // 2. Inisialisasi client dengan variabel yang dipastikan terdefinisi
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Redirect ke dashboard jika user SUDAH login tapi mencoba akses halaman login
  if (user && pathname.startsWith("/admin/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // Redirect ke login jika BELUM login tapi mencoba akses area admin
  if (!user && pathname.startsWith("/admin/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
