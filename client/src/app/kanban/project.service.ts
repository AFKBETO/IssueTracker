import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Project } from './kanban.model';
import firebase from 'firebase/compat/app'
import { switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  /**
   * Create a new project
   */
  async createProject (data: Project) {
    const user = await this.afAuth.currentUser
    const project = await this.db.collection('projects').add({...data})
    await this.db.collection('users').doc(`${user?.uid}`).update({
      projects: firebase.firestore.FieldValue.arrayUnion(project.id)
    })
    return project
  }

  /**
   * Delete a project
   */
  async deleteProject (projectId: string) {
    const user = await this.afAuth.currentUser
    await this.db.collection('users').doc(`${user?.uid}`).update({
      projects: firebase.firestore.FieldValue.arrayRemove(projectId)
    })
    return this.db.collection('projects').doc(`${projectId}`).delete()
  }
}
