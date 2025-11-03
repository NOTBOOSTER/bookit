import Image from "next/image";
import { Experience } from "@/app/lib/types";
import Link from "next/link";

const ExperienceCard: React.FC<{ experience: Experience }> = ({
  experience,
}) => {
  return (
    <div className="bg-[#F0F0F0] rounded-xl overflow-hidden hover:shadow-sm transition-shadow duration-300">
      <div className="relative h-56">
        <Image
          src={experience.image_url}
          alt={experience.name}
          className="w-full h-full object-cover"
          width={200}
          height={200}
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-[16px] font-[500] text-[#161616]">
            {experience.name}
          </h3>
          <span className="bg-[#D6D6D6] text-[#161616] text-[11px] px-3 py-1 rounded-sm whitespace-nowrap ml-2">
            {experience.location}
          </span>
        </div>

        <p className="text-[#6C6C6C] text-[12px] mb-4 line-clamp-2">
          {experience.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-[#161616]">
            <span className="text-[12px]">From </span>
            <span className="text-xl font-[500]">₹{experience.price}</span>
          </div>
          <Link href={`/experience/${experience.id}`}>
            <button className="bg-[#FFD643] hover:bg-yellow-500 text-[#161616] px-6 py-2 rounded transition-colors duration-200 text-sm font-[500]">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
