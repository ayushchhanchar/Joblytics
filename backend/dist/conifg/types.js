"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationStatus = void 0;
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus[ApplicationStatus["APPLIED"] = 0] = "APPLIED";
    ApplicationStatus[ApplicationStatus["INTERVIEWING"] = 1] = "INTERVIEWING";
    ApplicationStatus[ApplicationStatus["OFFER"] = 2] = "OFFER";
    ApplicationStatus[ApplicationStatus["REJECTED"] = 3] = "REJECTED";
    ApplicationStatus[ApplicationStatus["GHOSTED"] = 4] = "GHOSTED";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
