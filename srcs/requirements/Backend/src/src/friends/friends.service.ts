import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { FriendsTab } from "@prisma/client";

import { FriendshipExistsException } from "src/exceptions/FriendshipExist.exception";

// imported services
import { UserService } from "src/user/user.service";
import { DeleteFriendshipDto } from "./dto/delete-friendship.dto";

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private readonly UserService: UserService
  ) {}

  async getFriends(id: string): Promise<FriendsTab[]> {
    await this.UserService.getUser(id);
    return await this.prisma.friendsTab.findMany({
      where: {
        OR: [
          {
            user_id: id,
          },
          {
            friendUser_id: id,
          },
        ],
      },
    });
  }

  async getFriendsInfo(id: string) {
    await this.UserService.getUser(id);
    try {
      const friendsId = await this.prisma.friendsTab.findMany({
        where: {
          OR: [{ user_id: id }, { friendUser_id: id }],
        },
      });
      const friends = [];
      for (const friend of friendsId) {
        const user = await this.prisma.user.findFirst({
          where: {
            id: friend.user_id !== id ? friend.user_id : friend.friendUser_id,
          },
          select: {
            id: true,
            login: true,
            firstName: true,
            lastName: true,
            avatar: true,
            status: true,
          },
        });
        friends.push(user);
      }
      return friends;
    } catch (err) {
      console.log(err);
    }
  }
  async createFriendship(
    user_id: string,
    friendUser_id: string
  ): Promise<FriendsTab> {
    /* errs:
     *   if friendship already exist
     *   if user_id or friendUser_id not exist
     */
    await this.UserService.getUser(user_id);
    await this.UserService.getUser(friendUser_id);
    const freindship = await this.prisma.friendsTab.findUnique({
      where: {
        user_id_friendUser_id: {
          user_id: user_id,
          friendUser_id: friendUser_id,
        },
      },
    });
    if (freindship) {
      throw new FriendshipExistsException();
    }
    // create friendship
    return await this.prisma.friendsTab.create({
      data: {
        user_id: user_id,
        friendUser_id: friendUser_id,
      },
    });
  }
  async deleteFriendship(
    deleteFriendshipDto: DeleteFriendshipDto,
    user_id: string
  ): Promise<FriendsTab> {
    /* errs:
     *   if friendship not exist
     */
    const { friendUser_id } = deleteFriendshipDto;
    const freindship = await this.prisma.friendsTab.findFirst({
      where: {
        OR: [
          {
            user_id: user_id,
            friendUser_id: friendUser_id,
          },
          {
            user_id: friendUser_id,
            friendUser_id: user_id,
          },
        ],
      },
    });
    if (!freindship) {
      throw new HttpException("friendship not exist", 404);
    }
    // delete friendship
    return await this.prisma.friendsTab.delete({
      where: {
        user_id_friendUser_id: {
          user_id: freindship.user_id,
          friendUser_id: freindship.friendUser_id,
        },
      },
    });
  }

  async getFriendship(
    user_id: string,
    friendUser_id: string
  ): Promise<FriendsTab> {
    return await this.prisma.friendsTab.findUnique({
      where: {
        user_id_friendUser_id: {
          user_id: user_id,
          friendUser_id: friendUser_id,
        },
      },
    });
  }

  // check if user_id and friendUser_id are friends
  async isFriend(user_id: string, friendUser_id: string): Promise<string> {
    const invite = await this.prisma.friendshipInvites.findFirst({
      where: {
        OR: [
          {
            sender_id: user_id,
            receiver_id: friendUser_id,
          },
          {
            sender_id: friendUser_id,
            receiver_id: user_id,
          },
        ],
      },
    });
    if (invite) {
      return "pending";
    }
    const block = await this.prisma.blockTab.findFirst({
      where: {        user_id: user_id,
        blockedUser_id: friendUser_id,
      },
    });
    if (block) {
      return "blocked";
    }
    const friendship = await this.prisma.friendsTab.findFirst({
      where: {
        OR: [
          {
            user_id: user_id,
            friendUser_id: friendUser_id,
          },
          {
            user_id: friendUser_id,
            friendUser_id: user_id,
          },
        ],
      },
    });
    if (friendship) {
      return "friend";
    }
    return "notFriend";
  }
}
