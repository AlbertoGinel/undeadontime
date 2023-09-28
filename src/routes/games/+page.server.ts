import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load = (async (event) => {
  const session = await event.locals.getSession();

  const games = await prisma.games.findMany({
    include: {
      booked_users: true,
      owned_users: true,
      chip_list: true
    }
  });
  return { games };
}) satisfies PageServerLoad;
