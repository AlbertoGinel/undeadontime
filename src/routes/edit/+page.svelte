<script lang="ts">
	import type { PageData } from './$types';
	import type { chips } from '@prisma/client';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	$: ({ session } = data);

	let session_name: string | undefined;
	let game_name: string | undefined;
	let max_players: number | undefined = 2;
	let game_time: string | undefined = DateTime.now()
		.plus({ days: 7 })
		.toFormat("yyyy-MM-dd'T'HH:mm");

	let description: string | undefined;
	let selectedFiles: FileList | undefined;
	let chip_list: Partial<chips>[] | null = data.chip_list ?? null;
	let chipIds_selected: string[] = [];
	let chipsUnselected: Partial<chips>[] | null = null;
	let chipsSelected: Partial<chips>[] | null = null;
	let imageUrl: string | undefined;
	let newImage: string | null = null;
	let durationSeconds: number | undefined;
	let durationString: string | undefined = '01:00';

	if (data.game) {
		session_name = data.game?.session_name ?? undefined;
		session_name = data.game?.session_name ?? undefined;
		game_name = data.game?.game_name ?? undefined;
		max_players = data.game?.max_players;
		game_time = DateTime.fromJSDate(data.game?.game_time ?? new Date()).toFormat(
			"yyyy-MM-dd'T'HH:mm"
		);
		description = data.game?.description ?? undefined;
		imageUrl = data.game?.game_image;
		durationSeconds = data.game?.duration;
		chipIds_selected = data.game?.chip_list?.map((chip) => chip.id) || [];
	}

	async function handleSubmitSave(event: Event) {
		event.preventDefault();

		const formData = new FormData();

		if (data.game) {
			formData.append('game_id', data.game.id);
		}
		if (session_name) {
			formData.append('session_name', session_name);
		}
		if (game_name) {
			formData.append('game_name', game_name);
		}
		if (max_players !== undefined) {
			// assuming max_players is a number
			formData.append('max_players', max_players.toString());
		}
		const isoString = DateTime.fromISO(game_time as string).toISO();
		if (game_time && isoString) {
			formData.append('game_time', isoString);
		}
		if (description) {
			formData.append('description', description);
		}
		if (selectedFiles && selectedFiles.length > 0) {
			formData.append('selectedFile', selectedFiles[0]);
		}
		if (chipsSelected && chipsSelected.length > 0) {
			formData.append('chipsSelected', JSON.stringify(chipsSelected));
		}
		if (durationSeconds !== undefined) {
			formData.append('durationSeconds', durationSeconds.toString());
		}
		if (session?.user.id !== undefined) {
			formData.append('OwnerUserId', session.user.id.toString());
		}
		if (imageUrl) {
			const imageName = imageUrl.split('/').pop();

			if (imageName) {
				formData.append('previousImageName', imageName);
			}
		}

		const url = '?/update';

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error.message);
		}
		goto('/games/' + data.game?.id);
	}

	async function handleSubmitCreate(event: Event) {
		event.preventDefault();

		const formData = new FormData();

		if (session_name) {
			formData.append('session_name', session_name);
		}
		if (game_name) {
			formData.append('game_name', game_name);
		}
		if (max_players !== undefined) {
			// assuming max_players is a number
			formData.append('max_players', max_players.toString());
		}
		const isoString = DateTime.fromISO(game_time as string).toISO();
		if (game_time && isoString) {
			formData.append('game_time', isoString);
		}
		if (description) {
			formData.append('description', description);
		}
		if (selectedFiles && selectedFiles.length > 0) {
			formData.append('selectedFile', selectedFiles[0]);
		}
		if (chipsSelected && chipsSelected.length > 0) {
			formData.append('chipsSelected', JSON.stringify(chipsSelected));
		}
		if (durationSeconds !== undefined) {
			formData.append('durationSeconds', durationSeconds.toString());
		}
		if (session?.user.id !== undefined) {
			formData.append('OwnerUserId', session.user.id.toString());
		}
		if (imageUrl) {
			const imageName = imageUrl.split('/').pop();
			if (imageName) {
				formData.append('previousImageName', imageName);
			}
		}

		const url = '?/create';

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
			goto('/games');
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error.message);
		}
	}

	async function handleDelete(event: Event) {
		event.preventDefault();

		// Ensure a game is selected
		if (!data.game) {
			console.error('No game selected for deletion.');
			return;
		}

		const formData = new FormData();
		formData.append('game_id', data.game.id);

		const url = '?/delete'; // Adjust to your delete endpoint's path

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();

			if (result.success) {
				goto('/games');
				// Redirect or inform the user of successful deletion
				console.log('Game deleted successfully.');
				// Redirect to the games list or an appropriate page
			} else {
				goto('/games');
				console.error('Failed to delete the game.');
			}
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error.message);
		}
	}

	function addSelected(event: Event) {
		const target = event.target as HTMLSelectElement;
		const selectedId = target.value;
		if (selectedId !== '') {
			chipIds_selected = [...chipIds_selected, selectedId];
		}
	}

	function subtractSelected(chipId: string | undefined) {
		chipIds_selected = chipIds_selected.filter((id) => id !== chipId);
	}

	$: if (durationString !== undefined) {
		const time = DateTime.fromFormat(durationString, 'HH:mm');
		durationSeconds = time.hour * 3600 + time.minute * 60;
	}

	$: if (selectedFiles && selectedFiles.length > 0) {
		const file = selectedFiles[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			newImage = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	}

	$: if (chip_list && chip_list.length > 0) {
		chipsSelected = chip_list.filter((chip) => chip.id && chipIds_selected.includes(chip.id));
		chipsUnselected = chip_list.filter((chip) => chip.id && !chipIds_selected.includes(chip.id));
	} else {
		chipsSelected = [];
		chipsUnselected = chip_list ? [...chip_list] : [];
	}

	onMount(() => {
		if (!session) {
			goto('/home');
		}
	});
</script>

{#if session}
	<div class="flex justify-center items-center">
		<div class="flex flex-col items-center w-full max-w-6xl m-4">
			<form class="grid items-center grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
				<div class=" flex form-control w-full">
					<label class="label flex flex-col items-center">
						<span class="label-text">Session Name:</span>
						<input
							type="text"
							bind:value={session_name}
							placeholder="Session Name"
							class="input input-bordered w-full max-w-xs input-sm"
						/>
					</label>
				</div>

				<div class="form-control w-full">
					<label class="label flex flex-col items-cencter">
						<span class="label-text">Game Name:</span>

						<input
							type="text"
							bind:value={game_name}
							placeholder="Game Name"
							class="input input-bordered w-full max-w-xs input-sm"
						/>
					</label>
				</div>

				<div class="form-control w-full">
					<label class="label flex flex-col items-center">
						<span class="label-text">Max Players:</span>

						<input
							type="number"
							bind:value={max_players}
							placeholder="Max Players"
							min="2"
							class="input input-bordered w-full max-w-xs input-sm"
						/>
					</label>
				</div>

				<div class="form-control w-full">
					<label class="label flex flex-col items-center">
						<span class="label-text">Game Time:</span>

						<input
							type="datetime-local"
							bind:value={game_time}
							class="input input-bordered w-full max-w-xs input-sm"
						/>
					</label>
				</div>

				<div class="form-control w-full">
					<label class="label flex flex-col items-center">
						<span class="label-text">Duration (HH:mm):</span>

						<input
							type="time"
							bind:value={durationString}
							class="input input-bordered w-full max-w-xs input-sm"
						/>
					</label>
				</div>

				<div class="form-control w-full">
					<label class="label flex flex-col items-center">
						<span class="label-text">Game Image:</span>

						{#if imageUrl || newImage}
							<img
								src={newImage ? newImage : imageUrl}
								alt="Selected"
								class="object-contain w-full h-32 rounded-md shadow-sm mb-2"
							/>
						{/if}
						<input
							type="file"
							bind:files={selectedFiles}
							class="file-input input-bordered w-full"
						/>
					</label>
				</div>

				<div class="form-control w-full">
					<label for="chip-selector" class="label flex flex-col items-center">
						<span class="label-text">Choose a Chip:</span>

						{#if chipsUnselected && chipsUnselected.length > 0}
							<select
								id="chip-selector"
								on:click={addSelected}
								class="select select-bordered w-full"
							>
								<option value="" selected>Select a chip</option>
								{#each chipsUnselected as chip (chip.id)}
									<option value={chip.id}>{chip.code} {chip.icon} {chip.long_name}</option>
								{/each}
							</select>
						{:else}
							<p class="text-sm text-gray-500">No available chips to select</p>
						{/if}

						<div class="mt-4">
							<h3 class="text-xl mb-2">Selected chips:</h3>
							{#if chipsSelected && chipsSelected.length > 0}
								<ul class="list-disc pl-5">
									{#each chipsSelected as chip (chip.id)}
										{#if chip}
											<li class="mb-1">
												<button
													class="btn btn-xs btn-outline"
													on:click={() => subtractSelected(chip.id)}>{chip.code} {chip.icon}</button
												>
											</li>
										{/if}
									{/each}
								</ul>
							{:else}
								<p class="text-sm text-gray-500">No selected chips</p>
							{/if}
						</div>
					</label>
				</div>

				<div class="form-control w-full md:col-span-2">
					<label class="label flex flex-col items-center">
						<span class="label-text">Description:</span>

						<textarea
							bind:value={description}
							placeholder="Game Description"
							class="textarea textarea-bordered w-full"
							rows="10"
						/>
					</label>
				</div>
			</form>

			<!-- Action Buttons -->
			<div class="w-full max-w-xs mt-4">
				{#if data.game}
					<button type="button" on:click={handleSubmitSave} class="btn btn-primary w-full my-2"
						>Save game</button
					>
					<button type="button" on:click={handleDelete} class="btn btn-error w-full my-2"
						>Delete game</button
					>
				{:else}
					<button type="button" on:click={handleSubmitCreate} class="btn btn-primary w-full my-2"
						>Create game</button
					>
				{/if}
			</div>
		</div>
	</div>
{/if}
