import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { User } from 'src/users/entities/user.entity';
import {
  MultipleDeviceNotificationDto,
  NotificationDto,
  TopicNotificationDto,
} from './dto/notification.dto';
import {
  AndroidConfig,
  TokenMessage,
} from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class FirebaseService {
  #db: FirebaseFirestore.Firestore;
  #collection: FirebaseFirestore.CollectionReference;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.#db = this.firebaseApp.firestore();
    this.#collection = this.#db.collection('users');
  }
  private android: AndroidConfig = {
    priority: 'high',
  };

  private apns = {
    payload: {
      aps: {
        contentAvailable: true,
      },
    },
    headers: {
      'apns-priority': '5', // Must be `5` when `contentAvailable` is set to true.
    },
  };
  async storeUser(user: User) {
    try {
      await this.#db
        .collection('users')
        .doc(user.id.toString())
        .set(JSON.parse(JSON.stringify(user)));
    } catch (error) {
      console.error('Error storing user:', error);
      return new Error('Failed to store user');
    }
  }

  async sendNotification({ token, title, body }: NotificationDto) {
    const pushMessage: TokenMessage = {
      token,
      data: {},
      notification: {
        title,
        body,
      },
      android: {
        notification: {
          icon: 'notification_icon',
          sound: 'default',
        },
      },
      apns: this.apns,
    };
    try {
      const response = await this.firebaseApp.messaging().send(pushMessage);
      return response;
    } catch (error) {
      return error;
    }
  }

  async sendNotificationToMultipleTokens({
    tokens,
    title,
    body,
  }: MultipleDeviceNotificationDto) {
    const message = {
      notification: {
        title,
        body,
      },
      tokens,
    };

    try {
      const response = await this.firebaseApp
        .messaging()
        .sendEachForMulticast(message);
      console.log('Successfully sent messages:', response);
      return {
        success: true,
        message: `Successfully sent ${response.successCount} messages; ${response.failureCount} failed.`,
      };
    } catch (error) {
      console.log('Error sending messages:', error);
      return { success: false, message: 'Failed to send notifications' };
    }
  }

  async sendTopicNotification({ topic, title, body }: TopicNotificationDto) {
    const message = {
      notification: {
        title,
        body,
      },
      topic,
    };

    try {
      const response = await this.firebaseApp.messaging().send(message);
      console.log('Successfully sent message:', response);
      return { success: true, message: 'Topic notification sent successfully' };
    } catch (error) {
      console.log('Error sending message:', error);
      return { success: false, message: 'Failed to send topic notification' };
    }
  }
}
