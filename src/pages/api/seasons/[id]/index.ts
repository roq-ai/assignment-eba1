import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { seasonValidationSchema } from 'validationSchema/seasons';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.season
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSeasonById();
    case 'PUT':
      return updateSeasonById();
    case 'DELETE':
      return deleteSeasonById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSeasonById() {
    const data = await prisma.season.findFirst(convertQueryToPrismaUtil(req.query, 'season'));
    return res.status(200).json(data);
  }

  async function updateSeasonById() {
    await seasonValidationSchema.validate(req.body);
    const data = await prisma.season.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSeasonById() {
    const data = await prisma.season.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
