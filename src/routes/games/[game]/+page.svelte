<script lang="ts">
	import type { PageData } from './$types';
	import { DateTime, Duration } from 'luxon';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { copyText } from 'svelte-copy';
	import CopyDTag from '../../../components/copyDTag.svelte';

	export let data: PageData;

	$: ({ session } = data);

	const gameId = $page.params.game;

	function daysUntil(then: DateTime) {
		const now = DateTime.now();

		if (!then.isValid) {
			return null;
		}

		if (then <= now) {
			return 'none';
		}

		return then.diff(now, 'days').days.toFixed(0); // rounds to the nearest whole number
	}
</script>

<svelte:head>
	{#if data.props.game?.session_name}
		<meta property="og:title" content={data.props.game.session_name} />
	{/if}

	{#if data.props.game?.game_time}
		<meta
			property="og:description"
			content={`(${daysUntil(DateTime.fromJSDate(data.props.game?.game_time))} days left)`}
		/>
	{/if}

	{#if data.props.game?.game_image}
		<meta property="og:image" content={data.props.game.game_image} />
		<meta property="og:image:height" content="800" />
	{/if}

	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="Undead on time" />
</svelte:head>

{#if data.props.error}
	<p>{data.props.error}</p>
{:else if data.props.game}
	<div>
		<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center my-6">
			{data.props.game?.session_name}
		</h1>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 mt-4">
			<!-- Image -->

			<div class="flex">
				<img
					src={data.props.game?.game_image}
					alt="Game cover"
					class="w-full h-auto object-contain sm:rounded-lg"
				/>
			</div>

			<!-- Data -->
			<div class="m-10">
				<h2 class="text-3xl my-4 ml-4 text-center">{data.props.game?.game_name}</h2>

				<div class="flex justify-between mt-4 mx-10">
					<div class="flex flex-col items-center">
						<div class="flex justify-between items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-5 h-5"
							>
								<path
									fill-rule="evenodd"
									d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
									clip-rule="evenodd"
								/>
							</svg>
							<span
								>{DateTime.fromJSDate(data.props.game?.game_time).toFormat('HH:mm dd/MM/yy')}</span
							>
						</div>
						<div>
							<span class="text-xs"
								>{`(${daysUntil(DateTime.fromJSDate(data.props.game?.game_time))} days left)`}</span
							>
						</div>
					</div>

					<div class="flex justify-between items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
								clip-rule="evenodd"
							/>
						</svg>

						<span>
							{Duration.fromObject({ seconds: data.props.game?.duration }).toFormat('hh:mm')}
						</span>
					</div>

					<div class="flex justify-between items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5"
						>
							<path
								d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z"
							/>
						</svg>
						<p>{data.props.game?.booked_users.length}/{data.props.game?.max_players}</p>
					</div>
				</div>

				<div class="flex justify-end my-2">
					{#each data.props.game?.chip_list as chip}
						<p class="badge badge-outline">{chip.code}{chip.icon}</p>
					{/each}
				</div>

				<span>Owners</span>

				{#each data.props.game?.owned_users as owner, index}
					{#if owner.discord_tag}
						<div class="flex items-center ml-5">
							<span class="mr-2">{owner.discord_tag}</span>

							<CopyDTag discord_tag={owner.discord_tag} />
						</div>
					{:else}
						<p>owner without discord_tag</p>
					{/if}
				{/each}

				<p>Players: {data.props.game?.booked_users.length}/{data.props.game?.max_players}</p>

				{#each data.props.game?.booked_users as player}
					{#if player.profile.discord_tag}
						<div class="flex items-center ml-5">
							<span>{player.profile.discord_tag}</span>

							<CopyDTag discord_tag={player.profile.discord_tag} />

							<div class="flex flex-col items-center">
								<span class="text-xs"
									>{DateTime.fromJSDate(player.created_at).toFormat('HH:mm')}</span
								>
								<span class="text-xs"
									>{DateTime.fromJSDate(player.created_at).toFormat('dd/MM/yy')}</span
								>
							</div>
						</div>
					{:else}
						<p>player without discord_tag</p>
					{/if}
				{/each}
				<div class="flex flex-row">
					<form use:enhance action="?/book" method="POST">
						{#if session}
							<button class="btn mt-2" type="submit">
								{data.props.game?.booked_users.some(
									(profile) => profile.profile.id === data.props.profile?.id
								)
									? 'Unbook'
									: 'Book'}
							</button>
						{/if}
						<input type="hidden" name="userid" value={session?.user.id} />
						<input type="hidden" name="gameid" value={data.props.game?.id} />
					</form>
					{#if data.props.game?.owned_users.some((profile) => profile.id === data.props.profile?.id)}
						<a class="btn mt-2 ml-2" href={`/edit?id=${gameId}`}>Edit Game</a>
					{/if}
				</div>
			</div>
			<!-- Description -->
			<div class="">
				<p>{data.props.game?.description}</p>
			</div>
			<!-- Empty div -->
			<div />
		</div>
	</div>
{/if}
