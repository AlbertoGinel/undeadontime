import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';


export const load: PageServerLoad = async (event) => {
  try {
    const session = await event.locals.getSession();

    const profile = await prisma.profiles.findUnique({
      where: {
        usersid: session.user.id
      }
    });

    // Assuming you have a relation "owned_users" in your games model
    const gamesOwned = await prisma.games.findMany({
      where: {
        owned_users: {
          some: {
            id: profile?.id
          }
        }
      }
    });

    // Assuming you have a relation "booked_users" in your games model
    const gamesBooked = await prisma.games.findMany({
      where: {
        booked_users: {
          some: {
            user_id: profile?.id
          }
        }
      }
    });

    return {
      status: 200,  // You can adjust the status code as needed
      props: { profile, gamesBooked, gamesOwned }
    };

  } catch (error) {
    console.error("Error fetching profile:", error);
    return {
      status: 500,  // Internal server error status code
      props: {
        error: 'An error occurred in profile.'
      }
    };
  }
}

export const actions = {

  saveTag: async ({ request }) => {


    try {


      const formData = await request.formData();
      const discordTagValue = formData.get('discordTag') as string;
      const profileId = formData.get('profileId') as string;

      console.log("atiende: ", discordTagValue, profileId)

      const changeTag = await prisma.profiles.update({
        where: {
          id: profileId
        },
        data: {
          discord_tag: discordTagValue
        }
      })

      return { success: true, changeTag };
    } catch (error) {
      console.error("Error saving tag:", error);
      return {
        status: 500, // Internal server error status code
        body: { success: false, error: "Error occurred while saving tag" }
      };
    }
  }

};
