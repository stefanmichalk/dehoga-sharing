import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  progress?: number;
  timeLeft?: number;
  startTime?: number;
  pausedAt?: number;
  pausedDuration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  private readonly DEFAULT_DURATION = 8000; // 8 seconds
  private timeouts = new Map<Toast, any>();

  getToasts(): Observable<Toast[]> {
    return this.toasts.asObservable();
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = this.DEFAULT_DURATION) {
    const toast: Toast = { 
      message, 
      type, 
      duration,
      progress: 100,
      timeLeft: duration,
      startTime: Date.now(),
      pausedDuration: 0
    };
    const currentToasts = this.toasts.value;
    this.toasts.next([...currentToasts, toast]);

    this.scheduleRemoval(toast);
  }

  private scheduleRemoval(toast: Toast) {
    if (!toast.timeLeft) return;

    const timeoutId = setTimeout(() => {
      this.removeToast(toast);
    }, toast.timeLeft);

    this.timeouts.set(toast, timeoutId);
  }

  pauseToast(toast: Toast) {
    if (!toast.pausedAt) {
      const timeoutId = this.timeouts.get(toast);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.timeouts.delete(toast);
        
        toast.pausedAt = Date.now();
        const elapsedTime = toast.pausedAt - (toast.startTime || 0) - (toast.pausedDuration || 0);
        toast.timeLeft = (toast.duration || 0) - elapsedTime;
      }
    }
  }

  resumeToast(toast: Toast) {
    if (toast.pausedAt && toast.timeLeft && toast.timeLeft > 0) {
      const now = Date.now();
      const pauseDuration = now - toast.pausedAt;
      toast.pausedDuration = (toast.pausedDuration || 0) + pauseDuration;
      toast.pausedAt = undefined;
      
      this.scheduleRemoval(toast);
    }
  }

  private removeToast(toastToRemove: Toast) {
    const currentToasts = this.toasts.value;
    const index = currentToasts.indexOf(toastToRemove);
    if (index > -1) {
      const newToasts = [...currentToasts];
      newToasts.splice(index, 1);
      this.toasts.next(newToasts);
      
      // Cleanup timeout
      const timeoutId = this.timeouts.get(toastToRemove);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.timeouts.delete(toastToRemove);
      }
    }
  }
}
