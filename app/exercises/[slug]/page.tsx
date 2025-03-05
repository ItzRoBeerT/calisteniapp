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
	if (!exercise) {
		return null;
	}
	return (
		<section className="relative pt-16 bg-blueGray-50">
			<div className="container mx-auto">
				<div className="flex flex-wrap items-center">
					<div className="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto">
						<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-primary-500">
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
						<div className="w-full flex flex-wrapitems-start justify-between">
							{exercise.muscles?.map(
								(muscle: string, index: number) => {
									if (muscle == 'legs') {
										return (
											<div
												key={index}
												className="bg-primary-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full mr-[5px]"
											>
												<Image
													alt="Leg Icon"
													src={Leg}
													className="w-8 h-8"
												/>
											</div>
										);
									}
									return null;
								}
							)}
							{exercise.muscle_group?.map(
								(muscle_group: string, index: number) => {
									if (muscle_group == 'legs') {
										return (
											<div
												key={index}
												className="bg-secondary-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full mr-[5px]"
											>
												<Image
													alt="Leg Icon"
													src={Leg}
													className="w-8 h-8"
												/>
											</div>
										);
									}
									return null;
								}
							)}
							<div className="flex items-start ml-auto md:mt-0">
								{exercise.family && exercise.family[0] && (
									<NavLink
										href={`/family/${exercise.family[0]}`}
										className="bg-secondary-500 rounded p-2 hover:bg-secondary-700"
									>
										{exercise.family[0]}
									</NavLink>
								)}
							</div>
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
