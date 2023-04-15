
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FriendshipInvites } from '@prisma/client';


import { PostInviteDto } from './dto/post-invite.dto';

import { PutInviteDto } from './dto/put-invite.dto';


// services
import { UserService } from 'src/user/user.service';
import { FriendsService } from 'src/friends/friends.service';

import {
    ForbiddenException,
    ConflictException,
    NotFoundException
} from '@nestjs/common';

@Injectable()
export class InvitesService {
    constructor(private prisma: PrismaService,
        private friendService: FriendsService) { }

    async getInvites(id: string): Promise<FriendshipInvites[]> {
        //if the user doesn't exist, throw a 404 exception
        const userExists = await this.prisma.user.findFirst({
            where: {
                id,
            },
        });

        if (!userExists) {
            throw new NotFoundException('User does not exist');
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

    async postInvites(postInviteDto: PostInviteDto, sender_id: string): Promise<FriendshipInvites> {


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
            throw new ConflictException('Invite already exists');
        }

        // check if the invite is to the same user
        if (sender_id === receiver_id) {
            throw new ForbiddenException('You cannot send an invite to yourself');

        }


        // check if the invite is to a user that doesn't exist
        const userExists = await this.prisma.user.findFirst({
            where: {
                id: receiver_id,
            },
        });

        if (!userExists) {
            throw new NotFoundException('User does not exist');
        }

        // check if the invite is to a user that is already a friend
        // for later when friendships are implemented


        // create the invite
        return this.prisma.friendshipInvites.create({
            data: {
                sender_id,
                receiver_id,
            },
        });
    }

    async putInvites(putInviteDto: PutInviteDto, sender_id: string): Promise<FriendshipInvites> {
        // putInvites updates an existing invite
        const { receiver_id, status } = putInviteDto;

        // if status is not Accepted or Rejected, throw a 400 exception
        if (status !== 'Accepted' && status !== 'Rejected') {
            throw new ForbiddenException('Status must be Accepted or Rejected');
        }

        // check if the invite already exists
        const inviteExists = await this.prisma.friendshipInvites.findFirst({
            where: {
                sender_id,
                receiver_id,
            },
        });

        if (!inviteExists) {
            throw new ConflictException('Invite does not exist');
        }

        // if invite is "Accpeted" let's create a friendship
        if (status === 'Accepted') {
            // create a friendship
            await this.friendService.createFriendship(sender_id, receiver_id);
        }
        // find the invite by looking for sender_id and receiver_id
        const invite = await this.prisma.friendshipInvites.findFirst({
            where: {
                sender_id,
                receiver_id,
            },
        });


        // update the invite
        return this.prisma.friendshipInvites.update({

            where: {
                sender_id_receiver_id: {
                    sender_id: sender_id,
                    receiver_id: receiver_id,
                },
            },
            data: {
                status: status === 'Accepted' ? 'Accepted' : 'Rejected',
            },
        });

    }

}




