import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { v4 } from 'uuid';

const options = {
	db: {
		schema: 'public'
	},
	auth: {
		autoRefreshToken: true,
		persistSession: false,
		detectSessionInUrl: true
	},
	global: {
		headers: { 'x-my-custom-header': 'my-app-name' }
	}
};

const supabase = createClient(
	'https://hlkxosxqhseheconlqdl.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsa3hvc3hxaHNlaGVjb25scWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI4MDAwMTEsImV4cCI6MjAwODM3NjAxMX0.yXTfo712REfDWOI4R678RP_iD-gUQzHyzSEKAUxfqvI',
	options
);

const prisma = new PrismaClient();

async function createGame() {
	const newGame = await prisma.game.create({
		data: {
			session_name: 'D&D Campaign2',
			game_name: 'Dungeon and Dragons2',
			max_players: 15,
			duration: 3600,
			description: 'Segundo juego',
			game_time: new Date('2023-09-01T17:00:00-04:00'),
			game_image: 'gameImage'
		}
	});

	console.dir(newGame);
}

async function uploadImage() {
	const filePath = 'C:/Users/agine/OneDrive/Escritorio/No image.png';
	const file = fs.readFileSync(filePath);
	let name = 'randomname' + [...v4()].slice(0, 4).join('');

	const { data, error } = await supabase.storage
		.from('Main_bucket/images')
		.upload(name, file, { contentType: 'image/png' });
	if (error) {
		console.error('Error uploading image:', error);
	} else {
		console.log('Image uploaded successfully:', data);
	}

	console.dir('this is data');
	console.dir(data);
}

async function createGameWithImage() {
	const filePath = 'C:/Users/agine/OneDrive/Escritorio/No image.png';
	const file = fs.readFileSync(filePath);
	let name = 'randomname' + [...v4()].slice(0, 4).join('');

	const { data, error } = await supabase.storage
		.from('Main_bucket/images')
		.upload(name, file, { contentType: 'image/png' });
	if (error) {
		console.error('Error uploading image:', error);
	} else {
		console.log('Image uploaded successfully:', data);
	}

	const newGame = await prisma.game.create({
		data: {
			session_name: 'D&D Campaign2',
			game_name: 'Dungeon and Dragons2',
			max_players: 15,
			duration: 3600,
			description: 'Segundo juego',
			game_time: new Date('2023-09-01T17:00:00-04:00'),
			game_image:
				'https://svgnomywwuylcagvzbgs.supabase.co/storage/v1/object/public/Main_bucket/images/' +
				name
		}
	});
}

async function createGameWithImageSave() {
	const filePath = 'C:/Users/agine/OneDrive/Escritorio/No image.png';
	const file = fs.readFileSync(filePath);
	let name = 'randomname' + [...v4()].slice(0, 4).join('');

	try {
		const [uploadResult, gameCreationResult] = await Promise.all([
			supabase.storage.from('Main_bucket/images').upload(name, file, { contentType: 'image/png' }),
			prisma.games.create({
				data: {
					session_name: 'D&D Campaign3',
					game_name: 'Dungeon and Dragons2',
					max_players: 15,
					duration: 3600,
					description: 'Segundo juego',
					game_time: new Date('2023-09-01T17:00:00-04:00'),
					game_image:
						'https://hlkxosxqhseheconlqdl.supabase.co/storage/v1/object/public/Main_bucket/images/' +
						name,
					chip_list: {
						connect: [
							{ id: '89f9d6c3-df49-41dc-b813-560e93a4b247' },
							{ id: '3e1c755f-b0aa-498c-a4cb-c6c1943bcca6' }
						]
					},
					owned_users: {
						connect: [{ id: '8b254138-26eb-426d-b930-18f44c468e0f' }]
					}
				}
			})
		]);

		console.log('Image uploaded successfully:', uploadResult.data);
		console.log('Game created successfully:', gameCreationResult);
	} catch (error) {
		console.error('An error occurred:', error);
	}
}

async function createChip() {
	const newChip = await prisma.chips.create({
		data: {
			code: 'OPR',
			icon: '🎲',
			long_name: 'One page rules',
			description: 'the table top game...'
		}
	});
}

async function bookGame(usersid, gameid) {
	try {
		// 1. Get the associated profile for the given user ID
		const profile = await prisma.profiles.findFirst({
			where: {
				usersid: usersid
			}
		});

		// Check if the profile exists for the given user ID
		if (!profile) {
			console.error('Profile not found for user ID:', usersid);
			return;
		}

		// 2. Use the obtained profile's id to book a game
		const booking = await prisma.booked.create({
			data: {
				user_id: profile.id, // This is the ID from the profiles table
				game_id: gameid
			}
		});

		console.log('Booking created:', booking);
	} catch (error) {
		console.error('Error booking the game:', error);
	}
}

async function getProfileId(userId) {
	const profile = await prisma.profiles.findUnique({
		where: {
			usersid: userId
		},
		select: {
			id: true
		}
	});

	console.error('profile:', profile);
	return profile ? profile.id : null;
}

async function getProfilesReg() {
	try {
		const count = await prisma.profiles.count();
		console.log('count', count);
	} catch (error) {
		console.error('Error fetching user count:', error);
		throw error;
	}
}

async function deleteFile() {
	try {
		const { data, error } = await supabase.storage
			.from('Main_bucket')
			.remove(['images/gameImagec96e7ec8-5']);
		if (error) {
			throw error;
		}

		console.log('File deleted:', JSON.stringify(data));
	} catch (error) {
		console.error('Error deleting file:', error.message);
	}
}

async function getProfilesLoggedWeek() {
	try {
		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		const count = await prisma.profiles.count({
			where: {
				last_sign_in_at: {
					gte: oneWeekAgo
				}
			}
		});

		console.log('Profiles logged in the last 7 days:', count);
	} catch (error) {
		console.error('Error fetching user count:', error);
		throw error;
	}
}

async function main() {
	//const users = await prisma.users.findMany();
	//console.log(users);
	//console.dir(JSON.stringify(games));
	//createGame();
	//uploadImage();
	//createGameWithImage();
	//createGameWithImageSave();
	//createChip();
	//bookGame('1efbb25a-58e9-4ca1-8c8c-94b8c9fcd5ca', '683f78fa-9726-4254-b757-63f16c342781');
	//game
	//683f78fa-9726-4254-b757-63f16c342781
	//userId
	//1efbb25a-58e9-4ca1-8c8c-94b8c9fcd5ca
	//getProfileId('1efbb25a-58e9-4ca1-8c8c-94b8c9fcd5ca');
	//getProfilesReg();
	//getProfilesLoggedWeek();
	deleteFile();
}

//ain function that's invoked at the end of the script.
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

/*
const prisma = new PrismaClient({ log: ['query'] })
*/
