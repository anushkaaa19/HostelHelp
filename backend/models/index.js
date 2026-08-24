// Central export point for all models. Also ensures every schema file is
// required at least once so Mongoose registers each model before any
// controller tries to `.populate()` a ref by name.
module.exports = {
  User: require("./User"),
  Student: require("./Student"),
  Worker: require("./Worker"),
  Admin: require("./Admin"),
  Warden: require("./Warden"),
  Hostel: require("./Hostel"),
  Block: require("./Block"),
  Room: require("./Room"),
  RoommateRequest: require("./RoommateRequest"),
  Complaint: require("./Complaint"),
  WorkOrder: require("./WorkOrder"),
  MessMenu: require("./MessMenu"),
  Notification: require("./Notification"),
};
