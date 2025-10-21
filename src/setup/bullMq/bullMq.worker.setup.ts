import type { Job } from "bullmq";
import BullMqSetup from "./bullMq.setup.js";

const workers: any[] = [];

class BullMqWorker<
  DataType = any,
  ResultType = any,
  NameType extends string = string,
> {
  private bullMqSetup: typeof BullMqSetup;
  private worker;

  constructor(
    queueName: string,
    processFn: (
      job: Job<DataType, ResultType, NameType>,
    ) => Promise<ResultType>,
  ) {
    this.bullMqSetup = BullMqSetup;
    this.worker = this.bullMqSetup.createWorker(queueName, processFn);
    this.start();
  }

  private start() {
    console.log("starting working for queue ", this.worker.name);
    this.worker
      .on("failed", (job, error) => {
        console.error(
          `Job ${job?.id || "unknown"} has failed with ${error.message}`,
        );
      })
      .on("ready", () => {
        console.log(
          "worker ready",
          this.worker.qualifiedName,
          this.worker.eventNames,
        );
      })
      .on("error", (error) => {
        console.log(error);
        // TODO :-
        // If worker failed then send alert
      });
  }

  async close() {
    await this.worker.close();
    await this.bullMqSetup.closeConnections();
  }
}

export default workers.map(
  (worker) => new BullMqWorker(worker.queueName, worker.job),
);
