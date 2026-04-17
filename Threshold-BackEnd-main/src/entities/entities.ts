import { SportProfile } from "./sportProfile.entity";
import { Feedback } from "./feedback.entity";
import { SessionRecord } from "./sessionRecord.entity";
import { Session } from "./session.entity";
import { Team } from "./team.entity";
import { Coach } from "./coach.entity";
import { AthleteProfile } from "./athleteProfile.entity";
import { AthleteBattery } from "./athleteBattery.entity";
import { AthleteBiometric } from "./athleteBiometric.entity";
import { Athlete } from "./athlete.entity";
import { Academy } from "./academy.entity";
import { User } from "./user.entity";
import { ApprovalLog } from "./ApprovalLog.entity";
import { AthleteSubscription } from "./athleteSubscription.entity";
import { ResetToken } from "./resetToken.entity";
import { PublicLink } from "./publicLink.entity";
import { PublicLinkAccess } from "./publicLinkAccess.entity";
import { Notification } from "./notification.entity";
import { PlanningSession } from "./planningSession.entity";
import { Branch } from "./branch.entity";
import { AthleteBankDetails } from "./athleteBankDetails.entity";
import { AthleteClothing } from "./athleteClothing.entity";
import { AthleteDocument } from "./athleteDocument.entity";
import { EmergencyContact } from "./emergencyContact.entity";
import { AthleteHealthRecords } from "./athleteHealthRecords.entity";
import { AthleteRecord } from "./athleteRecord.entity";
import { PerformanceRecord } from "./performanceRecord.entity";
import { WeeklySession } from "./weeklySession.entity";
import { sportClubProfiles } from "./sportClubProfiles.entity";
import { ContractDetails } from "./contractDetails.entity";
import { Stock } from "./stock.entity";
import { AthleteStock } from "./athleteStock";
import { SportCategory } from "./stocksCategory.entity";
import { AthleteCategorySize } from "./athleteCategorySize.entity";
import { Manager } from "./manager.entity";
import { Contract } from "./contract.entity";
import { ClubAdmin } from "./clubAdmin.entity";
import { MedicalInformation } from "./medical-information.entity";
import { MedicalHistory } from "./medical-history.entity";
import { Documents } from "./documents.entity";
import { MedicalFiles } from "./medical-files.entity";
import { TeamSession } from "./teamSession.entity";
import { SubGoal } from "./subGoal.entity";
import { TeamGoal } from "./teamGoal.entity";
import { Week } from "./week.entity";
import { ClubSessionTemplate } from "./clubSessionTemplate.entity";
import { ClubSession } from "./clubSession.entity";
import { WorkHistory } from "./workHistory.entity";
import { ContractAudit } from "./contractAudit.entity";
import { ClubPlayerBiometric } from "./clubPlayerBiometric.entity";
const entities = [
    ClubPlayerBiometric,
    ClubSession,
    ClubSessionTemplate,
    TeamGoal,
    Week,
    SubGoal,
    TeamSession,
    MedicalInformation,
    MedicalHistory,
    Documents,
    MedicalFiles,
    ClubAdmin,
    Contract,
    ContractAudit,
    WorkHistory,
    Manager,
    AthleteCategorySize,
    SportCategory,
    Stock,
    AthleteStock,
    ContractDetails,
    sportClubProfiles,
    WeeklySession,
    PerformanceRecord,
    AthleteRecord,
    AthleteHealthRecords,
    EmergencyContact,
    SportProfile,
    Feedback,
    SessionRecord,
    Session,
    Team,
    Coach,
    AthleteProfile,
    AthleteBattery,
    AthleteBiometric,
    Athlete,
    Academy,
    User,
    Branch,
    ApprovalLog,
    AthleteSubscription,
    ResetToken,
    PublicLink,
    PublicLinkAccess,
    Notification,
    PlanningSession,
    AthleteBankDetails,
    AthleteClothing,
    AthleteDocument,
];

export default entities;
