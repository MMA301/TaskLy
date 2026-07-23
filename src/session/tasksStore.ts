import { mockTaskerData } from '../../mockdata';

export interface Task {
  id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  rawBudget: number;
  distance: string;
  postedAgo: string;
  address: string;
  time: string;
  duration: string;
  customer: string;
  customerRating: string;
  urgent?: boolean;
  icon?: string;
  avatarUrl?: string;
  status: 'OPEN' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED';
  escrowStatus: 'UNPAID' | 'ESCROWED' | 'RELEASED';
  applicants: string[]; // List of tasker names
  assignedTasker: string | null;
  review?: {
    rating: number;
    comment: string;
  } | null;
}

// Convert mock data to our Task shape
const initialTasks: Task[] = [];

// Add nearby tasks
if (mockTaskerData && mockTaskerData.nearbyTasks) {
  mockTaskerData.nearbyTasks.forEach((t: any) => {
    const rawVal = parseInt(t.price.replace(/[^0-9]/g, '')) || 0;
    initialTasks.push({
      id: t.id,
      category: t.category,
      title: t.title,
      description: t.description || 'Cần hỗ trợ công việc dọn dẹp, sửa chữa cơ bản trong gia đình. Yêu cầu cẩn thận, trung thực.',
      price: t.price,
      rawBudget: rawVal,
      distance: t.distance,
      postedAgo: t.postedAgo,
      address: t.address,
      time: t.time,
      duration: t.duration,
      customer: t.customer,
      customerRating: t.customerRating,
      urgent: t.urgent,
      icon: t.icon,
      status: 'OPEN',
      escrowStatus: 'ESCROWED', // initially escrowed in mock
      applicants: [],
      assignedTasker: null,
      review: null
    });
  });
}

// Add accepted tasks
if (mockTaskerData && mockTaskerData.acceptedTasks) {
  mockTaskerData.acceptedTasks.forEach((t: any) => {
    const rawVal = parseInt(t.price.replace(/[^0-9]/g, '')) || 0;
    initialTasks.push({
      id: t.id,
      category: t.category || 'Công việc',
      title: t.title,
      description: t.description || 'Công việc đã được chấp nhận và đang thực hiện.',
      price: t.price,
      rawBudget: rawVal,
      distance: t.distance || '1.0 km',
      postedAgo: '1 ngày trước',
      address: t.location || 'TP. Hồ Chí Minh',
      time: 'Hôm nay',
      duration: '3 giờ',
      customer: t.customer,
      customerRating: '4.8',
      urgent: false,
      icon: 'cleaning',
      status: t.status === 'Đang thực hiện' ? 'IN_PROGRESS' : 'ACCEPTED',
      escrowStatus: 'ESCROWED',
      applicants: [],
      assignedTasker: 'Nguyễn Minh Đức',
      review: null
    });
  });
}

let tasks: Task[] = [...initialTasks];
type Listener = () => void;
let listeners: Listener[] = [];

export function getTasks(): Task[] {
  return tasks;
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find(t => t.id === id);
}

export function addTask(taskData: Omit<Task, 'applicants' | 'assignedTasker' | 'review'>): Task {
  const newTask: Task = {
    ...taskData,
    applicants: [],
    assignedTasker: null,
    review: null
  };
  tasks = [newTask, ...tasks];
  notify();
  return newTask;
}

export function applyForTask(taskId: string, taskerName: string): boolean {
  const task = tasks.find(t => t.id === taskId);
  if (task && task.status === 'OPEN') {
    if (!task.applicants.includes(taskerName)) {
      task.applicants = [...task.applicants, taskerName];
      notify();
      return true;
    }
  }
  return false;
}

export function acceptTasker(taskId: string, taskerName: string): boolean {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.assignedTasker = taskerName;
    task.status = 'ACCEPTED';
    task.applicants = [taskerName]; // auto-reject others
    notify();
    return true;
  }
  return false;
}

export function startWork(taskId: string): boolean {
  const task = tasks.find(t => t.id === taskId);
  if (task && task.status === 'ACCEPTED') {
    task.status = 'IN_PROGRESS';
    notify();
    return true;
  }
  return false;
}

export function releaseEscrow(taskId: string): boolean {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.status = 'COMPLETED';
    task.escrowStatus = 'RELEASED';
    notify();
    return true;
  }
  return false;
}

export function addReview(taskId: string, rating: number, comment: string): boolean {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.review = { rating, comment };
    notify();
    return true;
  }
  return false;
}

export function updateTask(taskId: string, data: Partial<Task>): boolean {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    Object.assign(task, data);
    notify();
    return true;
  }
  return false;
}

export function cancelTask(taskId: string): boolean {
  const initialLen = tasks.length;
  tasks = tasks.filter(t => t.id !== taskId);
  if (tasks.length < initialLen) {
    notify();
    return true;
  }
  return false;
}

export function rejectApplicant(taskId: string, applicantName: string): boolean {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.applicants = task.applicants.filter(a => a !== applicantName);
    notify();
    return true;
  }
  return false;
}

export function payTaskEscrow(taskId: string): boolean {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.escrowStatus = 'ESCROWED';
    notify();
    return true;
  }
  return false;
}

export function refundTaskEscrow(taskId: string): boolean {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.escrowStatus = 'UNPAID';
    task.assignedTasker = null;
    task.status = 'OPEN';
    notify();
    return true;
  }
  return false;
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

let selectedTaskId: string | null = null;

export function setSelectedTaskId(id: string | null) {
  selectedTaskId = id;
}

export function getSelectedTaskId(): string | null {
  return selectedTaskId;
}

function notify() {
  listeners.forEach(l => l());
}
