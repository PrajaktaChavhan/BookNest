import { Report } from './report.model.js';
import { ApiError } from '../../utils/ApiError.js';

export async function createReport(reporterId, { targetType, targetId, reason }) {
  return Report.create({ reportedBy: reporterId, targetType, targetId, reason });
}

export async function resolveReport(reportId) {
  const report = await Report.findByIdAndUpdate(
    reportId,
    { $set: { status: 'Resolved' } },
    { new: true }
  );
  if (!report) throw ApiError.notFound('Report not found');
  return report;
}

export async function getOpenReports() {
  return Report.find({ status: 'Open' })
    .sort({ createdAt: -1 })
    .populate('reportedBy', 'name email');
}