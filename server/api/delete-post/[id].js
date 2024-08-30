import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const deletedPost = await prisma.posts.delete({
		where: { id: Number(event.context.params.id) }
	});
	return deletedPost;
});