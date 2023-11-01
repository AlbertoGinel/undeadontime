<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let data;

	//let { supabase, session } = data;
	$: ({ supabase, session, profileName } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	async function login() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: 'https://google.com',
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});
		if (error) {
			console.error('Error signing in:', error);
		}
	}

	async function logout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error signing out:', error);
		}
	}
</script>

{#if $page.url.pathname === '/cv'}
	<slot />
{:else}
	<div class="navbar bg-base-100 fixed top-0 w-full z-10">
		<div class="w-1/2 justify-center">
			<div class="dropdown">
				<label tabindex="0" class="btn btn-ghost lg:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h8m-8 6h16"
						/></svg
					>
				</label>
				<ul
					tabindex="0"
					class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
				>
					<li><a href="/games">Games</a></li>
					{#if session}
						<li><a on:click={logout}>Sign out</a></li>
					{/if}
					{#if session}
						<li><a href="/profile">Profile</a></li>
					{/if}
					<li><a href="/cv">CV</a></li>
				</ul>
			</div>
			<a href="/home" class="btn btn-ghost normal-case text-xl">Undead on time</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/games">Games</a></li>
				{#if session}
					<li><a href="/profile">Profile</a></li>
				{/if}
				<li><a href="/cv">CV</a></li>
				{#if session}
					<li><a on:click={logout}>Sign out</a></li>
				{/if}
			</ul>
		</div>
		<div class="w-1/2 justify-center">
			{#if session}
				{#if profileName?.discord_tag}
					<p>{profileName?.discord_tag}</p>
				{:else}
					<a href="/profile" class="btn btn-error">Update your discord Tag</a>
				{/if}
			{:else}
				<div>
					<a class="btn overflow-hidden truncate" on:click={login}>Google sign in</a>
				</div>
			{/if}
		</div>
	</div>

	<div class="h-16 lg:h-20" />

	<slot />
{/if}
