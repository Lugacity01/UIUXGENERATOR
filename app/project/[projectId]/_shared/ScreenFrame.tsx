import { themeToCssVars, THEMES } from "@/data/Themes";
import { ProjectType } from "@/type/type";
import { GripVertical } from "lucide-react";
import { Rnd } from "react-rnd";

type Props = {
  x: number;
  y: number;
  setPanningEnabled: (enabled: boolean) => void;
  width: number;
  height: number;
  htmlCode: string | undefined;
  projectDetail: ProjectType | undefined;
};

function ScreenFrame({
  x,
  y,
  setPanningEnabled,
  width,
  height,
  htmlCode,
  projectDetail,
}: Props) {
  // ✅ FIX: map theme key → theme object
  const themeObj =
    projectDetail?.theme &&
    THEMES[projectDetail.theme as keyof typeof THEMES]
      ? THEMES[projectDetail.theme as keyof typeof THEMES]
      : null;

  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Tailwind CDN (v3) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Iconify -->
  <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>

  <style>
    ${themeObj ? themeToCssVars(themeObj) : ""}
  </style>
</head>

<body style="background: var(--background); color: var(--foreground); width: 100%;">
  ${htmlCode ?? ""}
</body>
</html>
`;

  return (
    <Rnd
      default={{
        x,
        y,
        width,
        height,
      }}
      dragHandleClassName="drag-handle"
      enableResizing={{ bottomLeft: true, bottomRight: true }}
      onDragStart={() => setPanningEnabled(false)}
      onDragStop={() => setPanningEnabled(true)}
      onResizeStart={() => setPanningEnabled(false)}
      onResizeStop={() => setPanningEnabled(true)}
    >
      <div className="drag-handle flex gap-2 items-center cursor-move bg-white rounded-lg p-4">
        <GripVertical className="h-4 w-4 text-gray-500" />
        Drag Here
      </div>

      <div className="bg-white rounded-2xl mt-5 h-full p-5">
        <iframe
          className="w-full h-full bg-white "
          sandbox="allow-same-origin allow-scripts"
          srcDoc={html}
        />
      </div>
    </Rnd>
  );
}

export default ScreenFrame;
