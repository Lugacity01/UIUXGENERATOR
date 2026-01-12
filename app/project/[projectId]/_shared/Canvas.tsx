import React, { useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import ScreenFrame from "./ScreenFrame";
import { ProjectType, ScreenConfig } from "@/type/type";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, RefreshCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  projectDetail: ProjectType | undefined;
  screenConfig: ScreenConfig[] | undefined;
};

function Canvas({ projectDetail, screenConfig }: Props) {
  const [panningEnabled, setPanningEnabled] = useState(true);

  const isMobile = projectDetail?.device === "mobile";

  const SCREEN_WIDTH = isMobile ? 400 : 1200;
  const SCREEN_HEIGHT = isMobile ? 800 : 800;
  const GAP = isMobile ? 30 : 70;

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
      <div className="tools absolute p-3 px-5 bg-white shadow flex gap-3 rounded-4xl bottom-1 left-1/2 z-30 text-gray-500">
        <Button variant={'ghost'} size={'sm'} onClick={() => zoomIn()}><Plus/></Button>
        <Button variant={'ghost'} size={'sm'} onClick={() => zoomOut()}><Minus/></Button>
        <Button variant={'ghost'} onClick={() => resetTransform()}><RefreshCcw/></Button>
      </div>
    );
  };

  return (
    <div
      className="w-full h-screen bg-gray-200"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <TransformWrapper
        initialScale={0.7}
        minScale={0.4}
        maxScale={3}
        limitToBounds={false}
        wheel={{ step: 0.8 }}
        panning={{ disabled: !panningEnabled }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (

          <>
           <Controls />
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
            >
              {screenConfig?.map((screen, index) => (
                <div>
                  {screen?.code ? (
                    <ScreenFrame
                      key={screen.screenId ?? index}
                      setPanningEnabled={setPanningEnabled}
                      x={index * (SCREEN_WIDTH + GAP)}
                      y={0}
                      width={SCREEN_WIDTH}
                      height={SCREEN_HEIGHT}
                      htmlCode={screen.code}
                      projectDetail={projectDetail}
                    />
                  ) : (
                    <div
                      className="bg-white rounded-2xl p-5 gap-4 flex flex-col"
                      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
                    >
                      <Skeleton className="w-full rounded-lg h-10 bg-gray-200" />
                      <Skeleton className="w-[50%] rounded-lg h-20 bg-gray-200" />
                      <Skeleton className="w-[70%] rounded-lg h-30 bg-gray-200" />
                      <Skeleton className="w-[30%] rounded-lg h-10 bg-gray-200" />
                      <Skeleton className="w-full rounded-lg h-10 bg-gray-200" />
                      <Skeleton className="w-[50%] rounded-lg h-20 bg-gray-200" />
                      <Skeleton className="w-[70%] rounded-lg h-30 bg-gray-200" />
                      <Skeleton className="w-[30%] rounded-lg h-10 bg-gray-200" />
                    </div>
                  )}
                </div>
              ))}
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export default Canvas;
