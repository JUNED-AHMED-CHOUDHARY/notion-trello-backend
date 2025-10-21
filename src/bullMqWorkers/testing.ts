import type { Job } from "bullmq";

const worker = async (job: Job) => {
  const data = job.data;

  console.log(data);
};

export default { queueName: "testing", job: worker };
