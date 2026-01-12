import { Button } from "@/components/ui/button";
import Image from "next/image";

function ProjectHeader() {
  return (
    <div className="flex items-center justify-between p-3 border-b ">
      <div className="flex items-center gap-2">
        <Image src={"/logo.png"} alt="Logo" width={40} height={40} />
        <h2 className="text-xl font-semibold">
          <span className="text-primary">UIUX</span> Generator
        </h2>
      </div>

      <Button>Save</Button>
    </div>
  );
}

export default ProjectHeader;
