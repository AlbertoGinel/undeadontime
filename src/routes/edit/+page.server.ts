import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';
import { DateTime } from 'luxon';
import { v4 } from 'uuid';
import supabase from '$lib/server/supabase';



export const load: PageServerLoad = async (event) => {
  const myParam = event.url.searchParams.get("id");

  let game = null;

  try {
    if (myParam) {
      //asegurarse de que es dueno id the user
      const session = await event.locals.getSession();
      const profile = await prisma.profiles.findUnique({
        where: {
          usersid: session.user.id
        }
      });

      if (profile) {
        const gameWithProfileAsOwner = await prisma.games.findFirst({
          where: {
            owned_users: {
              some: {
                id: profile.id
              }
            }
          }
        });

        //puedes cargar el juego

        game = await prisma.games.findFirst({
          where: { id: myParam },
          include: {
            chip_list: true
          }
        });

      }
    }


    const chip_list = await prisma.chips.findMany();


    return {
      chip_list: chip_list,
      game: game
    };
  } catch (error) {
    return {
      props: {
        error: 'An error occurred while fetching data.'
      }
    };
  }
};



export const actions = {

  create: async ({ request }) => {

    const formData = await request.formData();

    const sessionName = formData.get('session_name');
    const gameName = formData.get('game_name');
    const maxPlayers = formData.get('max_players');
    const gameTime = formData.get('game_time') as string;
    const description = formData.get('description');
    const selectedFile = formData.get('selectedFile');
    const chipsSelected = formData.get('chipsSelected');
    const parsedChipsSelected = chipsSelected ? JSON.parse(chipsSelected as string) : null;
    const durationSeconds = formData.get('durationSeconds');

    const tempDateTime = DateTime.fromISO(gameTime).toJSDate();
    console.log(tempDateTime);

    if (selectedFile === null) {
      return { success: false };
    }

    const { id: profileId } = await prisma.profiles.findFirst({
      where: {
        usersid: formData.get('OwnerUserId') as string
      },
      select: {
        id: true
      }
    });

    const name = 'gameImage' + [...v4()].slice(0, 10).join('');
    const route = 'https://hlkxosxqhseheconlqdl.supabase.co/storage/v1/object/public/Main_bucket/images/' + name;
    let newGameId = '';
    try {
      const uploadPromise = supabase.storage.from('Main_bucket/images').upload(name, selectedFile, { contentType: 'image/png' });

      const gameCreationPromise = prisma.games.create({
        data: {
          session_name: sessionName as string,
          game_name: gameName as string,
          max_players: Number(maxPlayers),
          duration: Number(durationSeconds),
          description: description as string,
          game_time: tempDateTime,
          game_image: route,
          chip_list: {
            connect: parsedChipsSelected ? parsedChipsSelected.map((item: { id: any; }) => ({ id: item.id })) : []
          },
          owned_users: {
            connect: profileId ? [{ id: profileId }] : undefined
          }

        }
      });

      const [gameCreationResult, uploadResult] = await Promise.all([gameCreationPromise, uploadPromise]);


      newGameId = gameCreationResult.id;

      console.log(newGameId);
      console.log('Image uploaded successfully:', uploadResult);
      console.log('Game created successfully:', gameCreationResult);
    } catch (error) {
      console.error('An error occurred:', error);
    }

    return { success: true, newGameId: newGameId };

  },

  update: async ({ request }) => {
    const formData = await request.formData();
    const gameId = formData.get('game_id') as string;


    if (!gameId) {
      console.error("No game ID provided for update.");
      return { success: false };
    }

    // Extract all fields from formData similar to your create action
    const sessionName = formData.get('session_name');
    const gameName = formData.get('game_name');
    const maxPlayers = formData.get('max_players');
    const gameTime = formData.get('game_time') as string;
    const description = formData.get('description');
    const selectedFile = formData.get('selectedFile');
    //const chipsSelected = formData.get('chipsSelectedrsedChipsSelected = chipsSelected ? JSON.parse(chipsSelected as string) : null;
    const chipsSelected = formData.get('chipsSelected');
    const parsedChipsSelected = chipsSelected ? JSON.parse(chipsSelected as string) : null;
    const durationSeconds = formData.get('durationSeconds');
    const oldImageName = formData.get('previousImageName') as string;

    const tempDateTime = DateTime.fromISO(gameTime).toJSDate();

    let imageName = '';
    let imageRoute = '';
    if (selectedFile) {

      imageName = 'gameImage' + [...v4()].slice(0, 10).join('');
      imageRoute = 'https://hlkxosxqhseheconlqdl.supabase.co/storage/v1/object/public/Main_bucket/images/' + imageName;
    }

    try {
      const promises = [];

      // If a new image was provided, upload it
      if (selectedFile) {

        if (oldImageName) {
          promises.push(supabase.storage.from('Main_bucket').remove(["images/" + oldImageName]));
        }
        promises.push(supabase.storage.from('Main_bucket/images').upload(imageName, selectedFile, { contentType: 'image/png' }));
      }

      // Update the game
      promises.push(prisma.games.update({
        where: {
          id: gameId
        },
        data: {
          session_name: sessionName as string,
          game_name: gameName as string,
          max_players: Number(maxPlayers),
          duration: Number(durationSeconds),
          description: description as string,
          game_time: tempDateTime,
          game_image: selectedFile ? imageRoute : undefined,
          chip_list: {
            set: parsedChipsSelected ? parsedChipsSelected.map((item: { id: any; }) => ({ id: item.id })) : []
          },
        }
      }));

      const results = await Promise.all(promises);

      if (selectedFile) {
        console.log('Image uploaded successfully:', results[0]);
        console.log('Game updated successfully:', results[1]);
      } else {
        console.log('Game updated successfully:', results[0]);
      }
    } catch (error) {
      console.error('An error occurred during game update:', error);
      return { success: false };
    }
    return { success: true };
  },
  delete: async ({ request }) => {
    try {
      const formData = await request.formData();
      const gameId = formData.get('game_id') as string;

      if (!gameId) {
        throw new Error("No game ID provided for deletion.");
      }

      const game = await prisma.games.findUnique({
        where: {
          id: gameId
        }
      });

      if (!game) {
        throw new Error('Game not found for deletion.');
      }

      const promises = [];

      // If the game has an associated image, schedule it for deletion
      if (game.game_image) {
        const imageName = game.game_image.split('/').pop();
        if (imageName) {
          promises.push(supabase.storage.from('Main_bucket').remove(["images/" + imageName]));
        }
      }
      // Schedule game record deletion
      promises.push(prisma.games.delete({
        where: {
          id: gameId
        }
      }));

      const results = await Promise.all(promises);
      console.log('Game and resources deleted successfully:', results);

      return { success: true };

    } catch (error) {
      console.error('An error occurred during game deletion:', error);
      return { success: false };
    }
  }


};