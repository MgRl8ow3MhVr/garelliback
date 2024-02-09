module.exports = {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
    populateCreatorFields: false,
  },
  responses: {
    privateAttributes: ["created_by", "updated_by"],
    populateCreatorFields: false,
  },
};
