import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';


export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	console.log("layout.ts");

	const supabase = createSupabaseLoadClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();


	const { data: profileName } = await supabase
		.from('profiles')                // target the 'profile' table
		.select('discord_tag')          // select only the 'discord_tag' column
		.eq('usersid', session?.user.id) // filter rows where 'userid' matches the one from session
		.single();

	return { supabase, session, profileName: profileName };
};
