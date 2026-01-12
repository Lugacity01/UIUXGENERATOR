import { Button } from "@/components/ui/button";
import { SettingContext } from "@/context/SettingContext";
import axios from "axios";
import { Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";
import { toast } from "sonner";

function ProjectHeader() {
  const { settingDetail, setSettingDetail } = useContext(SettingContext);
  const [loading, setLoading] = useState(false);

  const OnSave = async () => {
    try {
      setLoading(true);
      const result = await axios.put("/api/project", {
        theme: settingDetail?.theme,
        projectId: settingDetail?.projectId,
        projectName: settingDetail?.projectName,
      });

      setLoading(false);
      toast.success("Setting Saved!");
    } catch (e) {
      setLoading(false);
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b ">
      <div className="flex items-center gap-2">
        <Image src={"/logo.png"} alt="Logo" width={40} height={40} />
        <h2 className="text-xl font-semibold">
          <span className="text-primary">UIUX</span> Generator
        </h2>
      </div>

      <Button disabled={loading} onClick={OnSave}>
        {loading ? <Loader2 className="animate-spin" /> : <Save />}Save
      </Button>
    </div>
  );
}

export default ProjectHeader;
