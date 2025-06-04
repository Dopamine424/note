import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-2-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px] hidden">
          <Image src="/logo.svg" fill alt="logo" className="object-contain" />
        </div>
        <div className="relative h-[400px] w-[400px] hidden">
          <Image src="/logo.svg" fill className="object-contain" alt="logo" />
        </div>
      </div>
    </div>
  );
};
