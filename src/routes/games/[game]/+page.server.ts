import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
  try {
    const session = await event.locals.getSession();
    const gameId = event.url.pathname.split('/').pop();


    // Fetch the game
    const game = await prisma.games.findUnique({
      where: {
        id: gameId
      },
      include: {
        booked_users: {
          include: {
            profile: true
          }
        },
        owned_users: true,
        chip_list: true
      }
    });

    if (!game) {
      return {
        props: {
          error: 'Game not found.'
        }
      };
    }

    let profile;

    if (session) {
      profile = await prisma.profiles.findUnique({
        where: {
          usersid: session.user.id
        }
      });

      if (!profile) {
        return {
          props: {
            game,
            error: 'Profile not found.'
          }
        };
      }
    }

    // Combine the results and return
    return {
      props: {
        game,
        profile: profile
      }
    };

  } catch (error) {
    return {
      props: {
        error: 'An error occurred while fetching the game or profile.'
      }
    };
  }
}



export const actions = {

  book: async ({ request }) => {

    const formData = await request.formData();

    console.log('formData', JSON.stringify(formData));

    const userid = formData.get('userid');
    const gameid = formData.get('gameid');

    console.log('userid', !!userid);
    console.log('gameid', !!gameid);

    console.log('userid', userid, 'gameid', gameid);

    try {
      // 1. Get the associated profile for the given user ID
      const profile = await prisma.profiles.findFirst({
        where: {
          usersid: userid as string
        }
      });
      // Check if the profile exists for the given user ID
      if (!profile) {
        console.error('Profile not found for user ID:', userid);
        return;
      }
      // 2. Check if the profile
      const bookingCount = await prisma.booked.count({
        where: {
          game_id: gameid as string,
          user_id: profile.id
        }
      });

      if (bookingCount > 0) {
        //is booked
        const deleteResponse = await prisma.booked.delete({
          where: {
            game_id_user_id: {
              game_id: gameid as string,
              user_id: profile.id
            }
          }
        });
        console.log('Booking deleted:', deleteResponse);
      } else {
        //not booked
        const booking = await prisma.booked.create({
          data: {
            user_id: profile.id,
            game_id: gameid as string
          }
        });
        console.log('Booking created:', booking);
      }
    } catch (error) {
      console.error('Error in the operation:', error);
    }

    return { success: true };

  },
};
