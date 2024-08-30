import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const deletedLike = await prisma.likes.delete({
		where: { id: Number(event.context.params.id) }
	});
	return deletedLike;
});