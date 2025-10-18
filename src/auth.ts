import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  getUserByEmail,
  createUser,
  getUserProfilePictureById,
} from "./lib/queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    jwt: async ({ token, profile }) => {
      if (profile) {
        let userId = await getUserByEmail(profile.email || "");

        if (!userId) {
          userId = await createUser(
            profile.email || "",
            profile.given_name || "",
            profile.family_name || "",
            profile.picture
          );
        }

        return { userId };
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.userId as string;
      session.user.image = await getUserProfilePictureById(
        token.userId as string
      );

      return session;
    },
  },
});
