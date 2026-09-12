import Application from "../models/Application.model.js";

const rankApplications = async (jobId) => {
  const applications = await Application.find({
    job: jobId,
  }).sort({
    aiScore: -1,
  });

  const bulkOperations = applications.map((application, index) => ({
    updateOne: {
      filter: {
        _id: application._id,
      },
      update: {
        $set: {
          rank: index + 1,
        },
      },
    },
  }));

  if (bulkOperations.length > 0) {
    await Application.bulkWrite(bulkOperations);
  }

  return applications.map((application, index) => ({
    ...application.toObject(),
    rank: index + 1,
  }));
};

export default rankApplications;
