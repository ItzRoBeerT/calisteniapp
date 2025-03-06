import Image from 'next/image';
import { getExerciseByName } from '@/actions/exercise';
import { desSlugify } from '@/utils/slugs';
import DefaultImage from '@/public/images/default_image.webp';

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;
	const exercise = await getExerciseByName(desSlugify(slug));
	console.log(exercise);
	if (!exercise) {
		return null;
	}
	return (
		<section className="relative pt-16 bg-blueGray-50">
			<div className="container mx-auto">
				<div className="flex flex-wrap items-center">
					<div className="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto">
						<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-primary">
							<Image
								alt="Exercise Image"
								src={exercise.image || DefaultImage}
								width={600}
								height={400}
								className="w-full align-middle rounded-t-lg"
							/>
							<blockquote className="relative p-8 mb-4">
								<h4 className="text-xl font-bold ">
									{exercise.name}
								</h4>
							</blockquote>
						</div>
					</div>
					<div className="w-full md:w-6/12 px-4">
						<div className="flex flex-wrap">
							<div className="w-full md:w-6/12 flex">
								<h4 className="text-xl font-bold pb-2">
									Descripcion
								</h4>
							</div>
							<p>{exercise.description}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
