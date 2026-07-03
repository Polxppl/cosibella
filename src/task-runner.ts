type Task = {
  run(): Promise<void>;
}

export class TaskRunner {
  private interval: NodeJS.Timeout | null = null;

  constructor(private task: Task) {}

  private clearInterval(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = null;
  }

  private async runTask(): Promise<void> {
    try {
      await this.task.run();
    } catch (err) {
      console.error(err);
    }
  }

  public run(): void {
    this.clearInterval();
    this.runTask();
    this.interval = setInterval(() => {
      this.runTask()
    }, 1000 * 60 * 5);
  }

  public destroy(): void {
    this.clearInterval();
  }
}

