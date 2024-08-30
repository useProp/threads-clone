import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { userId, name, image, text, picture } = await readBody(event);
	console.log(picture)

	const newPost = await prisma.posts.create({
		data: {
			userId,
			name,
			image,
			text,
			picture,
		}
	});
	return newPost;
});