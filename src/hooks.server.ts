import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
//Module '"$env/static/public"' has no exported member 'PUBLIC_SUPABASE_ANON_KEY'.ts(2305)
//https://kit.svelte.dev/docs/modules#$env-dynamic-private
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';

export const handle = async ({ event, resolve }) => {

  console.log("hooks.server.ts");

  const supabaseServer = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event
  });
  event.locals.supabase = supabaseServer;


  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await supabaseServer.auth.getSession();
    return session;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
};
