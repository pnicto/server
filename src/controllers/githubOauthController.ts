import axios from "axios";
import { Request, Response } from "express";
import prisma from "../clients/prismaClient";
import { generateJWT } from "../utils/generateJWT";

const getGithubUser = async (accessToken: string) => {
  const emails: { email: string; primary: boolean; verified: boolean }[] = (
    await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  ).data;
  const email = emails.find(
    (email: { email: string; primary: boolean; verified: boolean }) =>
      email.primary === true
  )?.email;
  const { login } = (
    await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  ).data;

  return { email, login };
};

export const getUserDetails = async (req: Request, res: Response) => {
  const { code } = req.query;
  const postRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const access_token = postRes.data["access_token"];
  const { login, email } = await getGithubUser(access_token);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    console.log("here");

    const newUser = await prisma.user.create({
      data: {
        email: email as string,
        username: login,
      },
    });
    console.log(newUser);
    const accessToken = generateJWT({ userId: newUser.id });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "https://react-crux.herokuapp.com",
    });
  } else {
    const accessToken = generateJWT({ userId: user.id });
    console.log(user);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "https://react-crux.herokuapp.com",
    });
  }

  res.redirect("https://react-crux.herokuapp.com/app");
};
