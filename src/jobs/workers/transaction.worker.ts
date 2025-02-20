import { Worker } from "bullmq";

import { processTransaction } from "../../modules/transaction/transaction.service";
import redisClient from "../../config/redis";
import logger from "../../lib/utils/logger";

const transactionWorker = new Worker(
  "transactions",
  async (job) => {
    const { senderId, receiverId, amount, transactionId, reference } = job.data;
    logger.info(
      { jobId: job.id, transactionId, senderId, receiverId, reference },
      "Processing transaction"
    );

    try {
      await processTransaction(transactionId);
      logger.info(
        { jobId: job.id, transactionId, senderId, receiverId, reference },
        "Transaction processed successfully"
      );
    } catch (error) {
      logger.error(
        { jobId: job.id, transactionId, senderId, receiverId, reference },
        "Transaction processing failed"
      );
      throw error;
    }
  },
  { connection: redisClient }
);

transactionWorker.on("completed", (job) =>
  logger.info({ jobId: job.id }, "Transaction completed")
);
transactionWorker.on("failed", (job, err) =>
  logger.error({ jobId: job?.id, error: err }, "Transaction failed")
);
