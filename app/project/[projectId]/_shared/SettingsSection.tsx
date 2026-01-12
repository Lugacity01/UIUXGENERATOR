"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SettingContext } from "@/context/SettingContext";
import { THEME_NAME_LIST, THEMES } from "@/data/Themes";
import { ProjectType } from "@/type/type";
import { Camera, Share, Sparkle } from "lucide-react";
import { Project } from "next/dist/build/swc/types";
import React, { useContext, useEffect, useState } from "react";

type Props = {
  projectDetail: ProjectType | undefined;
};

function SettingsSection({ projectDetail }: Props) {
  const [selectedTheme, setSelectedTheme] = useState("AURORA_INK");
  const [projectName, setProjectName] = useState(projectDetail?.projectName);
  const [userNewScreenPrompt, setUserNewScreenPrompt] = useState<string>("");
  const { settingDetail, setSettingDetail } = useContext(SettingContext);

  useEffect(() => {
    projectDetail && setProjectName(projectDetail?.projectName);
    setSelectedTheme(projectDetail?.theme as string);
  }, [projectDetail]);

  const onThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    setSettingDetail((prev: any) => ({
      ...prev,
      theme: theme,
    }));
  };

  return (
    <div className="w-[300px] p-5 border-r h-[90vh]">
      <h2 className="font-medium text-lg">Settings</h2>

      <div className="mt-3">
        <h2 className="text-sm mb-1">Project Name</h2>
        <Input
          onChange={(event) => {
            setProjectName(event.target.value);
            setSettingDetail((prev: any) => ({
              ...prev,
              projectName: projectName,
            }));
          }}
          value={projectName}
          placeholder="Project Name"
        />
      </div>

      <div className="mt-3">
        <h2 className="text-sm mb-1">Generate New Screen</h2>
        <Textarea
          onChange={(event) => setUserNewScreenPrompt(event.target.value)}
          placeholder="Enter Prompt to generate screen using AI"
        />
        <Button size={"sm"} className="mt-2 w-full">
          <Sparkle /> Generate with AI{" "}
        </Button>
      </div>

      <div className="mt-3">
        <h2 className="text-sm mb-1">Theme</h2>
        <div className="h-[200px] overflow-auto">
          <div>
            {THEME_NAME_LIST.map((theme, index) => (
              <div
                key={index}
                onClick={() => onThemeSelect(theme)}
                className={`p-3 border mb-2 rounded-lg cursor-pointer hover:border-primary ${
                  theme === selectedTheme && "border-primary bg-primary/20"
                }`}
              >
                <h2>{theme}</h2>
                <div className="flex gap-2 ">
                  <div
                    className={`h-4 w-4 rounded-full `}
                    style={{ background: THEMES[theme].primary }}
                  />
                  <div
                    className={`h-4 w-4 rounded-full`}
                    style={{ background: THEMES[theme].secondary }}
                  />
                  <div
                    className={`h-4 w-4 rounded-full`}
                    style={{ background: THEMES[theme].accent }}
                  />
                  <div
                    className={`h-4 w-4 rounded-full`}
                    style={{
                      background: `linear-gradient(
                        135deg, ${THEMES[theme].background},
                        ${THEMES[theme].primary},
                        ${THEMES[theme].accent})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-sm mb-1">Extras</h2>

        <div className="flex gap-3">
          <Button variant={"outline"} size={"sm"} className="mt-2">
            <Camera />
            Screenshot
          </Button>
          <Button variant={"outline"} size={"sm"} className="mt-2">
            <Share />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SettingsSection;
