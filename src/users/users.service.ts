import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { QueryRunner, Repository } from 'typeorm';
import { UserFollowsModel } from './entities/user-follows.entity';
import { privateDecrypt } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(UserFollowsModel)
    private readonly userFollowsRepository: Repository<UserFollowsModel>,
  ) {}

  getUsersRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UsersModel>(UsersModel)
      : this.usersRepository;
  }

  getUserFollowsRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UserFollowsModel>(UserFollowsModel)
      : this.userFollowsRepository;
  }

  async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
    // 1) nickname 중복이 없는지 확인
    // exist() -> 만약 조건에 해당되는 값이 있으면 true 반환
    const nicknameExists = await this.usersRepository.exists({
      where: {
        nickname: user.nickname,
      },
    });
    if (nicknameExists)
      throw new BadRequestException('이미 존재하는 nickname 입니다!');

    const emailExists = await this.usersRepository.exists({
      where: {
        email: user.email,
      },
    });
    if (emailExists) throw new BadRequestException('이미 가입한 이메일입니다!');

    const useObject = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    });

    const newUser = await this.usersRepository.save(useObject);

    return newUser;
  }

  async getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async followUser(followerId: number, followeeId: number, qr?: QueryRunner) {
    const userFollowsRepository = this.getUserFollowsRepository(qr);

    await userFollowsRepository.save({
      follower: {
        id: followerId,
      },
      followee: {
        id: followeeId,
      },
    });

    return true;
  }

  async getFollowers(userId: number, includeNotConfirmed: boolean) {
    const where = {
      followee: {
        id: userId,
      },
    };

    if (!includeNotConfirmed) {
      where['isConfirmed'] = true;
    }

    const result = await this.userFollowsRepository.find({
      where,
      relations: {
        follower: true,
        followee: true,
      },
    });

    return result.map((user) => ({
      id: user.follower.id,
      nickname: user.follower.nickname,
      email: user.follower.email,
      isConfirmed: user.isConfirmed,
    }));
  }

  async confirmFollow(
    followerId: number,
    followeeId: number,
    qr?: QueryRunner,
  ) {
    const userFollowsRepository = this.getUserFollowsRepository(qr);

    const existing = await userFollowsRepository.findOne({
      where: {
        follower: { id: followerId },
        followee: { id: followeeId },
      },
      relations: {
        follower: true,
        followee: true,
      },
    });
    if (!existing)
      throw new BadRequestException('존재하지 않는 팔로우 요청입니다.');

    await userFollowsRepository.save({
      ...existing,
      isConfirmed: true,
    });

    return true;
  }

  async deleteFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
    const userFollowsRepository = this.getUserFollowsRepository(qr);

    await userFollowsRepository.delete({
      follower: { id: followerId },
      followee: { id: followeeId },
    });

    return true;
  }

  async incrementFollowCount(
    followId: number,
    isFollower: boolean,
    qr?: QueryRunner,
  ) {
    const usersRepository = this.getUsersRepository(qr);

    const followChk = isFollower ? 'followerCount' : 'followeeCount';

    await usersRepository.increment({ id: followId }, followChk, 1);
  }

  async decrementFollowCount(
    followId: number,
    isFollower: boolean,
    qr?: QueryRunner,
  ) {
    const usersRepository = this.getUsersRepository(qr);

    const followChk = isFollower ? 'followerCount' : 'followeeCount';

    await usersRepository.decrement({ id: followId }, followChk, 1);
  }
}
