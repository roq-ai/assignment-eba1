import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { seriesValidationSchema } from 'validationSchema/series';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.series
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSeriesById();
    case 'PUT':
      return updateSeriesById();
    case 'DELETE':
      return deleteSeriesById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSeriesById() {
    const data = await prisma.series.findFirst(convertQueryToPrismaUtil(req.query, 'series'));
    return res.status(200).json(data);
  }

  async function updateSeriesById() {
    await seriesValidationSchema.validate(req.body);
    const data = await prisma.series.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSeriesById() {
    const data = await prisma.series.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
