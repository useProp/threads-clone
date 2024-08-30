import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { userId, postId } = await readBody(event);

	const newLike = await prisma.likes.create({
		data: {
			userId,
			postId,
		}
	});
	return newLike;
});