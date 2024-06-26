import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import {
  IsEmail,
  IsString,
  Length,
  ValidationArguments,
} from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { Exclude, Expose } from 'class-transformer';
import { ChatsModel } from 'src/chats/entities/chats.entity';
import { MessagesModel } from 'src/chats/messages/entities/messages.entity';
import { CommentsModel } from 'src/posts/comments/entities/comments.entity';
import { UserFollowsModel } from './user-follows.entity';

@Entity()
export class UsersModel extends BaseModel {
  @Column({ unique: true, length: 20 })
  @IsString({ message: stringValidationMessage })
  @Length(1, 20, { message: lengthValidationMessage })
  nickname: string;

  // @Expose()
  // get nicknameAndEmail() {
  //   return this.nickname + '/' + this.email;
  // }

  @Column({ unique: true })
  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @Column({ nullable: false })
  @IsString({ message: stringValidationMessage })
  @Length(3, 8, { message: lengthValidationMessage })
  /**
   * frontend -> backend
   * plain object (JSON) -> class instance (dto)
   *
   * backend -> frontend
   * class instance (dto) -> plain object (JSON)
   *
   * toClassOnly -> class instance로 변환될 때만
   * toPlainOnly -> plain object로 변환될 때만
   */
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];

  @ManyToMany(() => ChatsModel, (chat) => chat.users)
  @JoinTable({ name: 'users_chats_model' })
  chats: ChatsModel[];

  @OneToMany(() => MessagesModel, (message) => message.author)
  messages: MessagesModel[];

  @OneToMany(() => CommentsModel, (comment) => comment.author)
  postComments: CommentsModel[];

  // 나를 팔로우 하고 있는 사람들
  @OneToMany(() => UserFollowsModel, (ufm) => ufm.follower)
  followers: UserFollowsModel[];

  // 내가 팔로우 하고 있는 사람들
  @OneToMany(() => UserFollowsModel, (ufm) => ufm.followee)
  followees: UserFollowsModel[];

  @Column({ default: 0 })
  followerCount: number;

  @Column({ default: 0 })
  followeeCount: number;
}
