"use client";

import React, { useContext, useEffect, useState } from "react";
import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import { useParams } from "next/navigation";
import axios from "axios";
import { ProjectType, ScreenConfig } from "@/type/type";
import { Loader2Icon } from "lucide-react";
import Canvas from "./_shared/Canvas";
import { SettingContext } from "@/context/SettingContext";
import { RefreshDataContext } from "@/context/RefreshDataContext";

function ProjectCanvasPlayground() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<ProjectType>();
  const [screenConfigOriginal, setScreenConfigOriginal] = useState<
    ScreenConfig[]
  >([]);
  const [screenConfig, setScreenConfig] = useState<ScreenConfig[]>([]);
  const {settingDetail, setSettingDetail} = useContext(SettingContext)
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Loading");
  const {refreshData, setRefreshData} = useContext(RefreshDataContext)
  const [takeScreenshot, setTakeScreenshot] = useState<any>();
  

  const GetProjectDetails = async () => {
    setLoading(true);
    setLoadingMsg("Loading...");

    const result = await axios.get(`/api/project?projectId=${projectId}`);
    console.log("Project Details", result.data);

    setProjectDetail(result?.data?.projectDetail);
    setScreenConfigOriginal(result?.data?.screenConfig);
    setScreenConfig(result?.data?.screenConfig);
    setSettingDetail(result?.data?.projectDetail);

    setLoading(false);
  };

   useEffect(() => {
    if (refreshData?.method == "ScreenConfig") {
      GetProjectDetails();
    }
  }, [refreshData]);

  useEffect(() => {
    if (
      projectDetail &&
      screenConfigOriginal &&
      screenConfigOriginal?.length == 0
    ) {
      // console.log("Screen Config Updated", screenConfig);
      generateScreenConfig();
    } else if (projectDetail && screenConfig) {
      GenerateScreenUIUX();
    }
  }, [screenConfigOriginal]);

  const generateScreenConfig = async () => {
    setLoading(true);
    setLoadingMsg("Generating Screen Configuration...");

    const result = await axios.post("/api/generate-config", {
      projectId: projectId,
      deviceType: projectDetail?.device,
      userInput: projectDetail?.userInput,
    });
    console.log("Generated Screen Config", result.data);
    GetProjectDetails();

    setLoading(false);
  };

  useEffect(() => {
    projectId && GetProjectDetails();
  }, []);

  const GenerateScreenUIUX = async () => {
    setLoading(true);

    try {
      for (let index = 0; index < screenConfig.length; index++) {
        const screen = screenConfig[index];

        if (screen?.code) continue;

        setLoadingMsg(`Generating UI for ${index + 1}`);

        const result = await axios.post("/api/generate-screen-ui", {
          projectId,
          screenId: screen.screenId,
          screenName: screen.screenName,
          purpose: screen.purpose,
          screenDescription: screen.screenDescription,
        });

        setScreenConfig((prev) =>
          prev.map((item, i) => (i === index ? result.data : item))
        );

        await new Promise((r) => setTimeout(r, 9000));
      }
    } finally {
      setLoading(false);
      setTakeScreenshot(true)
    }
  };

  return (
    <div>
      <ProjectHeader />

      <div className="flex gap-5">
        {loading && (
          <div className="p-3 absolute bg-blue-300/20 border-blue-600 rounded-xl left-1/2 top-20">
            <h2 className="flex gap-2 items-center">
              <Loader2Icon className="animate-spin" /> {loadingMsg}
            </h2>
          </div>
        )}

        <SettingsSection takeScreenshot={()=>setTakeScreenshot(false)} projectDetail={projectDetail} screenDescription={screenConfig[0]?.screenDescription}/>

        {/* Canvas */}
        <Canvas takeScreenshot={takeScreenshot} projectDetail={projectDetail} screenConfig={screenConfig} />
      </div>
    </div>
  );
}

export default ProjectCanvasPlayground;
