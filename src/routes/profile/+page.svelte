<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	export let data: PageData;

	$: ({ session } = data);

	let discord_Tag: string | undefined;

	if (data.props.profile?.discord_tag) {
		discord_Tag = data.props.profile?.discord_tag;
	}

	onMount(() => {
		if (!session) {
			goto('/home');
		}
	});
</script>

<div class="flex flex-col items-center justify-center m-4">
	{#if session}
		<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center my-6">
			Personal Profile
		</h1>

		<form use:enhance action="?/saveTag" method="POST">
			<div class="form-control w-full max-w-xs flex space-x-4">
				<div>
					<label class="label">
						<span class="label-text">Discord Tag:</span>
						<input type="hidden" name="profileId" value={data.props.profile?.id} />
					</label>
					<div class="flex space-x-4 items-center">
						<input
							type="text"
							bind:value={discord_Tag}
							placeholder="Introduce your Discord Tag"
							class="input input-bordered w-full max-w-xs input-sm"
							name="discordTag"
						/>
						<button class="btn" type="submit">Save Tag</button>
					</div>
				</div>
			</div>
		</form>

		<div class="grid md:grid-cols-2 gap-4">
			<div>
				<h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center my-6">
					Games Owned
				</h2>
				{#if data.props.gamesOwned && data.props.gamesOwned.length > 0}
					<ul>
						{#each data.props.gamesOwned as game}
							<a
								href={`/games/${game.id}`}
								class="w-96 rounded flex my-2 items-center bg-base-300 shadow-xl transform transition duration-300 hover:scale-105"
							>
								<h1 class="flex-grow ml-3">{game.session_name}</h1>
								<figure class="ml-auto w-16 h-16">
									<img
										src={game.game_image}
										alt="Selected"
										class="object-cover w-full h-full rounded-md shadow-sm"
									/>
								</figure>
							</a>
						{/each}
					</ul>
				{:else}
					<p>No owned games found.</p>
				{/if}
			</div>

			<div>
				<h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center my-6">
					Games Booked
				</h1>

				{#if data.props.gamesBooked && data.props.gamesBooked.length > 0}
					<ul>
						{#each data.props.gamesBooked as game}
							<a
								href={`/games/${game.id}`}
								class="w-96 rounded flex my-2 items-center bg-base-300 shadow-xl transform transition duration-300 hover:scale-105"
							>
								<h1 class="flex-grow ml-3">{game.session_name}</h1>
								<figure class="ml-auto w-16 h-16">
									<img
										src={game.game_image}
										alt="Selected"
										class="object-cover w-full h-full rounded-md shadow-sm"
									/>
								</figure>
							</a>
						{/each}
					</ul>
				{:else}
					<p>No booked games found.</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
