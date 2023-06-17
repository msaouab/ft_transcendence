import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { FriendshipInvites } from "@prisma/client";

import { PostInviteDto } from "./dto/post-invite.dto";
import { DeleteInviteDto } from "./dto/delete-invite.dto";
import { PutInviteDto } from "./dto/put-invite.dto";

// services
import { UserService } from "src/user/user.service";
import { FriendsService } from "src/friends/friends.service";

import {
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";

import { clients as onlineClientsMap } from "src/notify/notify.gateway";

@Injectable()
export class InvitesService {
  constructor(
    private prisma: PrismaService,
    private friendService: FriendsService
  ) {}

  async getInvites(id: string): Promise<FriendshipInvites[]> {
    //if the user doesn't exist, throw a 404 exception
    const userExists = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new NotFoundException("User does not exist");
    }

    // getInvites returns all invites for a user whether they are the sender or receiver
    return this.prisma.friendshipInvites.findMany({
      where: {
        OR: [
          {
            sender_id: id,
          },
          {
            receiver_id: id,
          },
        ],
      },
    });
  }

  async postInvites(
    postInviteDto: PostInviteDto,
    sender_id: string
  ): Promise<FriendshipInvites> {
    // postInvites creates a new invite
    const { receiver_id } = postInviteDto;

    // check if the invite already exists
    const inviteExists = await this.prisma.friendshipInvites.findFirst({
      where: {
        sender_id,
        receiver_id,
      },
    });

    if (inviteExists) {
      throw new ConflictException("Invite already exists");
    }

    // check if the invite is to the same user
    if (sender_id === receiver_id) {
      throw new ForbiddenException("You cannot send an invite to yourself");
    }

    // check if the invite is to a user that doesn't exist
    const userExists = await this.prisma.user.findFirst({
      where: {
        id: receiver_id,
      },
    });

    if (!userExists) {
      throw new NotFoundException("User does not exist");
    }

    // check if the invite is to a user that is already a friend
    const friendshipExists = await this.prisma.friendsTab.findFirst({
      where: {
        OR: [
          {
            user_id: sender_id,
            friendUser_id: receiver_id,
          },
          {
            user_id: receiver_id,
            friendUser_id: sender_id,
          },
        ],
      },
    });
    if (friendshipExists) {
      throw new ConflictException("User is already a friend");
    }

    // create the invite
    const Invite = await this.prisma.friendshipInvites.create({
      data: {
        sender_id,
        receiver_id,
      },
    });
    if (!Invite) {
      throw new ConflictException("Invite could not be created");
    }
    console.log(
      "socket---------------------------",
      onlineClientsMap.has(receiver_id)
    );
    console.log("onlineClientsMap", onlineClientsMap);
    if (onlineClientsMap.has(receiver_id)) {
      const socket = onlineClientsMap.get(receiver_id);
      socket.emit("invite", Invite);
    }
    return Invite;
  }

  async putInvites(
    putInviteDto: PutInviteDto,
    sender_id: string
  ): Promise<FriendshipInvites> {
    // putInvites updates an existing invite
    const { receiver_id, status } = putInviteDto;

    // if status is not Accepted or Rejected, throw a 400 exception
    if (status !== "Accepted" && status !== "Rejected") {
      throw new ForbiddenException("Status must be Accepted or Rejected");
    }

    // check if the invite already exists
    const inviteExists = await this.prisma.friendshipInvites.findFirst({
      where: {
        sender_id,
        receiver_id,
      },
    });

    if (!inviteExists) {
      throw new ConflictException("Invite does not exist");
    }

    // if invite is "Accpeted" let's create a friendship
    if (status === "Accepted") {
      // create a friendship
      const acceptedInvite = await this.friendService.createFriendship(
        sender_id,
        receiver_id
      );
      if (onlineClientsMap.has(sender_id)) {
        const socket = onlineClientsMap.get(sender_id);
        socket.emit("inviteAccepted", acceptedInvite);
      }
      if (onlineClientsMap.has(receiver_id)) {
        const socket = onlineClientsMap.get(receiver_id);
        socket.emit("inviteAccepted", acceptedInvite);
      }
    }
    return await this.prisma.friendshipInvites.delete({
      where: {
        sender_id_receiver_id: {
          sender_id: sender_id,
          receiver_id: receiver_id,
        },
      },
    });
  }

  async deleteInvites(
    deleteInviteDto: DeleteInviteDto,
    sender_id: string
  ): Promise<FriendshipInvites> {
    const { receiver_id } = deleteInviteDto;
    // deleting an invite
    /* err cases:
     * if invite doesn't exist, throw a 404 exception
     */
    const inviteExists = await this.prisma.friendshipInvites.findFirst({
      where: {
        sender_id,
        receiver_id,
      },
    });

    if (!inviteExists) {
      throw new NotFoundException("Invite does not exist");
    }

    // delete the invite
    return this.prisma.friendshipInvites.delete({
      where: {
        sender_id_receiver_id: {
          sender_id: sender_id,
          receiver_id: receiver_id,
        },
      },
    });
  }
}
