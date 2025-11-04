import { Metadata } from "next";
import { getTheme } from "@/actions/themes";
import Editor from "@/components/editor/editor";

export const metadata: Metadata = {
  title: "tweakcn — Theme Generator for shadcn/ui",
  description:
    "Easily customize and preview your shadcn/ui theme with tweakcn. Modify colors, fonts, and styles in real-time.",
};

export default async function EditorPage({
  params,
}: {
  params: { themeId?: string[] };
}) {
  const { themeId } = params;
  const themePromise =
    themeId !== undefined && themeId.length > 0
      ? getTheme(themeId[0])
      : Promise.resolve(null);

  return <Editor themePromise={themePromise} />;
}
