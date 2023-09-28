import type { LayoutServerLoad } from './$types';
import prisma from '$lib/server/prisma';



export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
	console.log("layout.server.ts");

	//TypeError: Cannot read properties of null (reading 'user')

	const session = await getSession();

	if (session && session.user) {
		console.log("userID", session.user.id);

		try {
			const profile = await prisma.profiles.update({
				where: {
					usersid: session.user.id
				},
				data: {
					last_sign_in_at: new Date()
				}
			});
		} catch (error) {
			console.error("Error updating profile:", error);
		}
	} else {
		console.warn("No user found in session.");
	}

	return {
		session
	};
};


