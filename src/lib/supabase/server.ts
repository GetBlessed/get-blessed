import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient() {
  return createServerClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieStore = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            if (key && value) {
              acc.push({ name: key, value: decodeURIComponent(value) });
            }
            return acc;
          }, [] as { name: string; value: string }[]);
          return cookieStore;
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieString = `${name}=${encodeURIComponent(value)}${
              options?.httpOnly ? '; HttpOnly' : ''
            }${options?.secure ? '; Secure' : ''}${
              options?.sameSite ? `; SameSite=${options.sameSite}` : ''
            }${options?.path ? `; Path=${options.path}` : ''}${
              options?.domain ? `; Domain=${options.domain}` : ''
            }${options?.maxAge ? `; Max-Age=${options.maxAge}` : ''}`;
            document.cookie = cookieString;
          });
        },
      },
    }
  );
}