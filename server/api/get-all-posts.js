import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const posts = await prisma.posts.findMany({
		orderBy: { id: 'desc' },
		include: { likes: true },
	});
	return posts;
});