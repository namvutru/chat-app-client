import AuthRepository from './authRepository'
import roomRepository from './roomRepository'
import fileRepository from './fileRepository'
import userRepository from './userRepository'
import friendRepository from './friendRepository'
import groupRepository from './groupRepository'
import callRepository from './callRepository'

const repositories = {
  room: roomRepository,
  auth: AuthRepository,
  file: fileRepository,
  user: userRepository,
  friend: friendRepository,
  group: groupRepository,
  call: callRepository,
  link_files: 'http://127.0.0.1:8000/storage/',
  type_file: {
    image: 1,
    video: 2,
    other: 3
  },
  type_notifications: {
    addfriend: 1,
    addgroup: 2
  }
}

export default {
  get: (name) => repositories[name]
}
