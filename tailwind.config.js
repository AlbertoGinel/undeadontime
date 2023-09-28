/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			backgroundColor: {
				'alert-green': '#36d399'
			}
		}
	},
	plugins: [require('daisyui')]
};
