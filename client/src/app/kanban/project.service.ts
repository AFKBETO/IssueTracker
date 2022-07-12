import { Injectable } from '@angular/core'
import { Auth } from '@angular/fire/auth'
import { Firestore, collection, addDoc, arrayUnion, updateDoc, doc, arrayRemove, deleteDoc } from '@angular/fire/firestore'
import { Project } from './kanban.model'
import { } from 'firebase/app'
import { switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private afAuth: Auth, private db: Firestore) { }

  /**
   * Create a new project
   */
  async createProject (data: Project) {
    const user = this.afAuth.currentUser
    const project = await addDoc(collection(this.db, 'projects'),{...data})
    await updateDoc(doc(collection(this.db, 'users'),`${user?.uid}`),{
      projects: arrayUnion(project.id)
    })
    return project
  }

  /**
   * Delete a project
   */
  async deleteProject (projectId: string) {
    const user = this.afAuth.currentUser
    await updateDoc(doc(collection(this.db,'users'),`${user?.uid}`),{
      projects: arrayRemove(projectId)
    })
    return deleteDoc(doc(collection(this.db,'projects'),`${projectId}`))
  }
}
