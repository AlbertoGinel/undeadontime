import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
  let profilesTotal = 0;
  let profilesWeek = 0;

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    profilesWeek = await prisma.profiles.count({
      where: {
        last_sign_in_at: {
          gte: oneWeekAgo
        }
      }
    });

    console.log('Profiles logged in the last 7 days:', profilesWeek);
  } catch (error) {
    console.error('Error fetching profiles from the last 7 days:', error);
    throw error;
  }

  try {
    profilesTotal = await prisma.profiles.count();
    console.log('Total profiles:', profilesTotal);
  } catch (error) {
    console.error('Error fetching total profiles count:', error);
    throw error;
  }

  return {
    props: {
      profilesTotal: profilesTotal,
      profilesWeek: profilesWeek
    }
  };
};
