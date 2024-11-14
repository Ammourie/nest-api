import { Body, Controller, Post } from '@nestjs/common';
import {
  MultipleDeviceNotificationDto,
  NotificationDto,
  TopicNotificationDto,
} from './dto/notification.dto';
import { FirebaseService } from './firebase.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BlogDto } from 'src/blogs/dto/blog.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { CreateBlogDto } from 'src/blogs/dto/create-blog.dto';
@ApiBearerAuth()
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('send-notification')
  async sendNotification(@Body() notificationDto: NotificationDto) {

    return this.firebaseService.sendNotification(notificationDto);
  }

//   @Post('send-multiple-notifications')
//   async sendMultipleNotifications(
//     @Body() multipleDeviceNotificationDto: MultipleDeviceNotificationDto,
//   ) {
//     return this.firebaseService.sendNotificationToMultipleTokens(
//       multipleDeviceNotificationDto,
//     );
//   }

//   @Post('send-topic-notification')
//   async sendTopicNotification(
//     @Body() topicNotificationDto: TopicNotificationDto,
//   ) {
//     return this.firebaseService.sendTopicNotification(topicNotificationDto);
//   }
}
