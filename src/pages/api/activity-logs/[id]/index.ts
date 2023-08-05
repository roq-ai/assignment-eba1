import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { activityLogValidationSchema } from 'validationSchema/activity-logs';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.activity_log
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getActivityLogById();
    case 'PUT':
      return updateActivityLogById();
    case 'DELETE':
      return deleteActivityLogById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getActivityLogById() {
    const data = await prisma.activity_log.findFirst(convertQueryToPrismaUtil(req.query, 'activity_log'));
    return res.status(200).json(data);
  }

  async function updateActivityLogById() {
    await activityLogValidationSchema.validate(req.body);
    const data = await prisma.activity_log.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteActivityLogById() {
    const data = await prisma.activity_log.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
