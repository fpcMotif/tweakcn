import { MoreVertical } from "lucide-react";
import { useState } from "react";
import McpIcon from "@/assets/mcp.svg";
import ContrastChecker from "@/components/editor/contrast-checker";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditorStore } from "@/store/editor-store";
import { MCPDialog } from "./mcp-dialog";

interface MoreOptionsProps
  extends React.ComponentProps<typeof DropdownMenuTrigger> {}

export function MoreOptions({ ...props }: MoreOptionsProps) {
  const [mcpDialogOpen, setMcpDialogOpen] = useState(false);
  const { themeState } = useEditorStore();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild {...props}>
          <Button size="icon" variant="ghost">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-foreground">
          <DropdownMenuItem asChild onClick={() => setMcpDialogOpen(true)}>
            <Button className="w-full justify-start" size="sm" variant="ghost">
              <McpIcon className="h-4 w-4" />
              <span className="text-sm">MCP</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
            <ContrastChecker
              currentStyles={themeState.styles[themeState.currentMode]}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MCPDialog onOpenChange={setMcpDialogOpen} open={mcpDialogOpen} />
    </>
  );
}
