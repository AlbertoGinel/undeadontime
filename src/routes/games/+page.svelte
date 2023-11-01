<script lang="ts">
	import type { PageData } from './$types';
	import { DateTime, Duration } from 'luxon';

	export let data: PageData;

	$: ({ session } = data);

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

	let filteredAndSortedGames = data.games
		.filter((game) => {
			const gameTime = DateTime.fromJSDate(game.game_time);
			return gameTime > DateTime.now();
		})
		.sort((gameA, gameB) => {
			const timeA = DateTime.fromJSDate(gameA.game_time).valueOf();
			const timeB = DateTime.fromJSDate(gameB.game_time).valueOf();
			return timeA - timeB;
		});
</script>

{#if session}
	<div class="flex justify-center items-center my-4">
		<a class="btn" href="/edit">Create New Game</a>
	</div>
{/if}

{#if filteredAndSortedGames.length < 1}
	<div class="flex flex-col items-center justify-center">
		<h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center my-6">No Games</h1>
	</div>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 col-gap-20 mx-4">
		{#each filteredAndSortedGames as game}
			<a
				href={`games/${game.id}`}
				class="card bg-base-300 shadow-xl transform transition duration-300 hover:scale-105"
			>
				<figure class="relative pb-[56.25%]">
					<!-- This padding-bottom sets the 16:9 aspect ratio -->
					<img
						src={game.game_image}
						alt="Game cover"
						class="absolute w-full h-full object-cover top-0 left-0"
					/>
				</figure>

				<div class="card-body">
					<h2 class="card-title">{game.session_name}</h2>
					<p>{game.game_name}</p>
					<div class="flex justify-between">
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
								<span>{DateTime.fromJSDate(game.game_time).toFormat('HH:mm dd/MM/yy')}</span>
							</div>
							<div>
								<span class="text-xs"
									>{`(${daysUntil(DateTime.fromJSDate(game.game_time))} days left)`}</span
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
								{Duration.fromObject({ seconds: game.duration }).toFormat('hh:mm')}
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
							<p>{game.booked_users.length}/{game.max_players}</p>
						</div>
					</div>
					<div class="card-actions justify-end">
						{#each game.chip_list as chip}
							<div class="badge badge-outline">{chip.code}{chip.icon}</div>
						{/each}
					</div>
				</div>
			</a>
		{/each}
	</div>
{/if}
