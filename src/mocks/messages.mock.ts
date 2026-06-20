import type { ChatMessage } from '@/src/features/tasker/types/tasker.types';
import { taskDetailMock } from '@/src/mocks/tasks.mock';

export const messageTaskMock = {
  task: taskDetailMock,
  customerName: 'Nguyen Thanh Van',
  customerInitials: 'TV',
};

export const chatMessagesMock: ChatMessage[] = [
  { id: 'msg_001', sender: 'customer', message: 'Chao anh Duc, hom nay anh co the den som hon 15 phut duoc khong a?', timestamp: '10:30 AM' },
  { id: 'msg_002', sender: 'tasker', message: 'Chao chi Van. Em se co mat luc 13:45 de bat dau cong viec som hon nhe.', timestamp: '10:32 AM' },
  { id: 'msg_003', sender: 'customer', message: 'Cam on anh nhieu. Toi co de san dung cu ve sinh o ban cong.', timestamp: '10:35 AM' },
  { id: 'msg_004', sender: 'tasker', message: 'Da vang em ghi nho roi a. Chi co luu y gi dac biet cho phong ngu nho khong a?', timestamp: '10:40 AM' },
  { id: 'msg_005', sender: 'customer', message: 'Cho nay can lau ky bui o ke sach giup toi nhe.', timestamp: '10:42 AM', imageLabel: 'Anh phong ngu' },
];
