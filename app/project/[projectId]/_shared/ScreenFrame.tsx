import { SettingContext } from "@/context/SettingContext";
import { themeToCssVars, THEMES } from "@/data/Themes";
import { ProjectType } from "@/type/type";
import { GripVertical } from "lucide-react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const { settingDetail } = useContext(SettingContext);

  /* -------------------------------------------
   * 1️⃣ Resolve active theme (settings > project)
   * ------------------------------------------- */
  const activeThemeKey = useMemo(() => {
    return (
      settingDetail?.theme ??
      projectDetail?.theme ??
      "AURORA_INK"
    );
  }, [settingDetail?.theme, projectDetail?.theme]);

  const themeObj = THEMES[activeThemeKey as keyof typeof THEMES];

  /* -------------------------------------------
   * 2️⃣ iframe + size state
   * ------------------------------------------- */
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [size, setSize] = useState({ width, height });

  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  /* -------------------------------------------
   * 3️⃣ Build iframe HTML (theme-dependent!)
   * ------------------------------------------- */
  const html = useMemo(() => {
    return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>

  <style>
    ${themeToCssVars(themeObj)}
  </style>
</head>

<body style="background: var(--background); color: var(--foreground); width:100%;">
  ${htmlCode ?? ""}
</body>
</html>
`;
  }, [htmlCode, themeObj]); // 🔥 IMPORTANT

  /* -------------------------------------------
   * 4️⃣ Auto-height measurement
   * ------------------------------------------- */
  const measureIframeHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const headerH = 40;
      const htmlEl = doc.documentElement;
      const body = doc.body;

      const contentH = Math.max(
        htmlEl.scrollHeight,
        body.scrollHeight,
        htmlEl.offsetHeight,
        body.offsetHeight
      );

      const next = Math.min(Math.max(contentH + headerH, 160), 2400);

      setSize((s) =>
        Math.abs(s.height - next) > 2 ? { ...s, height: next } : s
      );
    } catch {
      // sandbox / cross-origin
    }
  }, []);

  /* -------------------------------------------
   * 5️⃣ Re-measure on iframe load + theme change
   * ------------------------------------------- */
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      measureIframeHeight();

      const doc = iframe.contentDocument;
      if (!doc) return;

      const observer = new MutationObserver(measureIframeHeight);
      observer.observe(doc.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      const t1 = setTimeout(measureIframeHeight, 50);
      const t2 = setTimeout(measureIframeHeight, 200);
      const t3 = setTimeout(measureIframeHeight, 600);

      return () => {
        observer.disconnect();
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    };

    iframe.addEventListener("load", onLoad);
    window.addEventListener("resize", measureIframeHeight);

    return () => {
      iframe.removeEventListener("load", onLoad);
      window.removeEventListener("resize", measureIframeHeight);
    };
  }, [measureIframeHeight, html]); // 🔥 html dependency is key

  /* -------------------------------------------
   * 6️⃣ Render
   * ------------------------------------------- */
  return (
    <Rnd
      default={{ x, y, width, height }}
      size={size}
      dragHandleClassName="drag-handle"
      enableResizing={{ bottomLeft: true, bottomRight: true }}
      onDragStart={() => setPanningEnabled(false)}
      onDragStop={() => setPanningEnabled(true)}
      onResizeStart={() => setPanningEnabled(false)}
      onResizeStop={(_, __, ref) => {
        setPanningEnabled(true);
        setSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}
    >
      <div className="drag-handle flex gap-2 items-center cursor-move bg-white rounded-lg p-4">
        <GripVertical className="h-4 w-4 text-gray-500" />
        Drag Here
      </div>

      <div className="bg-white rounded-2xl mt-5 h-full p-5">
        <iframe
          ref={iframeRef}
          key={activeThemeKey} 
          className="w-full h-full bg-white"
          sandbox="allow-same-origin allow-scripts"
          srcDoc={html}
        />
      </div>
    </Rnd>
  );
}

export default ScreenFrame;
