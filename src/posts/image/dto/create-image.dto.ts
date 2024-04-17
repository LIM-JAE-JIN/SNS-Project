import { PickType } from '@nestjs/mapped-types';
import { ImagesModel } from 'src/common/entities/image.entity';

export class CreatePostImageDto extends PickType(ImagesModel, [
  'path',
  'post',
  'order',
  'type',
]) {}
