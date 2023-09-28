<script lang="ts">
	import type { PageData } from './$types';
	import Technology from './technology.svelte';
	import Experience from './experience.svelte';

	export let data: PageData;

	let pdfUrl = '/cv/Alberto Ginel Aug 23.pdf';
</script>

<div>
	<div>
		<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center my-6">
			Alberto Ginel
		</h1>

		<h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center my-6">
			Full Stack Software Developer
		</h1>
	</div>

	<div class="flex flex-col sm:flex-row items-center justify-center sm:align-center">
		<div
			class="flex items-center justify-center sm:mr-10"
			style="animation: fadeInSlideIn 0.5s forwards;"
		>
			<img src="/cv/alberto.png" alt="Alberto Ginel" />
		</div>

		<div class="flex flex-col items-center justify-center my-5">
			<div class="rounded bg-base-300 p-4 text-lg">
				<div>
					<p>📍 Tallinn, Estonia</p>
				</div>
				<div>
					<p>🗣️ English, Spanish</p>
				</div>
				<div>
					<p>Work permit: EU 🇪🇺, UK 🇬🇧</p>
				</div>
				<div>
					<p>📱 +372 5696 3885</p>
				</div>
				<div>
					<p>📧 aginelsalvador@gmail.com</p>
				</div>
				<div>
					<a class="hover:text-clear" href="https://www.linkedin.com/in/aginelsalvador/"
						>🧑‍💼 LinkedIn</a
					>
				</div>
				<div>
					<a class="hover:text-clear" href="https://github.com/AlbertoGinel">👨‍💻 Github</a>
				</div>
			</div>

			<a href={pdfUrl} download target="_blank">
				<button class="btn mt-4">See CV</button>
			</a>
		</div>
	</div>

	<div class="flex flex-col items-center justify-center my-5">
		<h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center my-6">
			Technologies used
		</h1>
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
			<Technology image="/cv/js.png" name="JavaScript" level={5} />
			<Technology image="/cv/react.png" name="React" level={5} />
			<Technology image="/cv/gitlogo.png" name="Git" level={4} />
			<Technology image="/cv/firebase.png" name="Firebase" level={3} />
			<Technology image="/cv/svelte.png" name="SvelteKit" level={3} />
			<Technology image="/cv/ts.png" name="TypeScript" level={3} />
			<Technology image="/cv/sql.png" name="SQL" level={3} />
			<Technology image="/cv/supalogo.png" name="Supabase" level={3} />
			<Technology image="/cv/tailwind.png" name="Tailwind CSS" level={2} />
			<Technology image="/cv/java.png" name="Java" level={2} />
			<Technology image="/cv/springboot.png" name="Springboot" level={2} />
			<Technology image="/cv/redux.png" name="Redux" level={2} />
			<Technology image="/cv/prisma.png" name="Prisma" level={2} />
			<Technology image="/cv/next.png" name="NextJS" level={2} />
			<Technology image="/cv/PhaserLogo.png" name="Phazer" level={1} />
			<Technology image="/cv/pixiLogo.png" name="Pixi.js" level={1} />
		</div>
	</div>

	<div class="flex flex-col items-center justify-center my-5">
		<h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center my-6">
			Professional Experience
		</h1>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
			<Experience
				image="/cv/coin.png"
				line1="Frontend developer React, Typescript, Material UI, GIT"
				line2="Coinmetro"
				line3="Aug 2022 – Jan 2023 (Estonia 🇪🇪)"
				description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
			/>

			<Experience
				image="/cv/iquad.png"
				line1="Fullstack developer React, Java, SQL, Spring Boot, MVC"
				line2="IQUAD"
				line3="Aug 2021 – Apr 2022 (UK 🇬🇧)"
				description=""
			/>

			<Experience
				image="/cv/solomon.png"
				line1="Design and Technology Teacher Secondary School"
				line2="Kantor King Solomon High School"
				line3="Sep 2018 – Sep 2020 (UK 🇬🇧)"
			/>

			<Experience
				image="/cv/jask.png"
				line1="Teacher"
				line2="Jaskółka Democratic School"
				line3="Mar 2017 – May 2018 (Poland 🇵🇱)"
			/>

			<Experience
				image="/cv/salle.png"
				line1="Computer Science Teacher, Professional Training"
				line2="School La Salle Sagrado Corazón"
				line3="Sep 2014 – Dec 2016 (Spain 🇪🇸)"
			/>
		</div>
	</div>

	<div class="flex flex-col items-center justify-center my-5">
		<h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center my-6">
			Education
		</h1>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
			<Experience
				image="/cv/itswitch.png"
				line1="Full stack developer Traineeship HTML5, CSS3, JS, React, Java, SQL, PHP"
				line2="IT Career Switch Ltd"
				line3="Sep 2020 – July 2021 (UK 🇬🇧)"
			/>
			<Experience
				image="/cv/vitoria.png"
				line1="Master of Teaching in Secondary Education"
				line2="Universidad Francisco de Vitoria"
				line3="2013 – 2014 (Spain 🇪🇸)"
			/>
			<Experience
				image="/cv/uni.png"
				line1="Bachelor's Degree in Computer Engineering"
				line2="Universidad Complutense Madrid"
				line3="2007-2013 (Spain 🇪🇸)"
			/>
		</div>
	</div>
</div>
