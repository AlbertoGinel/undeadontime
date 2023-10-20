<script lang="ts">
	import { compute_rest_props } from 'svelte/internal';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<!-- Essential Open Graph tags -->
	<meta property="og:title" content="Undead on time" />
	<meta property="og:description" content="Plan and book your online game board sessions" />
	<meta
		property="og:image"
		content="https://hlkxosxqhseheconlqdl.supabase.co/storage/v1/object/public/Main_bucket/images/pawn.png"
	/>

	<!-- Optional tags -->
	<meta property="og:type" content="website" />
	<!-- Can be 'website', 'article', 'video', etc. -->
</svelte:head>

<div class="mx-2 flex flex-col items-center">
	<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center my-6">
		UNDEAD ON TIME
	</h1>

	<div class="flex justify-center items-center m-10">
		<div class="inline-flex flex-col text-center rounded bg-alert-green px-5 py-2 text-black">
			<span>Users registered: <strong>{data.props.profilesTotal}</strong></span>
			<span>Users logged in the last 7 days: <strong>{data.props.profilesWeek}</strong></span>
		</div>
	</div>

	<div class=" flex flex-col max-w-7xl">
		<div class="flex flex-col sm:flex-row justify-between items-center shadow p-4">
			<div class="order-1 sm:order-2" />
			<img
				src="/gameboard2.gif"
				alt="online game"
				class="max-w-xl rounded-lg shadow-2xl order-3 sm:order-1 w-full sm:w-1/2"
			/>
			<div class="flex flex-col order-2 sm:order-3 w-full sm:w-1/2 text-center mx-10">
				<h1 class="text-3xl font-bold">For online game board players</h1>
				<p class="py-6">
					There are online tools that allow us to play our favorite board games with anyone in the
					world.
				</p>
			</div>
		</div>

		<div class="flex flex-col sm:flex-row justify-between items-center shadow p-4">
			<div class="w-full sm:w-1/2 text-center mx-10">
				<h1 class="text-3xl font-bold">Looking for online players</h1>
				<p class="py-6">
					But then we don't have tools for planning the games. We mostly use Discord chats, but many
					times it doesn't help us find players on time.
				</p>
			</div>
			<img
				src="/chat.png"
				alt="online game"
				class="max-w-xl rounded-lg shadow-2xl w-full sm:w-1/2"
			/>
		</div>

		<div class="flex flex-col sm:flex-row justify-between items-center shadow p-4">
			<div class="order-1 sm:order-2" />
			<img
				src="/game.png"
				alt="online game"
				class="max-w-xl rounded-lg shadow-2xl order-3 sm:order-1 w-full sm:w-1/2"
			/>
			<div class="order-2 sm:order-3 w-full sm:w-1/2 text-center mx-10">
				<h1 class="text-3xl font-bold">Let's plan ahead with Undead on Time!</h1>
				<p class="py-6">
					I created this simple page to allow us to propose dates for playing. You can log in with
					Google, create games, or join existing ones. The platform shows how many people have
					joined, the scheduled time in your timezone, and their Discord tags for easy contact
				</p>
				<a href="/games" class="btn btn-primary">See the game sessions</a>
			</div>
		</div>

		<div class="flex flex-col sm:flex-row justify-between items-center shadow p-4">
			<div class="flex flex-col items-center w-full sm:w-1/2 text-center mx-10 mb-1">
				<h1 class="text-3xl font-bold">By using the page you are helping me</h1>
				<p class="py-6">
					Im an unemployed software developer looking for a job I made this page to showcase my
					abilities, when you use Undead On Time you are helping me to demostrate my skills to my
					future employer.
				</p>
				<a href="/cv" class="btn btn-primary">See my CV</a>
			</div>
			<img src="/JOB.png" alt="online game" class="max-w-xl w-full sm:w-1/2" />
		</div>
	</div>
</div>
