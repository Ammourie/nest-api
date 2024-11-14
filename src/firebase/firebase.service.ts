import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FirebaseService {
  #db: FirebaseFirestore.Firestore;
  #collection: FirebaseFirestore.CollectionReference;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.#db = this.firebaseApp.firestore();
    this.#collection = this.#db.collection('users');
  }

  async storeUser(user: User): Promise<void> {
    try {
      await this.#db.collection('users')
        .doc(user.id.toString())
        .set(JSON.parse(JSON.stringify(user)));
    } catch (error) {
      console.error('Error storing user:', error);
      throw new Error('Failed to store user');
    }
  }
}
